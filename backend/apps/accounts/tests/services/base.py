"""サービステスト用の基底クラスとユーティリティ"""

from django.contrib.auth import get_user_model

User = get_user_model()


class BaseServiceTest:
    """サービステスト用の基底クラス"""

    @staticmethod
    def create_user(email="test@example.com", password="TESTpass123", is_active=False, **kwargs):
        """テストユーザー作成ヘルパー"""
        return User.objects.create_user(
            email=email,
            password=password,
            username=kwargs.get("username", f"user_{email.split('@')[0]}"),
            is_active=is_active,
            **kwargs,
        )
