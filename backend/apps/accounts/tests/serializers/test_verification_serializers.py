"""確認コード関連シリアライザーのテスト"""

import pytest

from apps.accounts.serializers.verification_serializers import (
    EmailPasswordVerificationSerializer,
    UserVerificationResponseSerializer,
    VerificationCodeSerializer,
)
from apps.accounts.tests.serializers.base import BaseSerializerTest


class TestVerificationSerializers(BaseSerializerTest):
    """確認コード関連シリアライザーのテスト"""

    @pytest.mark.parametrize(
        "serializer_class,data_fixture",
        [
            (VerificationCodeSerializer, "verification_data"),
            (EmailPasswordVerificationSerializer, "user_data"),
        ],
    )
    def test_serializer_validation(self, serializer_class, data_fixture, request):
        """シリアライザーバリデーションのテスト"""
        data = request.getfixturevalue(data_fixture)
        serializer = serializer_class(data=data)
        assert serializer.is_valid()

    def test_response_serializer(self, user_data):
        """レスポンスシリアライザーのテスト"""
        data = {"id": "user123", **user_data}
        serializer = UserVerificationResponseSerializer(data=data)
        assert serializer.is_valid()

        # 必須フィールド欠落
        for field in ["id", "email", "username"]:
            invalid_data = data.copy()
            del invalid_data[field]
            serializer = UserVerificationResponseSerializer(data=invalid_data)
            assert not serializer.is_valid()
