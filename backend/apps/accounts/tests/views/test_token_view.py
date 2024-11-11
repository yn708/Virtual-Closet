"""TokenRefreshViewのテストモジュール"""

from datetime import datetime, timedelta
from unittest.mock import patch

import pytest
from freezegun import freeze_time
from rest_framework import status
from rest_framework_simplejwt.exceptions import TokenError

from apps.accounts.tests.views.base import BaseAuthViewTest


class TestTokenRefreshView(BaseAuthViewTest):
    """TokenRefreshViewのテストクラス"""

    @pytest.fixture
    def refresh_url(self):
        """リフレッシュエンドポイントのURL"""
        return "/api/auth/token-refresh/"

    def test_successful_token_refresh(self, api_client, refresh_url, active_user):
        """正常系: トークンのリフレッシュが成功するケース"""
        # 初期トークンを生成
        from apps.accounts.services.token_service import TokenService

        initial_tokens = TokenService.get_tokens_for_user(active_user)

        # リフレッシュリクエストを実行
        response = api_client.post(refresh_url, {"refresh": initial_tokens["refresh"]})

        # レスポンスの検証
        assert response.status_code == status.HTTP_200_OK

        # 新しいトークンの構造を確認
        assert "access" in response.data
        assert "refresh" in response.data
        assert "expires_at" in response.data
        assert "refresh_expires_at" in response.data

        # トークンの形式を確認
        assert isinstance(response.data["access"], str)
        assert isinstance(response.data["refresh"], str)

        # 有効期限の形式を確認
        assert datetime.fromisoformat(response.data["expires_at"])
        assert datetime.fromisoformat(response.data["refresh_expires_at"])

    def test_invalid_refresh_token(self, api_client, refresh_url):
        """異常系: 無効なリフレッシュトークンを使用した場合"""
        response = api_client.post(refresh_url, {"refresh": "invalid_refresh_token"})

        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert "error" in response.data

    def test_expired_refresh_token(self, api_client, refresh_url, active_user):
        """異常系: 期限切れのリフレッシュトークンを使用した場合"""
        # 期限切れのモックトークンを生成
        with patch("apps.accounts.services.token_service.TokenService.refresh_token") as mock_refresh:
            mock_refresh.side_effect = TokenError("Token is invalid or expired")

            response = api_client.post(refresh_url, {"refresh": "expired_token"})

            assert response.status_code == status.HTTP_401_UNAUTHORIZED
            assert response.data["error"] == "Token is invalid or expired"

    def test_missing_refresh_token(self, api_client, refresh_url):
        """異常系: リフレッシュトークンが提供されていない場合"""
        response = api_client.post(refresh_url, {})

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "error" in response.data
        assert response.data["error"] == "Refresh token is required"

    @freeze_time("2024-01-01 12:00:00")  # pytest.mark.freeze_time から変更
    def test_refresh_token_near_expiry(self, api_client, refresh_url, active_user):
        """正常系: リフレッシュトークンの期限が近い場合の新規発行テスト"""
        # 初期トークンを生成
        from apps.accounts.services.token_service import TokenService

        initial_tokens = TokenService.get_tokens_for_user(active_user)

        with patch("apps.accounts.services.token_service.datetime") as mock_datetime:
            # 現在時刻を設定
            current_time = datetime(2024, 1, 1, 12, 0, 0)
            mock_datetime.now.return_value = current_time
            mock_datetime.fromtimestamp.return_value = current_time + timedelta(days=6)

            response = api_client.post(refresh_url, {"refresh": initial_tokens["refresh"]})

            assert response.status_code == status.HTTP_200_OK
            assert response.data["refresh"] != initial_tokens["refresh"]
            assert response.data["access"] != initial_tokens["access"]

    def test_response_structure(self, api_client, refresh_url, active_user):
        """正常系: レスポンスの構造が期待通りであることを確認"""
        # 初期トークンを生成
        from apps.accounts.services.token_service import TokenService

        initial_tokens = TokenService.get_tokens_for_user(active_user)

        response = api_client.post(refresh_url, {"refresh": initial_tokens["refresh"]})

        assert response.status_code == status.HTTP_200_OK

        # レスポンス構造の検証
        expected_keys = {"access", "refresh", "expires_at", "refresh_expires_at"}
        assert set(response.data.keys()) == expected_keys
