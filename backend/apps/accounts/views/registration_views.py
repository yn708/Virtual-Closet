from dj_rest_auth.registration.views import RegisterView
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from ..exceptions import GmailSignupNotAllowed
from ..serializers.registration_serializers import CustomRegisterSerializer
from ..services.authentication_service import AuthenticationService
from ..services.email_service import EmailService
from ..services.verification_service import VerificationService

User = get_user_model()


class SendVerificationCodeView(RegisterView):
    """メール確認コード送信ビュー（Emailサインアップ時）"""

    serializer_class = CustomRegisterSerializer

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        verification_service = VerificationService()
        self.email_service = EmailService(verification_service)

    def check_gmail_address(self, email: str) -> bool:
        """
        Gmailアドレスかどうかをチェックする
        return: bool: Gmailアドレスの場合True
        """
        return email.lower().endswith("@gmail.com")

    def create(self, request, *args, **kwargs):
        """
        ユーザー仮登録と確認メール送信を実行
        既存の未認証ユーザーの場合は再送信処理を行う
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data.get("email")

        # Gmailアドレスチェック
        if self.check_gmail_address(email):
            raise GmailSignupNotAllowed()
        # 既存の未認証ユーザーを確認
        existing_user = User.objects.filter(email=email, is_active=False).first()

        if existing_user:
            # 新しい認証コード再送信
            self.email_service.send_confirmation_email(existing_user)
            return Response(
                {"detail": "新しい確認コードをメールで送信しました。"},
                status=status.HTTP_200_OK,
            )

        user = self.perform_create(serializer)
        self.email_service.send_confirmation_email(user)

        headers = self.get_success_headers(serializer.data)
        return Response(
            {"detail": "確認コードをメールで送信しました。"},
            status=status.HTTP_201_CREATED,
            headers=headers,
        )


class ResendVerificationCodeView(APIView):
    """確認コード再送信ビュー"""

    permission_classes = [AllowAny]

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.auth_service = AuthenticationService()
        verification_service = VerificationService()
        self.email_service = EmailService(verification_service)

    def post(self, request):
        """確認コードを再送信"""

        email = request.data.get("email")
        password = request.data.get("password")

        # 認証情報のバリデーション
        self.auth_service.validate_credentials(email, password)

        # ユーザーの取得と認証
        user = self.auth_service.get_and_validate_user(email, password)

        # 確認メールの送信
        self.email_service.send_confirmation_email(user)

        return Response({"detail": "新しい確認コードを送信しました。"}, status=status.HTTP_200_OK)
