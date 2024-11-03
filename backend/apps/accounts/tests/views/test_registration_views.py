"""
メール確認関連のビューテスト
"""

from django.contrib.auth import get_user_model
from rest_framework import status

from apps.accounts.tests.views.base import BaseAuthViewTest

User = get_user_model()


class TestSendVerificationCodeView(BaseAuthViewTest):
    """SendVerificationCodeViewのテストクラス"""

    def test_send_verification_code_new_user(self, api_client, mocker, valid_registration_data):
        """新規ユーザー登録のテスト"""
        mock_send_confirmation = mocker.patch(
            "apps.accounts.services.email_service.EmailService.send_confirmation_email"
        )

        response = api_client.post("/api/auth/verification/send/", valid_registration_data)

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["detail"] == "確認コードをメールで送信しました。"
        assert mock_send_confirmation.called

        user = User.objects.get(email=valid_registration_data["email"])
        assert not user.is_active

    def test_send_verification_code_existing_inactive_user(
        self, api_client, mocker, inactive_user, valid_registration_data
    ):
        """既存の未認証ユーザーへの確認コード再送信テスト"""
        mock_send_confirmation = mocker.patch(
            "apps.accounts.services.email_service.EmailService.send_confirmation_email"
        )

        response = api_client.post("/api/auth/verification/send/", valid_registration_data)

        self.assert_success_response(response)
        assert response.data["detail"] == "新しい確認コードをメールで送信しました。"
        assert mock_send_confirmation.called

    def test_gmail_signup_not_allowed(self, api_client, gmail_registration_data):
        """Gmailアドレスでの登録制限テスト"""
        response = api_client.post("/api/auth/verification/send/", gmail_registration_data)
        self.assert_error_response(response)


class TestResendVerificationCodeView(BaseAuthViewTest):
    """ResendVerificationCodeViewのテストクラス"""

    def test_resend_verification_code_success(self, api_client, mocker, inactive_user, valid_registration_data):
        """確認コード再送信の正常系テスト"""
        mock_send_confirmation = mocker.patch(
            "apps.accounts.services.email_service.EmailService.send_confirmation_email"
        )

        response = api_client.post(
            "/api/auth/verification/resend/",
            {
                "email": valid_registration_data["email"],
                "password": valid_registration_data["password1"],
            },
        )

        self.assert_success_response(response)
        assert response.data["detail"] == "新しい確認コードを送信しました。"
        assert mock_send_confirmation.called

    def test_resend_verification_missing_credentials(self, api_client, valid_registration_data):
        """認証情報不足のテスト"""
        response = api_client.post("/api/auth/verification/resend/", {"email": valid_registration_data["email"]})
        self.assert_error_response(response)

    def test_resend_verification_invalid_credentials(self, api_client, inactive_user, valid_registration_data):
        """不正な認証情報のテスト"""
        response = api_client.post(
            "/api/auth/verification/resend/", {"email": valid_registration_data["email"], "password": "wrongpass"}
        )
        self.assert_error_response(response)
