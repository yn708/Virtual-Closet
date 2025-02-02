from django.core.files.storage import default_storage
from django.db import models

from apps.accounts.models import CustomUser
from core.mixins.timestamp_mixin import TimestampMixin
from core.utils.storages import CustomStorage

"""
コーディネート自動提案において、
精度を高めるため、様々なパターンから提案を行う予定。
そのため、単純なデータでもモデルで作成しておく
"""


# カテゴリー（例：トップス）
class Category(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    category_name = models.CharField(max_length=100)

    def __str__(self):
        return self.category_name


# サブカテゴリー（例：Tシャツ）
class SubCategory(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    subcategory_name = models.CharField(max_length=100)
    category = models.ForeignKey(Category, related_name="subcategories", on_delete=models.CASCADE)

    def __str__(self):
        return self.subcategory_name


# ブランド（例：ユニクロ）
class Brand(models.Model):
    brand_name = models.CharField(max_length=100, unique=True)
    brand_name_kana = models.CharField(max_length=100)
    is_popular = models.BooleanField(default=False)

    class Meta:
        ordering = ["brand_name"]  # brand_name でソート

    def __str__(self):
        return self.brand_name


# シーズン
class Season(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    season_name = models.CharField(max_length=20, unique=True)

    def __str__(self):
        return self.season_name


# デザイン・柄（例：無地、ストライプ）
class Design(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    design_pattern = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.design_pattern


# カラー
class Color(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    color_name = models.CharField(max_length=50, unique=True)
    color_code = models.CharField(max_length=50)

    def __str__(self):
        return self.color_name


# 価格範囲（例: ¥1,000 〜 ¥1,999）
class PriceRange(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    price_range = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.price_range


# ファッションアイテム
class FashionItem(TimestampMixin, models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)  # ユーザーとの関連付け
    sub_category = models.ForeignKey(SubCategory, on_delete=models.DO_NOTHING)
    brand = models.ForeignKey(Brand, on_delete=models.DO_NOTHING, null=True, blank=True)  # ブランド未選択可能
    seasons = models.ManyToManyField(Season, blank=True)  # シーズン未選択可能
    price_range = models.ForeignKey(PriceRange, on_delete=models.DO_NOTHING, null=True, blank=True)  # 価格未選択可能
    design = models.ForeignKey(Design, on_delete=models.DO_NOTHING, null=True, blank=True)  # デザイン未選択可能
    main_color = models.ForeignKey(Color, on_delete=models.DO_NOTHING, null=True, blank=True)  # カラー未選択可能
    image = models.ImageField(upload_to="fashion_item/", storage=CustomStorage())
    is_owned = models.BooleanField(default=True)
    is_old_clothes = models.BooleanField(default=False)

    class Meta:
        ordering = ["-created_at"]  # 作成日時の降順でソート

    def __str__(self):
        brand_name = self.brand.brand_name if self.brand else "No Brand"
        sub_category_name = self.sub_category.subcategory_name if self.sub_category else "No Subcategory"
        ownership = "Owned" if self.is_owned else "Not Owned"
        return f"{brand_name} - {sub_category_name} ({ownership})"

    def delete(self, *args, **kwargs):
        # 画像ファイルを削除
        if self.image:
            # ローカルパスの参照を削除し、storage経由で削除
            if default_storage.exists(self.image.name):
                default_storage.delete(self.image.name)
        super().delete(*args, **kwargs)
