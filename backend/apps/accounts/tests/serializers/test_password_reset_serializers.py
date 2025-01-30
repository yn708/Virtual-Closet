"""パスワードリセット関連シリアライザーのテスト"""

import pytest
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from rest_framework.exceptions import ValidationError

from apps.accounts.serializers.password_reset_serializers import (
    CustomPasswordResetConfirmSerializer,
    CustomPasswordResetSerializer,
)
from apps.accounts.tests.serializers.base import BaseSerializerTest


@pytest.mark.django_db
class TestPasswordResetSerializers(BaseSerializerTest):
    """パスワードリセット関連シリアライザーのテスト"""

    @pytest.fixture
    def reset_token_data(self, user_data):
        """リセットトークンデータ作成"""
        user = self.create_user(**user_data)
        return {
            "uid": urlsafe_base64_encode(force_bytes(str(user.userId))),
            "token": default_token_generator.make_token(user),
            "new_password1": "NEWpassword123",
            "new_password2": "NEWpassword123",
        }

    def test_reset_validation(self, user_data):
        """リセットバリデーションのテスト"""
        user = self.create_user(**user_data)
        serializer = CustomPasswordResetSerializer(data={"email": user.email})
        assert serializer.is_valid()

        with pytest.raises(ValidationError):
            serializer.validate_email("nonexistent@example.com")

    def test_reset_confirm(self, reset_token_data):
        """リセット確認のテスト"""
        serializer = CustomPasswordResetConfirmSerializer(data=reset_token_data)
        assert serializer.is_valid()

        # パスワード不一致
        invalid_data = reset_token_data.copy()
        invalid_data["new_password2"] = "different"
        serializer = CustomPasswordResetConfirmSerializer(data=invalid_data)
        assert not serializer.is_valid()
