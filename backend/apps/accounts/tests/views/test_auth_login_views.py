"""
ログイン関連のビューテスト
"""

from datetime import datetime

from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from apps.accounts.tests.views.base import BaseAuthViewTest

User = get_user_model()


class TestEmailLoginView(BaseAuthViewTest):
    """EmailLoginViewのテストクラス"""

    def test_successful_login(self, api_client, active_user):
        """正常なログインケースのテスト"""
        response = api_client.post("/api/auth/login/email/", {"email": "test@example.com", "password": "TESTpass123"})

        self.assert_success_response(response)

        # トークン関連の検証
        assert "tokens" in response.data
        tokens = response.data["tokens"]
        assert "access" in tokens
        assert "refresh" in tokens
        assert "expires_at" in tokens
        assert "refresh_expires_at" in tokens

        # トークンの形式を確認
        assert isinstance(tokens["access"], str)
        assert isinstance(tokens["refresh"], str)

        # 有効期限の形式を確認
        assert datetime.fromisoformat(tokens["expires_at"])
        assert datetime.fromisoformat(tokens["refresh_expires_at"])

        # ユーザー情報の検証
        assert "user" in response.data
        assert "is_new_user" in response.data
        assert response.data["user"]["email"] == active_user.email

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


class TestLoginAfterVerificationView:
    """LoginAfterVerificationViewのテストクラス"""

    def test_successful_verification_login(self, auth_client, active_user):
        """正常系: 認証済みユーザーが正常にログインできることを確認"""
        url = "/api/auth/login/after-verification/"

        # 認証状態を確認
        assert auth_client.handler._force_user == active_user
        assert Token.objects.filter(user=active_user).exists()

        response = auth_client.get(url)

        assert response.status_code == status.HTTP_200_OK

        # トークン関連の検証
        assert "tokens" in response.data
        tokens = response.data["tokens"]
        assert "access" in tokens
        assert "refresh" in tokens
        assert "expires_at" in tokens
        assert "refresh_expires_at" in tokens

        # トークンの形式を確認
        assert isinstance(tokens["access"], str)
        assert isinstance(tokens["refresh"], str)

        # 有効期限の形式を確認
        assert datetime.fromisoformat(tokens["expires_at"])
        assert datetime.fromisoformat(tokens["refresh_expires_at"])

        # ユーザー情報の検証
        user_data = response.data["user"]
        assert user_data["email"] == active_user.email
        assert user_data["username"] == active_user.username

        # アクセストークンの有効性を確認
        refresh = RefreshToken(tokens["refresh"])
        assert refresh["user_id"] == str(active_user.userId)

    def test_unauthorized_access(self, api_client):
        """異常系: 未認証ユーザーのアクセスが拒否されることを確認"""
        url = "/api/auth/login/after-verification/"
        response = api_client.get(url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_invalid_token(self, api_client):
        """異常系: 無効なトークンでのアクセスが拒否されることを確認"""
        api_client.credentials(HTTP_AUTHORIZATION="Token invalid_token")
        url = "/api/auth/login/after-verification/"
        response = api_client.get(url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_expired_token(self, auth_client, active_user, auth_token):
        """異常系: 期限切れトークンの処理を確認"""
        auth_token.delete()
        api_client = APIClient()

        url = "/api/auth/login/after-verification/"
        response = api_client.get(url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_response_structure(self, auth_client, active_user):
        """正常系: レスポンスの構造が期待通りであることを確認"""
        url = "/api/auth/login/after-verification/"

        assert auth_client.handler._force_user == active_user
        assert Token.objects.filter(user=active_user).exists()

        response = auth_client.get(url)
        assert response.status_code == status.HTTP_200_OK

        # レスポンス構造の検証
        assert isinstance(response.data, dict)
        assert "tokens" in response.data
        assert "user" in response.data

        tokens = response.data["tokens"]
        assert isinstance(tokens, dict)
        assert all(key in tokens for key in ["access", "refresh", "expires_at", "refresh_expires_at"])

        user_data = response.data["user"]
        assert isinstance(user_data, dict)
        assert "email" in user_data
        assert "username" in user_data
