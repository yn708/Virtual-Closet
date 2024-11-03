"""ログインシリアライザーのテスト"""

import pytest

from apps.accounts.serializers.login_serializers import LoginUserSerializer
from apps.accounts.tests.serializers.base import BaseSerializerTest


@pytest.mark.django_db
class TestLoginUserSerializer(BaseSerializerTest):
    """ログインユーザーシリアライザーのテスト"""

    def test_serialization(self, user_data):
        """シリアライズのテスト"""
        user = self.create_user(**user_data)
        serializer = LoginUserSerializer(user)

        assert serializer.data["email"] == user.email
        assert serializer.data["username"] == user.username
        assert "password" not in serializer.data

    @pytest.mark.parametrize(
        "field,invalid_value",
        [
            ("email", "invalid-email"),
            ("username", ""),
            ("email", None),
        ],
    )
    def test_validation_errors(self, user_data, field, invalid_value):
        """バリデーションエラーのテスト"""
        data = user_data.copy()
        data[field] = invalid_value
        serializer = LoginUserSerializer(data=data)
        assert not serializer.is_valid()
        assert field in serializer.errors
