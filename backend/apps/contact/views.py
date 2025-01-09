from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import AnonymousContactSerializer, AuthenticatedContactSerializer
from .services import NotificationService


# 未認証ユーザーお問い合わせビュー
class AnonymousContactAPIView(APIView):
    permission_classes = [AllowAny]
    serializer_class = AnonymousContactSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)

        if not serializer.is_valid():
            return Response({"success": False, "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        try:
            notification_service = NotificationService()
            if notification_service.notify(serializer.validated_data):
                return Response({"success": True, "message": "お問い合わせを送信しました。"})

            return Response(
                {"success": False, "error": "送信に失敗しました。"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        except Exception as e:
            return Response({"success": False, "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# 認証ユーザーお問い合わせビュー
class AuthenticatedContactAPIView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = AuthenticatedContactSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)

        if not serializer.is_valid():
            return Response({"success": False, "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        try:
            notification_data = {
                "name": request.user.username,
                "email": request.user.email,
                "subject": serializer.validated_data["subject"],
                "message": serializer.validated_data["message"],
            }

            notification_service = NotificationService()
            if notification_service.notify(notification_data):
                return Response({"success": True, "message": "お問い合わせを送信しました。"})

            return Response(
                {"success": False, "error": "送信に失敗しました。"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        except Exception as e:
            return Response({"success": False, "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
