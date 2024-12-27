import json

from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet

from apps.fashion_items.models import Season

from .models import CustomCoordinate, PhotoCoordinate, Scene, Taste
from .serializers import CustomCoordinateSerializer, MetaDataSerializer, PhotoCoordinateSerializer


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
    queryset = PhotoCoordinate.objects.all()
    serializer_class = PhotoCoordinateSerializer
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return PhotoCoordinate.objects.filter(user=self.request.user)


# class CustomCoordinateViewSet(ModelViewSet):
#     queryset = CustomCoordinate.objects.all()
#     serializer_class = CustomCoordinateSerializer
#     permission_classes = [IsAuthenticated]
#     # マルチパートフォームデータ（ファイルアップロード）とフォームデータの両方を処理可能に
#     parser_classes = [MultiPartParser, FormParser]

#     def create(self, request, *args, **kwargs):
#         # フロントエンドから送られてくるデータ構造:
#         # - preview_image: ファイルデータ（画像）
#         # - items: JSON文字列（文字列化されたJSONデータ）

#         # リクエストデータを新しい辞書に整形
#         data = {
#             "preview_image": request.data.get("preview_image"),  # プレビュー画像をそのまま取得
#             "items": json.loads(request.data.get("items", "[]")),  # items文字列をJSON形式にパース（デフォルトは空配列）
#         }

#         try:
#             serializer = self.get_serializer(data=data)  # シリアライザーにデータを渡してインスタンス化
#             valid = serializer.is_valid()  # バリデーション実行
#             if not valid:
#                 return Response(serializer.errors, status=400)

#             self.perform_create(serializer)  # バリデーション成功時にデータを保存
#             return Response(serializer.data, status=201)

#         except Exception as e:
#             return Response({"detail": str(e)}, status=400)


class CustomCoordinateViewSet(ModelViewSet):
    queryset = CustomCoordinate.objects.all()
    serializer_class = CustomCoordinateSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_serializer_context(self):
        """追加のコンテキストを提供"""
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context

    def create(self, request, *args, **kwargs):
        data = {
            "preview_image": request.data.get("preview_image"),
            "items": json.loads(request.data.get("items", "[]")),
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
