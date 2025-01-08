from django.core.files.storage import default_storage
from django.db.models import Q
from django.utils import timezone
from rest_framework import generics, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Brand, Category, Color, Design, FashionItem, PriceRange, Season
from .serializers import (
    BrandSerializer,
    DetailedFashionItemSerializer,
    FashionItemSerializer,
    MetaDataSerializer,
)


class MetaDataView(APIView):
    """
    ファッションアイテム登録時に必要なデータをまとめて返す
    ブランドは人気のものを返す（その他は検索ビューで返す）
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        data = {
            "categories": Category.objects.all(),
            "seasons": Season.objects.all(),
            "designs": Design.objects.all(),
            "colors": Color.objects.all(),
            "price_ranges": PriceRange.objects.all(),
            "popular_brands": Brand.objects.filter(is_popular=True),  # 追加: 人気ブランド
        }

        serializer = MetaDataSerializer(data)
        return Response(serializer.data)


class BrandSearchView(generics.ListAPIView):
    """ブランド検索ビュー"""

    serializer_class = BrandSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        query = self.request.query_params.get("query", "")
        return Brand.objects.filter(Q(brand_name__icontains=query) | Q(brand_name_kana__icontains=query))[:20]


class FashionItemViewSet(viewsets.ModelViewSet):
    queryset = FashionItem.objects.all()
    permission_classes = [IsAuthenticated]

    # 使用シリアライザーの決定
    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return FashionItemSerializer
        return DetailedFashionItemSerializer

    # ユーザーが所有するアイテムのみをフィルタリング
    def get_queryset(self):
        return FashionItem.objects.filter(user=self.request.user)

    # ファッションアイテム作成
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    # カテゴリーごとのアイテム取得
    @action(detail=False, methods=["GET"])
    def by_category(self, request):
        category_id = request.query_params.get("category_id")

        if not category_id:
            return Response({"error": "カテゴリーIDは必須です"}, status=400)

        # recent の場合は最近追加したアイテムを返す(過去30日以内)
        if category_id == "recent":
            recent_items = (
                self.get_queryset()
                .filter(created_at__gte=timezone.now() - timezone.timedelta(days=30))
                .order_by("-created_at")[:15]  # 最大15件
            )
            serializer = self.get_serializer(recent_items, many=True)
            return Response(serializer.data)

        # 通常のカテゴリー処理
        items = self.get_queryset().filter(sub_category__category_id=category_id).order_by("-created_at")
        page = self.paginate_queryset(items)

        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(items, many=True)
        return Response(serializer.data)

    # 特定アイテムの編集
    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        if instance.user != request.user:
            return Response({"error": "このアイテムを編集する権限がありません"}, status=status.HTTP_403_FORBIDDEN)

        # 更新用のシリアライザーでバリデーションと保存
        update_serializer = self.get_serializer(
            instance,
            data=request.data,
            partial=True,
        )

        update_serializer.is_valid(raise_exception=True)
        self.perform_update(update_serializer)

        # 詳細シリアライザーで応答データを作成
        detailed_serializer = DetailedFashionItemSerializer(instance)
        return Response(detailed_serializer.data)

    # 特定のアイテムの削除
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        if instance.user != request.user:
            return Response({"error": "このアイテムを削除する権限がありません"}, status=status.HTTP_403_FORBIDDEN)
        # 画像の削除処理
        if instance.image:
            if default_storage.exists(instance.image.name):
                default_storage.delete(instance.image.name)

        self.perform_destroy(instance)
        return Response({"message": "アイテムが正常に削除されました"}, status=status.HTTP_204_NO_CONTENT)
