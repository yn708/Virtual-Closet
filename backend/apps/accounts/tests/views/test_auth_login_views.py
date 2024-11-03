"""
ログイン関連のビューテスト
"""

from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.authtoken.models import Token

from apps.accounts.tests.views.base import BaseAuthViewTest

User = get_user_model()


class TestEmailLoginView(BaseAuthViewTest):
    """EmailLoginViewのテストクラス"""

    def test_successful_login(self, api_client, active_user):
        """正常なログインケースのテスト"""
        response = api_client.post("/api/auth/login/email/", {"email": "test@example.com", "password": "TESTpass123"})

        self.assert_success_response(response)
        assert "access" in response.data
        assert "user" in response.data
        assert "is_new_user" in response.data
        assert response.data["user"]["email"] == active_user.email
        assert isinstance(response.data["access"], str)
        assert len(response.data["access"]) > 0

    def test_invalid_credentials(self, api_client):
        """無効な認証情報でのログイン失敗テスト"""
        response = api_client.post("/api/auth/login/email/", {"email": "wrong@example.com", "password": "wrongpass"})
        self.assert_error_response(response)

    def test_inactive_user(self, api_client, inactive_user):
        """非アクティブユーザーのログイン試行テスト"""
        response = api_client.post("/api/auth/login/email/", {"email": "test@example.com", "password": "TESTpass123"})
        self.assert_error_response(response)

    def test_missing_credentials(self, api_client):
        """認証情報が不足しているケースのテスト"""
        response = api_client.post("/api/auth/login/email/", {"email": "test@example.com"})
        self.assert_error_response(response)


class TestLoginAfterVerificationView(BaseAuthViewTest):
    """LoginAfterVerificationViewのテストクラス"""

    def test_authenticated_access(self, api_client, active_user):
        """認証済みユーザーのアクセステスト"""
        token = Token.objects.create(user=active_user)
        api_client.credentials(HTTP_AUTHORIZATION=f"Token {token.key}")

        response = api_client.get("/api/auth/login/after-verification/")

        self.assert_success_response(response)
        assert response.data["email"] == active_user.email
        assert response.data["username"] == active_user.username

    def test_unauthenticated_access(self, api_client):
        """未認証ユーザーのアクセス拒否テスト"""
        response = api_client.get("/api/auth/login/after-verification/")
        self.assert_error_response(response, status.HTTP_401_UNAUTHORIZED)
