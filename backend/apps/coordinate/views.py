import random
from io import BytesIO

import requests
from django.conf import settings
from django.core.files.base import ContentFile
from django.utils import timezone
from PIL import Image
from rest_framework import serializers, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet

from apps.fashion_items.models import FashionItem, Season

from .constants import REFERENCE_HEIGHT, REFERENCE_ITEM_SIZE, REFERENCE_WIDTH, TAILWIND_COLORS, Y_OFFSET
from .models import CustomCoordinate, PhotoCoordinate, Scene, Taste
from .serializers import (
    CoordinatePositionSerializer,
    CustomCoordinateSerializer,
    DetailedCustomCoordinateSerializer,
    DetailedPhotoCoordinateSerializer,
    MetaDataSerializer,
    PhotoCoordinateSerializer,
)


class MetaDataView(APIView):
    """
    コーディネート登録時に必要なデータをまとめて返す
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        data = {
            "seasons": Season.objects.all(),
            "scenes": Scene.objects.all(),
            "tastes": Taste.objects.all(),
        }

        serializer = MetaDataSerializer(data)
        return Response(serializer.data)


class PhotoCoordinateViewSet(ModelViewSet):
    """写真投稿コーディネート"""

    queryset = PhotoCoordinate.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return PhotoCoordinateSerializer
        return DetailedPhotoCoordinateSerializer

    # ユーザーが所有するアイテムのみをフィルタリング
    def get_queryset(self):
        return PhotoCoordinate.objects.filter(user=self.request.user).order_by("-created_at")

    def perform_create(self, serializer):
        user = self.request.user
        photo_coordinate_count = PhotoCoordinate.objects.filter(user=user).count()
        custom_coordinate_count = CustomCoordinate.objects.filter(user=user).count()
        current_count = photo_coordinate_count + custom_coordinate_count

        if current_count >= 100:
            return Response(
                {"error": "アップロードできるコーディネートは最大100件までです。"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer.save(user=user)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset)

        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    # 特定アイテムの編集
    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        if instance.user != request.user:
            return Response({"error": "このコーディネートを編集する権限がありません"}, status=status.HTTP_403_FORBIDDEN)

        # 更新用のシリアライザーでバリデーションと保存
        update_serializer = self.get_serializer(
            instance,
            data=request.data,
            partial=True,
        )

        update_serializer.is_valid(raise_exception=True)
        self.perform_update(update_serializer)

        # 詳細シリアライザーで応答データを作成
        detailed_serializer = DetailedPhotoCoordinateSerializer(instance)
        return Response(detailed_serializer.data)

    # 特定のアイテムの削除
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        if instance.user != request.user:
            return Response({"error": "このコーディネートを削除する権限がありません"}, status=status.HTTP_403_FORBIDDEN)

        # 画像の削除処理：ファイルフィールドのストレージ経由で実施
        if instance.image:
            storage = instance.image.storage
            if storage.exists(instance.image.name):
                storage.delete(instance.image.name)

        self.perform_destroy(instance)
        return Response({"message": "コーディネートが正常に削除されました"}, status=status.HTTP_204_NO_CONTENT)


class CustomCoordinateViewSet(ModelViewSet):
    """カスタムコーディネート"""

    queryset = CustomCoordinate.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action == "retrieve":
            return CoordinatePositionSerializer
        if self.action in ["create", "update", "partial_update"]:
            return CustomCoordinateSerializer
        return DetailedCustomCoordinateSerializer

    def get_queryset(self):
        return CustomCoordinate.objects.filter(user=self.request.user).order_by("-created_at")

    def _compress_image(self, image, max_size_kb=100):
        """画像を指定されたサイズ以下に圧縮する"""
        quality = 95
        buffer = BytesIO()

        while True:
            buffer.seek(0)
            buffer.truncate()
            image.save(buffer, format="WebP", quality=quality)
            size_kb = buffer.tell() / 1024

            if size_kb <= max_size_kb or quality <= 5:
                break

            quality -= 5

        return buffer

    def maintain_aspect_ratio(self, image, target_width, target_height):
        """元の画像のアスペクト比を維持しながら、指定された最大幅・高さに収まるようにリサイズ"""
        original_width, original_height = image.size
        original_aspect = original_width / original_height
        target_aspect = target_width / target_height

        if original_aspect > target_aspect:
            # 横長の画像の場合
            new_width = target_width
            new_height = int(target_width / original_aspect)
        else:
            # 縦長の画像の場合
            new_height = target_height
            new_width = int(target_height * original_aspect)

        return new_width, new_height

    def _process_item_image(self, item_image, position_data, base_size):
        """アイテム画像の処理を一貫した順序で行う"""
        # 1. まず画像をRGBAに変換
        item_image = item_image.convert("RGBA")

        # 2. 基準サイズを4:5の比率で設定
        base_width = base_size
        base_height = int(base_size * 1.25)

        # 3. アスペクト比を維持しながら基準サイズの範囲内にリサイズ
        new_width, new_height = self.maintain_aspect_ratio(item_image, base_width, base_height)
        item_image = item_image.resize((new_width, new_height), Image.Resampling.LANCZOS)

        # 4. スケーリングを適用
        scale = position_data["scale"]
        if scale != 1:
            scaled_width = int(new_width * scale)
            scaled_height = int(new_height * scale)
            item_image = item_image.resize((scaled_width, scaled_height), Image.Resampling.LANCZOS)

        # 5. 回転を適用（必要な場合）
        rotate = position_data.get("rotate", 0)
        if rotate:
            item_image = item_image.rotate(-rotate, expand=True, resample=Image.Resampling.BICUBIC)

        return item_image

    def _generate_coordinate_image(self, items_data, background):
        """コーディネート画像を生成する"""
        bg_color = TAILWIND_COLORS.get(background, "white")
        base_image = Image.new("RGB", (REFERENCE_WIDTH, REFERENCE_HEIGHT), bg_color)

        sorted_items = sorted(items_data, key=lambda x: x["position_data"]["zIndex"])

        for item_data in sorted_items:
            try:
                item = FashionItem.objects.get(id=item_data["item"])
                position_data = item_data["position_data"]

                # 画像の取得
                if settings.DEBUG:
                    item_image = Image.open(item.image.path)
                else:
                    response = requests.get(item.image.url)
                    item_image = Image.open(BytesIO(response.content))

                # 画像の処理
                processed_image = self._process_item_image(item_image, position_data, REFERENCE_ITEM_SIZE)

                # 中心位置の計算（Y_OFFSETを復活）
                center_x = (position_data["xPercent"] / 100) * REFERENCE_WIDTH
                center_y = (position_data["yPercent"] / 100) * REFERENCE_HEIGHT + Y_OFFSET

                # 貼り付け位置の計算
                paste_x = int(center_x - (processed_image.width / 2))
                paste_y = int(center_y - (processed_image.height / 2))

                # アルファチャンネルを使用して合成
                mask = processed_image.split()[3]
                base_image.paste(processed_image, (paste_x, paste_y), mask)

            except Exception as e:
                print(f"Error processing item: {str(e)}")
                continue

        # 画像の保存処理
        buffer = self._compress_image(base_image)
        timestamp = timezone.now().strftime("%Y%m%d%H%M%S")
        random_num = str(random.randint(0, 9999)).zfill(4)
        filename = f"custom_coordinate_{timestamp}_{random_num}.webp"

        return ContentFile(buffer.getvalue(), name=filename)

    def create(self, request, *args, **kwargs):
        try:
            request_data = request.data.get("data", {})
            items_data = request_data.get("items", [])
            background = request_data.get("background", "bg-white")

            # 画像を生成
            generated_image = self._generate_coordinate_image(items_data, background)

            # データの準備
            data = {
                "image": generated_image,
                "items": items_data,
                "background": background,
                "seasons": request.data.get("seasons", []),
                "scenes": request.data.get("scenes", []),
                "tastes": request.data.get("tastes", []),
            }

            serializer = self.get_serializer(data=data, context=self.get_serializer_context())
            if not serializer.is_valid():
                return Response(serializer.errors, status=400)

            self.perform_create(serializer)
            return Response({"message": "作成完了"}, status=201)

        except Exception as e:
            return Response({"detail": str(e)}, status=400)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset)

        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def get_serializer_context(self):
        """追加のコンテキストを提供"""
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context

    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        if instance.user != request.user:
            return Response({"error": "このコーディネートを編集する権限がありません"}, status=status.HTTP_403_FORBIDDEN)

        try:
            # リクエストデータの整形
            request_data = request.data.get("data", {})

            data = {}
            background_updated = False
            items_updated = False

            # 背景色の処理
            if "background" in request_data:
                data["background"] = request_data["background"]
                background_updated = True

            # アイテムの処理
            if "items" in request_data:
                data["items"] = request_data["items"]
                items_updated = True

            # items または background が更新される場合、新しい画像を生成
            if items_updated or background_updated:
                try:
                    items_data = data.get("items", [])
                    background = data.get("background", instance.background)
                    generated_image = self._generate_coordinate_image(items_data, background)
                    data["image"] = generated_image
                except Exception as e:
                    return Response(
                        {"error": f"画像の生成中にエラーが発生しました: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST
                    )

            # 多対多フィールドの処理
            for field in ["seasons", "scenes", "tastes"]:
                if field in request.data:
                    values = request.data.get(field, [])

                    # 空文字列や'[]'の場合は空リストとして扱う
                    if len(values) == 1 and (values[0] == "[]" or values[0] == ""):
                        values = []
                    data[field] = values

            try:
                # partial=Trueを指定して部分的な更新を許可
                update_serializer = self.get_serializer(instance, data=data, partial=True)
                update_serializer.is_valid(raise_exception=True)
                self.perform_update(update_serializer)
            except serializers.ValidationError as e:
                return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(
                {"error": f"更新処理中にエラーが発生しました: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST
            )

        # 詳細シリアライザーで応答データを作成
        detailed_serializer = DetailedCustomCoordinateSerializer(instance)
        return Response(detailed_serializer.data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        if instance.user != request.user:
            return Response({"error": "このコーディネートを削除する権限がありません"}, status=status.HTTP_403_FORBIDDEN)

        # 画像の削除処理：ファイルフィールドのストレージ経由で実施
        if instance.image:
            storage = instance.image.storage
            if storage.exists(instance.image.name):
                storage.delete(instance.image.name)

        self.perform_destroy(instance)
        return Response({"message": "コーディネートが正常に削除されました"}, status=status.HTTP_204_NO_CONTENT)


class CoordinateCountView(APIView):
    """アイテムカウントビュー（制限までどのぐらいか）"""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        max_items = 100  # 上限数
        photo_coordinate_count = PhotoCoordinate.objects.filter(user=user).count()
        custom_coordinate_count = CustomCoordinate.objects.filter(user=user).count()
        current_count = photo_coordinate_count + custom_coordinate_count

        return Response({"current_count": current_count, "max_items": max_items})
