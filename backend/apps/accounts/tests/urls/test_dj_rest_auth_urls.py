import pytest
from rest_framework import status

from apps.accounts.tests.urls.base import BaseUrlTest


class TestDjRestAuthUrls:
    """Django REST Auth URLsのテスト"""

    @pytest.mark.django_db
    class TestPasswordReset(BaseUrlTest):
        """パスワードリセット関連のURLテスト"""

        def test_password_reset_url(self):
            """パスワードリセットURLの検証"""
            self.assert_url_resolves("rest_password_reset", "/api/auth/password/reset/")

        def test_authentication_not_required(self, api_client):
            """認証不要の確認"""
            response = api_client.post("/api/auth/password/reset/", {"email": "test@example.com"})
            assert response.status_code != status.HTTP_401_UNAUTHORIZED
