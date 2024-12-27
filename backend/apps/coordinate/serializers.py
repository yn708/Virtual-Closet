from django.core.exceptions import ValidationError
from django.db import transaction
from rest_framework import serializers
from rest_framework.serializers import PrimaryKeyRelatedField

from apps.fashion_items.models import FashionItem, Season
from apps.fashion_items.serializers import SeasonSerializer

from .models import CoordinateItem, CustomCoordinate, PhotoCoordinate, Scene, Taste


class SceneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Scene
        fields = ["id", "scene"]


class TasteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Taste
        fields = ["id", "taste"]


# データをまとめて返す（コーディネート登録時に必要）
class MetaDataSerializer(serializers.Serializer):
    seasons = SeasonSerializer(many=True, read_only=True)
    scenes = SceneSerializer(many=True, read_only=True)
    tastes = TasteSerializer(many=True, read_only=True)


class BaseCoordinateSerializer(serializers.ModelSerializer):
    seasons = PrimaryKeyRelatedField(many=True, queryset=Season.objects.all(), required=False)
    scenes = PrimaryKeyRelatedField(many=True, queryset=Scene.objects.all(), required=False)
    tastes = PrimaryKeyRelatedField(many=True, queryset=Taste.objects.all(), required=False)

    def validate_scenes(self, value):
        if len(value) > 3:
            raise serializers.ValidationError("シーンは最大3つまで選択可能です。")
        return value

    def validate_tastes(self, value):
        if len(value) > 3:
            raise serializers.ValidationError("テイストは最大3つまで選択可能です。")
        return value

    def _set_many_to_many_fields(self, instance, seasons=None, scenes=None, tastes=None):
        if seasons is not None:
            instance.seasons.set(seasons)
        if scenes is not None:
            instance.scenes.set(scenes)
        if tastes is not None:
            instance.tastes.set(tastes)


class PhotoCoordinateSerializer(BaseCoordinateSerializer):
    class Meta:
        model = PhotoCoordinate
        fields = ["user", "image", "seasons", "scenes", "tastes", "created_at", "updated_at"]
        read_only_fields = ["user", "created_at", "updated_at"]

    @transaction.atomic
    def create(self, validated_data):
        seasons = validated_data.pop("seasons", [])
        scenes = validated_data.pop("scenes", [])
        tastes = validated_data.pop("tastes", [])

        user = self.context["request"].user
        coordinate = PhotoCoordinate.objects.create(user=user, **validated_data)

        self._set_many_to_many_fields(coordinate, seasons, scenes, tastes)

        try:
            coordinate.save()
        except ValidationError as err:
            raise serializers.ValidationError(err.message_dict) from err

        return coordinate


class CoordinateItemSerializer(serializers.ModelSerializer):
    item = serializers.PrimaryKeyRelatedField(queryset=FashionItem.objects.all())
    position_data = serializers.JSONField()

    class Meta:
        model = CoordinateItem
        fields = ["item", "position_data"]


class CustomCoordinateSerializer(BaseCoordinateSerializer):
    items = CoordinateItemSerializer(source="coordinate_item_set", many=True, required=True)

    class Meta:
        model = CustomCoordinate
        fields = ["id", "items", "seasons", "scenes", "tastes", "preview_image", "created_at", "updated_at"]
        read_only_fields = ["created_at", "updated_at"]

    def validate_items(self, value):
        if len(value) < 2:
            raise serializers.ValidationError("コーディネートには最低2つのアイテムが必要です。")
        if len(value) > 20:
            raise serializers.ValidationError("コーディネートは最大20アイテムまで登録可能です。")
        return value

    @transaction.atomic
    def create(self, validated_data):
        items_data = validated_data.pop("coordinate_item_set", [])
        seasons = validated_data.pop("seasons", [])
        scenes = validated_data.pop("scenes", [])
        tastes = validated_data.pop("tastes", [])

        user = self.context["request"].user
        coordinate = CustomCoordinate.objects.create(user=user, **validated_data)

        # アイテムの作成
        for item_data in items_data:
            CoordinateItem.objects.create(
                coordinate=coordinate, item=item_data["item"], position_data=item_data["position_data"]
            )

        self._set_many_to_many_fields(coordinate, seasons, scenes, tastes)
        return coordinate
