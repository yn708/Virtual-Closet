from django.db import transaction
from rest_framework import serializers
from rest_framework.serializers import (
    ModelSerializer,
    PrimaryKeyRelatedField,
    Serializer,
)

from apps.accounts.constants import IMAGE_SIZE_ERROR, MAX_IMAGE_SIZE

from .models import Brand, Category, Color, Design, FashionItem, PriceRange, Season, SubCategory


# サブカテゴリー
class SubCategorySerializer(ModelSerializer):
    class Meta:
        model = SubCategory
        fields = ["id", "subcategory_name", "category"]


# カテゴリー
class CategorySerializer(ModelSerializer):
    subcategories = SubCategorySerializer(many=True, read_only=True)

    class Meta:
        model = Category
        fields = ["id", "category_name", "subcategories"]


# シーズン
class SeasonSerializer(ModelSerializer):
    class Meta:
        model = Season
        fields = ["id", "season_name"]


# デザイン・柄
class DesignSerializer(ModelSerializer):
    class Meta:
        model = Design
        fields = ["id", "design_pattern"]


# カラー
class ColorSerializer(ModelSerializer):
    class Meta:
        model = Color
        fields = ["id", "color_name", "color_code"]


# 価格範囲
class PriceRangeSerializer(ModelSerializer):
    class Meta:
        model = PriceRange
        fields = ["id", "price_range"]


# ブランド
class BrandSerializer(ModelSerializer):
    class Meta:
        model = Brand
        fields = ["id", "brand_name", "brand_name_kana", "is_popular"]


"""
必要最低限のみのデータを返すためのシリアライザー
"""


class MinimumBrandSerializer(ModelSerializer):
    class Meta:
        model = Brand
        fields = ["id", "brand_name", "brand_name_kana"]


# データをまとめて返す（ファッションアイテム登録時に必要）
class MetaDataSerializer(Serializer):
    categories = CategorySerializer(many=True, read_only=True)
    seasons = SeasonSerializer(many=True, read_only=True)
    designs = DesignSerializer(many=True, read_only=True)
    colors = ColorSerializer(many=True, read_only=True)
    price_ranges = PriceRangeSerializer(many=True, read_only=True)
    popular_brands = BrandSerializer(many=True)


# 詳細を含めて返すためのシリアライザー
class DetailedFashionItemSerializer(ModelSerializer):
    sub_category = SubCategorySerializer(read_only=True)
    brand = MinimumBrandSerializer(read_only=True)
    seasons = SeasonSerializer(many=True, read_only=True)
    price_range = PriceRangeSerializer(read_only=True)
    design = DesignSerializer(read_only=True)
    main_color = ColorSerializer(read_only=True)

    class Meta:
        model = FashionItem
        fields = [
            "id",
            "image",
            "sub_category",
            "brand",
            "seasons",
            "price_range",
            "design",
            "main_color",
            "is_owned",
            "is_old_clothes",
            "created_at",
            "updated_at",
        ]


# 登録・更新用のシリアライザー
class FashionItemSerializer(ModelSerializer):
    brand = PrimaryKeyRelatedField(queryset=Brand.objects.all(), allow_null=True, required=False)
    sub_category = PrimaryKeyRelatedField(queryset=SubCategory.objects.all())
    seasons = PrimaryKeyRelatedField(
        many=True,
        queryset=Season.objects.all(),
        required=False,
    )
    price_range = PrimaryKeyRelatedField(queryset=PriceRange.objects.all(), allow_null=True, required=False)
    design = PrimaryKeyRelatedField(queryset=Design.objects.all(), allow_null=True, required=False)
    main_color = PrimaryKeyRelatedField(queryset=Color.objects.all(), allow_null=True, required=False)

    class Meta:
        model = FashionItem
        fields = [
            "id",
            "image",
            "sub_category",
            "brand",
            "seasons",
            "price_range",
            "design",
            "main_color",
            "is_owned",
            "is_old_clothes",
        ]

    def to_internal_value(self, data):
        # 辞書形式でもQueryDict形式でも動作するように修正
        if "seasons" in data:
            if hasattr(data, "getlist"):
                seasons = data.getlist("seasons")
            else:
                seasons = data.get("seasons", [])

            if not seasons:
                data = data.copy()
                if hasattr(data, "setlist"):
                    data.setlist("seasons", [])
                else:
                    data["seasons"] = []
        return super().to_internal_value(data)

    @transaction.atomic
    def create(self, validated_data):
        seasons = validated_data.pop("seasons", [])
        fashion_item = FashionItem.objects.create(**validated_data)
        if seasons:
            fashion_item.seasons.set(seasons)
        return fashion_item

    def validate_image(self, value):
        """画像のバリデーション"""
        if value and value.size > MAX_IMAGE_SIZE:
            raise serializers.ValidationError(IMAGE_SIZE_ERROR)
        return value

    @transaction.atomic
    def update(self, instance, validated_data):
        # seasonsが空リストの場合の処理
        if "seasons" in validated_data:
            instance.seasons.clear()  # 既存のシーズンをすべて削除
            if validated_data["seasons"]:  # 新しいシーズンがある場合のみ追加
                instance.seasons.set(validated_data["seasons"])

        # その他のフィールドの更新
        for attr, value in validated_data.items():
            if attr != "seasons":
                setattr(instance, attr, value)

        instance.save()
        return instance
