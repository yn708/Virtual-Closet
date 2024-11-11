from datetime import date

import pytest
from rest_framework import serializers

from apps.accounts.constants import IMAGE_SIZE_ERROR
from apps.accounts.serializers.user_serializers import (
    CustomUserDetailsSerializer,
    UserUpdateSerializer,
)


class TestCustomUserDetailsSerializer:
    @pytest.fixture
    def serializer_data(self, user):
        return CustomUserDetailsSerializer(instance=user).data

    def test_contains_expected_fields(self, serializer_data):
        """期待されるフィールドが含まれているかテスト"""
        expected_fields = {
            "username",
            "name",
            "birth_date",
            "gender",
            "profile_image",
            "height",
        }
        assert set(serializer_data.keys()) == expected_fields

    def test_valid_data_serialization(self, serializer_data):
        """正常なデータのシリアライズをテスト"""
        assert serializer_data["username"] == "testuser"
        assert serializer_data["name"] == "Test User"
        assert serializer_data["birth_date"] == "1990-01-01"
        assert serializer_data["gender"] == "unanswered"
        assert serializer_data["height"] == 170


class TestUserUpdateSerializer:
    def test_validate_valid_image(self, valid_image):
        """有効な画像のバリデーションテスト"""
        serializer = UserUpdateSerializer()
        validated_image = serializer.validate_profile_image(valid_image)
        assert validated_image == valid_image

    def test_validate_large_image(self, large_image):
        """サイズ制限を超える画像のバリデーションテスト"""
        serializer = UserUpdateSerializer()
        with pytest.raises(serializers.ValidationError) as exc:
            serializer.validate_profile_image(large_image)
        assert str(exc.value.detail[0]) == IMAGE_SIZE_ERROR

    @pytest.mark.django_db
    def test_update_with_valid_data(self, user, valid_image):
        """正常なデータでの更新テスト"""
        update_data = {
            "username": "newusername",
            "name": "New Name",
            "profile_image": valid_image,
            "delete_profile_image": False,  # 明示的にFalseを設定
            "delete_birth_date": False,  # 明示的にFalseを設定
        }
        serializer = UserUpdateSerializer(instance=user, data=update_data, partial=True)

        if not serializer.is_valid():
            print(f"Validation errors: {serializer.errors}")  # デバッグ用

        assert serializer.is_valid()
        updated_user = serializer.save()

        assert updated_user.username == "newusername"
        assert updated_user.name == "New Name"
        assert updated_user.profile_image.name is not None  # 画像名の存在を確認

    @pytest.mark.django_db
    def test_delete_profile_image(self, user_with_image):
        """プロフィール画像の削除テスト"""
        update_data = {
            "delete_profile_image": True,
            "delete_birth_date": False,  # 明示的にFalseを設定
        }
        serializer = UserUpdateSerializer(instance=user_with_image, data=update_data, partial=True)

        assert serializer.is_valid()
        updated_user = serializer.save()

        # ImageFieldの比較を修正
        assert not updated_user.profile_image or updated_user.profile_image.name is None

    @pytest.mark.django_db
    def test_delete_birth_date(self, user):
        """生年月日の削除テスト"""
        update_data = {
            "delete_birth_date": True,
            "delete_profile_image": False,  # 明示的にFalseを設定
        }
        serializer = UserUpdateSerializer(instance=user, data=update_data, partial=True)

        assert serializer.is_valid()
        updated_user = serializer.save()
        assert updated_user.birth_date is None

    @pytest.mark.django_db
    def test_partial_update(self, user):
        """部分更新のテスト"""
        update_data = {
            "name": "Updated Name Only",
            "delete_profile_image": False,  # 明示的にFalseを設定
            "delete_birth_date": False,  # 明示的にFalseを設定
        }
        serializer = UserUpdateSerializer(instance=user, data=update_data, partial=True)

        assert serializer.is_valid()
        updated_user = serializer.save()

        assert updated_user.name == "Updated Name Only"
        assert updated_user.username == "testuser"
        assert updated_user.birth_date == date(1990, 1, 1)
