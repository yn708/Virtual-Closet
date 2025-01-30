from django.contrib.auth import get_user_model

from ..exceptions import InvalidCredentialsError, MissingCredentialsError, UserAlreadyActiveError, UserNotFoundError

User = get_user_model()


class AuthenticationService:
    @staticmethod
    def validate_credentials(email, password):
        """
        認証情報のバリデーション
        Email, passwordが含まれているかどうか
        """
        if not email or not password:
            raise MissingCredentialsError()

    @staticmethod
    def get_and_validate_user(email, password):
        """
        ユーザーの取得と認証
        return: User: 認証されたユーザー
        raises:
            UserNotFoundError: ユーザーが存在しない場合
            InvalidCredentialsError: パスワードが一致しない場合
            UserAlreadyActiveError: ユーザーが既に有効化されている場合
        """
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist as err:
            raise UserNotFoundError() from err

        if not user.check_password(password):
            raise InvalidCredentialsError()

        if user.is_active:
            raise UserAlreadyActiveError()

        return user
