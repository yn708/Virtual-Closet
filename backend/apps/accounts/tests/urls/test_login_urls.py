import pytest

from apps.accounts.tests.urls.base import BaseUrlTest


class TestLoginUrls(BaseUrlTest):
    """ログイン関連URLのテスト"""

    URL_PATTERNS = [
        ("login_google", "/api/auth/login/google/"),
        ("login_email", "/api/auth/login/email/"),
        ("login_after_verification", "/api/auth/login/after-verification/"),
    ]

    @pytest.mark.django_db
    @pytest.mark.parametrize("url_name,expected_path", URL_PATTERNS)
    def test_login_urls(self, url_name, expected_path):
        """ログイン関連URLの検証"""
        self.assert_url_resolves(url_name, expected_path)
