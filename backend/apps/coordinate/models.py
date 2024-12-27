from django.db import models

from apps.accounts.models import CustomUser
from apps.fashion_items.models import FashionItem, Season
from core.mixins.timestamp_mixin import TimestampMixin


# シーン（例：休日）
class Scene(models.Model):
    scene = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.scene


# テイスト（例：古着コーデ）
class Taste(models.Model):
    taste = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.taste


# 写真投稿用コーディネートモデル
class PhotoCoordinate(TimestampMixin, models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    image = models.ImageField(upload_to="coordinations/")
    seasons = models.ManyToManyField(Season, blank=True)
    scenes = models.ManyToManyField(Scene, blank=True)
    tastes = models.ManyToManyField(Taste, blank=True)

    def __str__(self):
        return f"Post by {self.user.username}"


# コーディネートモデル（カスタマイズ用）
class CustomCoordinate(TimestampMixin, models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    items = models.ManyToManyField(FashionItem, through="CoordinateItem", related_name="coordinates")
    seasons = models.ManyToManyField(Season, blank=True)
    scenes = models.ManyToManyField(Scene, blank=True)
    tastes = models.ManyToManyField(Taste, blank=True)
    preview_image = models.ImageField(upload_to="coordinations/previews/")  # プレビュー画像の追加

    def __str__(self):
        return f"Coordinate by {self.user.username}"


class CoordinateItem(models.Model):
    """コーディネートとアイテムの中間テーブル"""

    coordinate = models.ForeignKey(
        CustomCoordinate,
        on_delete=models.CASCADE,
        related_name="coordinate_item_set",
    )
    item = models.ForeignKey(FashionItem, on_delete=models.CASCADE)
    position_data = models.JSONField(default=dict)  # x, y, scale, rotate, zIndex を保存

    class Meta:
        ordering = ["position_data__zIndex"]  # zIndexでの並び順
        unique_together = ["coordinate", "item"]  # 同じアイテムを2回使用することを防ぐ


def __str__(self):
    z_index = self.position_data.get("zIndex", "")  # zIndexが存在しない場合は空文字を返す
    layer_info = f" (Layer: {z_index})" if z_index != "" else ""
    return f"{self.item} in {self.coordinate}{layer_info}"
