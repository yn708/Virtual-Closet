import json

from rest_framework import serializers, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet

from apps.fashion_items.models import Season

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
        serializer.save(user=self.request.user)

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

    def create(self, request, *args, **kwargs):
        data = {
            "image": request.data.get("image"),
            "items": json.loads(request.data.get("items", "[]")),
            "background": request.data.get("background", "bg-white"),
            "seasons": request.data.getlist("seasons"),
            "scenes": request.data.getlist("scenes"),
            "tastes": request.data.getlist("tastes"),
        }

        try:
            # 明示的にコンテキストを渡す
            serializer = self.get_serializer(data=data, context=self.get_serializer_context())
            if not serializer.is_valid():
                return Response(serializer.errors, status=400)

            self.perform_create(serializer)
            return Response(serializer.data, status=201)

        except Exception as e:
            return Response({"detail": str(e)}, status=400)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        if instance.user != request.user:
            return Response({"error": "このコーディネートを編集する権限がありません"}, status=status.HTTP_403_FORBIDDEN)

        # リクエストデータの整形
        data = {}

        # 画像が送信された場合のみ追加
        if "image" in request.data:
            data["image"] = request.data.get("image")

        # 背景色の処理
        if "background" in request.data:
            data["background"] = request.data.get("background")

        # アイテムの処理
        if "items" in request.data:
            try:
                items = json.loads(request.data.get("items", "[]"))
                if items:  # 空でない場合のみ追加
                    data["items"] = items
            except json.JSONDecodeError:
                return Response({"error": "アイテムデータの形式が不正です"}, status=status.HTTP_400_BAD_REQUEST)

        # 多対多フィールドの処理
        for field in ["seasons", "scenes", "tastes"]:
            if field in request.data:
                values = request.data.getlist(field, [])
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
