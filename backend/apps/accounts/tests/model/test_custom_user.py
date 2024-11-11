from uuid import UUID

import pytest
from django.core.exceptions import ValidationError
from django.db.utils import IntegrityError

from apps.accounts.models import CustomUser


@pytest.mark.django_db
class TestCustomUser:
    """CustomUserモデルのテスト"""

    def create_user(self, **kwargs):
        """ユーザー作成ヘルパー"""
        return CustomUser.objects.create_user(**kwargs)

    def test_create_user_full(self, valid_user_data):
        """全フィールド指定でのユーザー作成"""
        user = self.create_user(**valid_user_data)

        for field, value in valid_user_data.items():
            if field != "password":
                assert getattr(user, field) == value
        assert user.check_password(valid_user_data["password"])
        assert not user.is_staff
        assert not user.is_active
        assert user.auth_provider == "email"

    def test_create_user_required(self, valid_user_data):
        """必須フィールドのみでのユーザー作成"""
        required_fields = {
            "email": valid_user_data["email"],
            "password": valid_user_data["password"],
            "username": valid_user_data["username"],
        }
        user = self.create_user(**required_fields)

        assert all(getattr(user, field) is None for field in ["name", "birth_date", "height"])
        assert user.profile_image.name is None

    def test_user_id(self, valid_user_data):
        """userIdの検証"""
        user = self.create_user(**valid_user_data)
        assert isinstance(user.userId, UUID)
        assert len(str(user.userId)) == 36

    @pytest.mark.parametrize(
        "field,value,error_type,error_msg",
        [
            ("email", "", ValueError, "メールアドレスは必須です"),
            ("email", "invalid-email", ValidationError, "有効なメールアドレスを入力してください。"),
            ("username", "", ValidationError, "このフィールドは空ではいけません。"),
            ("username", "a" * 256, ValidationError, "この値は 255 文字以下でなければなりません"),
            ("height", -1, ValidationError, "この値は 0 以上でなければなりません。"),
            ("gender", "invalid", ValidationError, "'invalid' は有効な選択肢ではありません。"),
        ],
    )
    def test_validations(self, field, value, error_type, error_msg, valid_user_data):
        """フィールドバリデーション"""
        test_data = valid_user_data.copy()
        test_data[field] = value

        if error_type is ValueError:
            with pytest.raises(error_type, match=error_msg):
                self.create_user(**test_data)
        else:
            user = CustomUser(**test_data)
            with pytest.raises(error_type) as exc:
                user.full_clean()
            assert error_msg in str(exc.value)

    @pytest.mark.parametrize("field", ["email", "username"])
    def test_unique_constraints(self, field, valid_user_data):
        """ユニーク制約"""
        self.create_user(**valid_user_data)

        duplicate_data = valid_user_data.copy()
        if field != "email":
            duplicate_data["email"] = "another@example.com"
        if field != "username":
            duplicate_data["username"] = "anotheruser"

        with pytest.raises(IntegrityError):
            self.create_user(**duplicate_data)

    def test_profile_image(self, valid_user_data, test_image):
        """プロフィール画像のアップロード"""
        user = self.create_user(**valid_user_data, profile_image=test_image)
        assert user.profile_image
        assert "profile_images" in user.profile_image.path
        assert user.profile_image.name.endswith(".gif")

    def test_default_values(self, valid_user_data):
        """デフォルト値"""
        user = self.create_user(**valid_user_data)
        assert all(
            [
                not user.is_staff,
                not user.is_active,
                user.auth_provider == "email",
                user.gender == "unanswered",
                user.created_at is not None,
                user.updated_at is not None,
            ]
        )

    def test_password_hashing(self, valid_user_data):
        """パスワードハッシュ化"""
        user = self.create_user(**valid_user_data)
        assert all(
            [
                user.password != valid_user_data["password"],
                user.check_password(valid_user_data["password"]),
                not user.check_password("wrongpassword"),
            ]
        )
