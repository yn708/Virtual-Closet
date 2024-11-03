import random

from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework.authtoken.models import Token

from ..constants import CODE_LENGTH, CONFIRMATION_CODE_EXPIRATION_MINUTES
from ..exceptions import (
    AuthenticationFailedError,
    ConfirmationCodeError,
    ExpiredVerificationCodeError,
    InvalidVerificationCodeError,
    UserAlreadyActiveError,
    UserNotFoundError,
)

User = get_user_model()


class VerificationService:
    @staticmethod
    def generate_confirmation_code():
        """ユニークな6桁の確認コードを生成"""

        for _ in range(10):  # 最大10回試行
            code = "".join([str(random.randint(0, 9)) for _ in range(CODE_LENGTH)])
            if not User.objects.filter(confirmation_code=code).exists():
                return code
        raise ConfirmationCodeError()

    @staticmethod
    def get_expiration_message(created_at):
        """
        確認コードの有効期限メッセージを生成
        :param created_at: 確認コードが作成された日時（confirmation_code_created_at）
        :return: 有効期限に関する説明メッセージ
        """
        if not created_at:
            return "確認コードは設定されていません。"

        expiration_time = timezone.localtime(created_at) + timezone.timedelta(
            minutes=CONFIRMATION_CODE_EXPIRATION_MINUTES
        )
        formatted_time = expiration_time.strftime("%Y年%m月%d日 %H時%M分")

        return f"""
        このコードは作成から{CONFIRMATION_CODE_EXPIRATION_MINUTES}分間有効です。
        有効期限は {formatted_time} までです。
        """

    @staticmethod
    def get_user_by_email(email):
        """
        メールアドレスからユーザーを取得
        return: User: ユーザーオブジェクト
        """
        try:
            return User.objects.get(email=email)
        except User.DoesNotExist as err:
            raise UserNotFoundError() from err

    @staticmethod
    def verify_confirmation_code(user, code):
        """
        確認コードを検証
        raises:
            ExpiredVerificationCodeError: コードの有効期限切れ
            InvalidVerificationCodeError: 無効なコード
        """
        code_status = user.check_confirmation_code(code)

        if code_status == "expired":
            raise ExpiredVerificationCodeError()
        elif code_status != "ok":
            raise InvalidVerificationCodeError()

    @staticmethod
    def confirm_user_and_create_token(user):
        """ユーザーを確認してトークンを作成"""

        user.confirm_email()
        token, created = Token.objects.get_or_create(user=user)
        return token, created


class EmailPasswordVerificationService:
    """メールアドレスとパスワードの検証サービス"""

    @staticmethod
    def verify_user_credentials(email, password):
        """
        ユーザーの認証情報を検証
        return: User: 検証済みユーザー
        raise:
            AuthenticationFailedError: 認証失敗
            UserAlreadyActiveError: 既に有効化済み
        """
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist as err:
            raise AuthenticationFailedError() from err

        if not user.check_password(password):
            raise AuthenticationFailedError()

        if user.is_active:
            raise UserAlreadyActiveError()

        return user
