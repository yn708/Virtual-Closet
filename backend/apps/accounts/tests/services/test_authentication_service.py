"""認証サービスのテスト"""

import pytest

from apps.accounts.exceptions import (
    InvalidCredentialsError,
    MissingCredentialsError,
    UserAlreadyActiveError,
    UserNotFoundError,
)
from apps.accounts.services.authentication_service import AuthenticationService
from apps.accounts.tests.services.base import BaseServiceTest


class TestAuthenticationService(BaseServiceTest):
    """認証サービスのテスト"""

    @pytest.mark.parametrize(
        "email,password,expected_error",
        [
            (None, "password123", MissingCredentialsError),
            ("test@example.com", None, MissingCredentialsError),
            (None, None, MissingCredentialsError),
            ("", "password123", MissingCredentialsError),
            ("test@example.com", "", MissingCredentialsError),
        ],
    )
    def test_validate_credentials_invalid(self, email, password, expected_error):
        """無効な認証情報の検証"""
        with pytest.raises(expected_error):
            AuthenticationService.validate_credentials(email, password)


class TestGetAndValidateUser:
    """ユーザーの取得と認証のテスト"""

    @pytest.mark.django_db
    def test_get_and_validate_user_active_user(self, active_user, user_data):
        """アクティブユーザーの検証"""
        with pytest.raises(UserAlreadyActiveError):
            AuthenticationService.get_and_validate_user(user_data["email"], user_data["password"])

    @pytest.mark.django_db
    def test_get_and_validate_user_not_found(self, db, user_data):
        """存在しないユーザーの検証"""
        with pytest.raises(UserNotFoundError):
            AuthenticationService.get_and_validate_user("nonexistent@example.com", user_data["password"])

    @pytest.mark.django_db
    def test_get_and_validate_user_invalid_password(self, inactive_user, user_data):
        """無効なパスワードの検証"""
        with pytest.raises(InvalidCredentialsError):
            AuthenticationService.get_and_validate_user(user_data["email"], "wrongpassword")
