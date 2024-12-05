from django.db.models import Q
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Brand, Category, Color, Design, PriceRange, Season
from .serializers import (
    BrandSerializer,
    MetaDataSerializer,
    RegisterFashionItemSerializer,
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


class RegisterFashionItemView(generics.CreateAPIView):
    """ファッションアイテム登録ビュー"""

    serializer_class = RegisterFashionItemSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            {"status": "success", "message": "ファッションアイテムが正常に作成されました", "data": serializer.data},
            status=status.HTTP_201_CREATED,
            headers=headers,
        )
