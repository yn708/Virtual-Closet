from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from ..serializers.verification_serializers import (
    EmailPasswordVerificationSerializer,
    UserVerificationResponseSerializer,
    VerificationCodeSerializer,
)
from ..services.verification_service import EmailPasswordVerificationService, VerificationService


class VerifyCodeView(APIView):
    """確認コード検証ビュー"""

    permission_classes = [AllowAny]  # 認証を必要としない

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.verification_service = VerificationService()

    def post(self, request):
        """確認コードを検証してユーザーを有効化"""

        # リクエストデータのバリデーション
        serializer = VerificationCodeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        confirmation_code = serializer.validated_data["confirmation_code"]

        # ユーザーの取得と確認コードの検証
        user = self.verification_service.get_user_by_email(email)
        self.verification_service.verify_confirmation_code(user, confirmation_code)

        # ユーザーの確認とトークンの作成
        token, _ = self.verification_service.confirm_user_and_create_token(user)

        # レスポンスの作成
        response_serializer = UserVerificationResponseSerializer(user)

        return Response(
            {
                "detail": "アカウントが確認されました。",
                "key": token.key,  # 認証後にそのままログイン処理を行うためのキー
                "user": response_serializer.data,
                "is_new_user": True,
            },
            status=status.HTTP_200_OK,
        )


class VerifyEmailPasswordView(APIView):
    """
    メールアドレスとパスワードの検証ビュー
    フロントエンド側のconfirmページで使用
    Email、passwordの再確認用
    """

    permission_classes = [AllowAny]

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.verification_service = EmailPasswordVerificationService()

    def post(self, request) -> Response:
        """
        メールアドレスとパスワードの検証を実行

        Args:
            request: HTTPリクエスト
        Returns:
            Response: API応答
        """
        # リクエストデータのバリデーション
        serializer = EmailPasswordVerificationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # 認証情報の検証
        self.verification_service.verify_user_credentials(
            email=serializer.validated_data["email"], password=serializer.validated_data["password"]
        )

        return Response({"detail": "メールアドレスとパスワードが確認されました。"}, status=status.HTTP_200_OK)
