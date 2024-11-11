from datetime import datetime, timedelta
from unittest.mock import patch

import pytest
from freezegun import freeze_time
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken

from apps.accounts.services.token_service import TokenService
from apps.accounts.tests.services.base import BaseServiceTest


class TestTokenService(BaseServiceTest):
    @pytest.fixture
    def token_service(self):
        """TokenServiceインスタンスを返すフィクスチャ"""
        return TokenService()

    def test_get_tokens_for_user_structure(self, active_user, token_service):
        """get_tokens_for_userメソッドが適切な構造のトークンを返すことを確認"""
        tokens = token_service.get_tokens_for_user(active_user)

        assert all(key in tokens for key in ["access", "refresh", "expires_at", "refresh_expires_at"])

        assert isinstance(tokens["access"], str)
        assert isinstance(tokens["refresh"], str)
        assert isinstance(tokens["expires_at"], str)
        assert isinstance(tokens["refresh_expires_at"], str)

    def test_get_tokens_for_user_validity(self, active_user, token_service):
        """生成されたトークンが有効であることを確認"""
        tokens = token_service.get_tokens_for_user(active_user)

        # トークンの検証
        refresh = RefreshToken(tokens["refresh"])
        access = refresh.access_token

        # ユーザーIDが正しいことを確認
        assert refresh["user_id"] == str(active_user.userId)
        assert access["user_id"] == str(active_user.userId)

    @freeze_time("2024-01-01 12:00:00")
    def test_refresh_token_near_expiry(self, active_user, token_service):
        """リフレッシュトークンの期限が近い場合のテスト"""
        with patch("apps.accounts.services.token_service.datetime") as mock_datetime:
            current_time = datetime(2024, 1, 1, 12, 0, 0)
            mock_datetime.now.return_value = current_time
            mock_datetime.fromtimestamp.return_value = current_time + timedelta(days=6)

            # 初期トークンを生成
            initial_tokens = token_service.get_tokens_for_user(active_user)

            # トークンをリフレッシュ
            new_tokens = token_service.refresh_token(initial_tokens["refresh"])

            # 新しいリフレッシュトークンが発行されることを確認
            assert new_tokens["refresh"] != initial_tokens["refresh"]
            assert new_tokens["access"] != initial_tokens["access"]

    def test_refresh_token_invalid_token(self, token_service):
        """無効なリフレッシュトークンでの例外発生を確認"""
        with pytest.raises(TokenError):
            token_service.refresh_token("invalid_token")

    def test_refresh_token_expired(self, active_user, token_service):
        """期限切れトークンでの例外発生を確認"""
        with patch("rest_framework_simplejwt.tokens.RefreshToken") as mock_refresh:
            mock_refresh.side_effect = TokenError("Token is invalid or expired")

            with pytest.raises(TokenError) as exc_info:
                token_service.refresh_token("expired_token")

            assert str(exc_info.value) == "Token is invalid or expired"

    def test_token_expiration_dates(self, active_user, token_service):
        """トークンの有効期限が適切な形式で返されることを確認"""
        tokens = token_service.get_tokens_for_user(active_user)

        expires_at = datetime.fromisoformat(tokens["expires_at"])
        refresh_expires_at = datetime.fromisoformat(tokens["refresh_expires_at"])

        assert expires_at < refresh_expires_at
        assert expires_at > datetime.now()
        assert refresh_expires_at > datetime.now()
