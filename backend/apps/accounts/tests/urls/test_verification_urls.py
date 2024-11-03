import pytest

from apps.accounts.tests.urls.base import BaseUrlTest


class TestVerificationUrls(BaseUrlTest):
    """認証関連URLのテスト"""

    URL_PATTERNS = [
        ("send_verification_code", "/api/auth/verification/send/"),
        ("resend_verification_code", "/api/auth/verification/resend/"),
        ("verify_code", "/api/auth/verification/verify/"),
        ("verify_email_password", "/api/auth/verification/verify-email-password/"),
    ]

    @pytest.mark.django_db
    @pytest.mark.parametrize("url_name,expected_path", URL_PATTERNS)
    def test_verification_urls(self, url_name, expected_path):
        """認証関連URLの検証"""
        self.assert_url_resolves(url_name, expected_path)
