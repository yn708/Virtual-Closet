"""登録シリアライザーのテスト"""

import pytest

from apps.accounts.exceptions import EmailAlreadyExistsError
from apps.accounts.serializers.registration_serializers import CustomRegisterSerializer
from apps.accounts.tests.serializers.base import BaseSerializerTest


@pytest.mark.django_db
class TestRegistrationSerializer(BaseSerializerTest):
    """登録シリアライザーのテスト"""

    def test_registration(self, registration_data):
        """登録処理のテスト"""
        serializer = CustomRegisterSerializer(data=registration_data)
        assert serializer.is_valid()

        # 既存メールアドレス
        user = self.create_user(is_active=True)
        with pytest.raises(EmailAlreadyExistsError):
            serializer.validate_email(user.email)

        # 非アクティブユーザー
        inactive_user = self.create_user(email="inactive@example.com", is_active=False)
        assert serializer.validate_email(inactive_user.email)

    def test_password_validation(self, registration_data):
        """パスワードバリデーションのテスト"""
        # 弱いパスワード
        data = registration_data.copy()
        data.update({"password1": "weakpass123", "password2": "weakpass123"})
        serializer = CustomRegisterSerializer(data=data)
        assert not serializer.is_valid()
        assert "password1" in serializer.errors
