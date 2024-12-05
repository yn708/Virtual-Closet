from django.db import transaction
from rest_framework.serializers import (
    ModelSerializer,
    PrimaryKeyRelatedField,
    Serializer,
)

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


# データをまとめて返す（ファッションアイテム登録時に必要）
class MetaDataSerializer(Serializer):
    categories = CategorySerializer(many=True, read_only=True)
    seasons = SeasonSerializer(many=True, read_only=True)
    designs = DesignSerializer(many=True, read_only=True)
    colors = ColorSerializer(many=True, read_only=True)
    price_ranges = PriceRangeSerializer(many=True, read_only=True)
    popular_brands = BrandSerializer(many=True)


# ファッションアイテム登録時
class RegisterFashionItemSerializer(ModelSerializer):
    brand = PrimaryKeyRelatedField(queryset=Brand.objects.all(), allow_null=True, required=False)
    sub_category = PrimaryKeyRelatedField(queryset=SubCategory.objects.all())
    seasons = PrimaryKeyRelatedField(many=True, queryset=Season.objects.all(), required=False)
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

    @transaction.atomic
    def create(self, validated_data):
        # seasonsフィールドを取り出し
        seasons = validated_data.pop("seasons", [])

        # FashionItemオブジェクトを作成
        fashion_item = FashionItem.objects.create(**validated_data)

        # シーズンを設定
        fashion_item.seasons.set(seasons)

        return fashion_item
