"""メールサービスのテスト"""

from unittest.mock import patch

import pytest
from django.core import mail

from apps.accounts.services.email_service import EmailService
from apps.accounts.tests.services.base import BaseServiceTest
from config import settings


class TestEmailService(BaseServiceTest):
    """メールサービスのテスト"""

    def test_send_confirmation_email(self, inactive_user, mock_verification_service):
        """確認メール送信のテスト"""
        service = EmailService(mock_verification_service)
        service.send_confirmation_email(inactive_user)

        assert len(mail.outbox) == 1
        sent_mail = mail.outbox[0]
        assert sent_mail.to == [inactive_user.email]
        assert sent_mail.from_email == settings.DEFAULT_FROM_EMAIL

    @patch("django.core.mail.EmailMultiAlternatives.send")
    def test_send_confirmation_email_failure(self, mock_send, inactive_user, mock_verification_service):
        """メール送信失敗のテスト"""
        mock_send.side_effect = Exception("メール送信エラー")
        service = EmailService(mock_verification_service)

        with pytest.raises(Exception, match="メール送信エラー"):
            service.send_confirmation_email(inactive_user)
