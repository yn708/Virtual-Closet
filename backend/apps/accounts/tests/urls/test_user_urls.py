import pytest

from apps.accounts.tests.urls.base import BaseUrlTest


class TestVerificationUrls(BaseUrlTest):
    """認証関連URLのテスト"""

    URL_PATTERNS = [
        ("user_detail", "/api/auth/user/detail/"),
        ("user_update", "/api/auth/user/update/"),
    ]

    @pytest.mark.django_db
    @pytest.mark.parametrize("url_name,expected_path", URL_PATTERNS)
    def test_verification_urls(self, url_name, expected_path):
        """ユーザー関連URLの検証"""
        self.assert_url_resolves(url_name, expected_path)
