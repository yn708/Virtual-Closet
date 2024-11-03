"""
認証コード検証関連のビューテスト
"""

from unittest.mock import Mock

import pytest
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token

from apps.accounts.tests.views.base import BaseAuthViewTest

User = get_user_model()


class TestVerifyCodeView(BaseAuthViewTest):
    """VerifyCodeViewのテストクラス"""

    @pytest.fixture
    def verification_user(self, db):
        """確認コード検証用のユーザーを作成"""
        return User.objects.create_user(
            email="test@example.com",
            password="TESTpass123",
            is_active=False,
            confirmation_code="123456",
            username="test-user",
        )

    def test_verify_code_success(self, api_client, mocker, verification_user):
        """確認コード検証の正常系テスト"""
        mock_token = Mock(spec=Token)
        mock_token.key = "dummy_token"

        mock_verify = mocker.patch(
            "apps.accounts.services.verification_service.VerificationService.verify_confirmation_code"
        )
        mock_confirm = mocker.patch(
            "apps.accounts.services.verification_service.VerificationService.confirm_user_and_create_token",
            return_value=(mock_token, True),
        )

        response = api_client.post(
            "/api/auth/verification/verify/", {"email": "test@example.com", "confirmation_code": "123456"}
        )

        self.assert_success_response(response)
        assert response.data["detail"] == "アカウントが確認されました。"
        assert response.data["key"] == "dummy_token"
        assert response.data["is_new_user"]
        mock_verify.assert_called_once()
        mock_confirm.assert_called_once()

    def test_verify_code_invalid_code(self, api_client, verification_user):
        """無効な確認コードのテスト"""
        response = api_client.post(
            "/api/auth/verification/verify/", {"email": "test@example.com", "confirmation_code": "000000"}
        )
        self.assert_error_response(response)


class TestVerifyEmailPasswordView(BaseAuthViewTest):
    """VerifyEmailPasswordViewのテストクラス"""

    def test_verify_credentials_success(self, api_client, mocker, valid_registration_data):
        """メールアドレスとパスワードの検証成功テスト"""
        User.objects.create_user(
            email=valid_registration_data["email"],
            password=valid_registration_data["password1"],
            username="test-user",
            is_active=False,
        )

        mock_verify = mocker.patch(
            "apps.accounts.services.verification_service.EmailPasswordVerificationService.verify_user_credentials"
        )

        response = api_client.post(
            "/api/auth/verification/verify-email-password/",
            {"email": valid_registration_data["email"], "password": valid_registration_data["password1"]},
        )

        self.assert_success_response(response)
        assert response.data["detail"] == "メールアドレスとパスワードが確認されました。"
        mock_verify.assert_called_once()

    def test_verify_credentials_invalid(self, api_client, valid_registration_data):
        """無効な認証情報のテスト"""
        User.objects.create_user(
            email=valid_registration_data["email"],
            password=valid_registration_data["password1"],
            username="test-user",
            is_active=False,
        )

        response = api_client.post(
            "/api/auth/verification/verify-email-password/",
            {"email": valid_registration_data["email"], "password": "wrongpass"},
        )
        self.assert_error_response(response)
