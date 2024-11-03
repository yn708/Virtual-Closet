from django.contrib.auth import get_user_model

from ..exceptions import EmailAlreadyExistsError

User = get_user_model()


def validate_unique_email(email: str) -> str:
    """
    アクティブなユーザーのメールアドレス重複チェック
    """
    if User.objects.filter(email=email, is_active=True).exists():
        raise EmailAlreadyExistsError()
    return email
