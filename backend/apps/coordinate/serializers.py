from django.core.exceptions import ValidationError
from django.db import transaction
from rest_framework import serializers
from rest_framework.serializers import PrimaryKeyRelatedField

from apps.accounts.constants import IMAGE_SIZE_ERROR, MAX_IMAGE_SIZE
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

    def validate(self, data):
        """全コーディネートの合計が100件を超えないようにバリデーション"""
        user = self.context["request"].user
        photo_coordinate_count = PhotoCoordinate.objects.filter(user=user).count()
        custom_coordinate_count = CustomCoordinate.objects.filter(user=user).count()
        current_count = photo_coordinate_count + custom_coordinate_count

        if current_count >= 100:
            raise serializers.ValidationError("アップロードできるコーディネートは最大100件までです。")

        return data

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


class CoordinateItemSerializer(serializers.ModelSerializer):
    item = serializers.PrimaryKeyRelatedField(queryset=FashionItem.objects.all())
    position_data = serializers.JSONField()

    class Meta:
        model = CoordinateItem
        fields = ["item", "position_data"]


# PhotoCoordinate
class PhotoCoordinateSerializer(BaseCoordinateSerializer):
    class Meta:
        model = PhotoCoordinate
        fields = ["image", "seasons", "scenes", "tastes"]

    def validate_image(self, value):
        if value and value.size > MAX_IMAGE_SIZE:
            raise serializers.ValidationError(IMAGE_SIZE_ERROR)
        return value

    @transaction.atomic
    def create(self, validated_data):
        seasons = validated_data.pop("seasons", [])
        scenes = validated_data.pop("scenes", [])
        tastes = validated_data.pop("tastes", [])

        coordinate = PhotoCoordinate.objects.create(**validated_data)

        self._set_many_to_many_fields(coordinate, seasons, scenes, tastes)

        try:
            coordinate.save()
        except ValidationError as err:
            raise serializers.ValidationError(err.message_dict) from err

        return coordinate

    def to_internal_value(self, data):
        # リストデータを正しく処理
        for field in ["seasons", "scenes", "tastes"]:
            if field in data:
                if hasattr(data, "getlist"):
                    values = data.getlist(field)
                    # '[]' という文字列が送られてきた場合は空配列として扱う
                    if len(values) == 1 and (values[0] == "[]" or values[0] == ""):
                        values = []
                else:
                    values = data.get(field, [])
                    if values == "[]" or values == "":
                        values = []

                data = data.copy()
                if hasattr(data, "setlist"):
                    data.setlist(field, values)
                else:
                    data[field] = values
        return super().to_internal_value(data)

    @transaction.atomic
    def update(self, instance, validated_data):
        # 画像フィールドの処理
        if "image" in validated_data:
            if instance.image and instance.image != validated_data["image"]:
                storage = instance.image.storage
                if storage.exists(instance.image.name):
                    storage.delete(instance.image.name)
            instance.image = validated_data["image"]

        # 多対多フィールドの処理
        for field in ["seasons", "scenes", "tastes"]:
            if field in validated_data:
                # 必ず既存の関連をクリア
                getattr(instance, field).clear()
                # seasonsが空でない場合のみsetを実行
                field_data = validated_data.pop(field, [])
                if field_data:
                    getattr(instance, field).set(field_data)

        instance.save()
        return instance


class DetailedPhotoCoordinateSerializer(BaseCoordinateSerializer):
    seasons = SeasonSerializer(many=True, read_only=True)
    scenes = SceneSerializer(many=True, read_only=True)
    tastes = TasteSerializer(many=True, read_only=True)

    class Meta:
        model = PhotoCoordinate
        fields = ["id", "image", "seasons", "scenes", "tastes"]


# CustomCoordinate
class CustomCoordinateSerializer(BaseCoordinateSerializer):
    items = CoordinateItemSerializer(source="coordinate_item_set", many=True, required=True)

    class Meta:
        model = CustomCoordinate
        fields = ["image", "items", "background", "seasons", "scenes", "tastes"]

    def validate_image(self, value):
        if value and value.size > MAX_IMAGE_SIZE:
            raise serializers.ValidationError(IMAGE_SIZE_ERROR)
        return value

    def validate_items(self, value):
        if len(value) < 2:
            raise serializers.ValidationError("コーディネートには最低2つのアイテムが必要です。")
        if len(value) > 10:
            raise serializers.ValidationError("コーディネートは最大10アイテムまで登録可能です。")
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

    def to_internal_value(self, data):
        # リストデータを正しく処理
        for field in ["seasons", "scenes", "tastes"]:
            if field in data:
                if hasattr(data, "getlist"):
                    values = data.getlist(field)
                    # '[]' という文字列が送られてきた場合は空配列として扱う
                    if len(values) == 1 and (values[0] == "[]" or values[0] == ""):
                        values = []
                else:
                    values = data.get(field, [])
                    if values == "[]" or values == "":
                        values = []

                data = data.copy()
                if hasattr(data, "setlist"):
                    data.setlist(field, values)
                else:
                    data[field] = values
        return super().to_internal_value(data)

    @transaction.atomic
    def update(self, instance, validated_data):
        # 画像フィールドの処理
        if "image" in validated_data:
            if instance.image and instance.image != validated_data["image"]:
                storage = instance.image.storage
                if storage.exists(instance.image.name):
                    storage.delete(instance.image.name)
            instance.image = validated_data["image"]

        # 背景色の更新
        if "background" in validated_data:
            instance.background = validated_data["background"]

        # アイテムの更新
        if "coordinate_item_set" in validated_data:
            # 既存のアイテムを削除
            instance.coordinate_item_set.all().delete()

            # 新しいアイテムを作成
            for item_data in validated_data["coordinate_item_set"]:
                CoordinateItem.objects.create(
                    coordinate=instance, item=item_data["item"], position_data=item_data["position_data"]
                )

        # 多対多フィールドの処理
        for field in ["seasons", "scenes", "tastes"]:
            if field in validated_data:
                # 必ず既存の関連をクリア
                getattr(instance, field).clear()
                # seasonsが空でない場合のみsetを実行
                field_data = validated_data.pop(field, [])
                if field_data:
                    getattr(instance, field).set(field_data)

        instance.save()
        return instance


class DetailedCustomCoordinateSerializer(BaseCoordinateSerializer):
    seasons = SeasonSerializer(many=True, read_only=True)
    scenes = SceneSerializer(many=True, read_only=True)
    tastes = TasteSerializer(many=True, read_only=True)

    class Meta:
        model = CustomCoordinate
        fields = ["id", "image", "seasons", "scenes", "tastes"]


class CoordinatePositionSerializer(serializers.ModelSerializer):
    items = serializers.SerializerMethodField()

    class Meta:
        model = CustomCoordinate
        fields = ["items", "background"]

    def get_items(self, obj):
        items = obj.coordinate_item_set.all()
        return [
            {
                "item_id": item.item.id,
                "image": item.item.image.url if item.item.image else None,
                "position_data": item.position_data,
            }
            for item in items
        ]
