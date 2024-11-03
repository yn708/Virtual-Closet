"""
バリデーターテスト用の基底クラスを提供
"""

from django.contrib.auth import get_user_model

User = get_user_model()


class BaseValidatorTest:
    """バリデーターテスト用の基底クラス"""

    @staticmethod
    def create_test_user(email, is_active=True):
        """テストユーザーを作成するヘルパーメソッド"""
        return User.objects.create_user(
            username=f"user_{email.split('@')[0]}", email=email, password="TESTpass123", is_active=is_active
        )
