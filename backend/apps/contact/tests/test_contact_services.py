import json
from unittest.mock import Mock, patch

import pytest
from django.conf import settings
from requests.exceptions import Timeout

from apps.contact.services import NotificationService


class TestNotificationService:
    """NotificationServiceのテストクラス"""

    @pytest.fixture
    def notification_service(self):
        """NotificationServiceのインスタンスを提供するフィクスチャ"""
        return NotificationService()

    @pytest.fixture
    def valid_data(self):
        """有効な問い合わせデータを提供するフィクスチャ"""
        return {
            "name": "テストユーザー",
            "email": "test@example.com",
            "subject": "テスト件名",
            "message": "これはテストメッセージです。",
        }

    class TestSendEmail:
        """send_emailメソッドのテストクラス"""

        @patch("apps.contact.services.send_mail")
        def test_successful_email_send(self, mock_send_mail, notification_service, valid_data):
            """正常系: メール送信成功のテスト"""
            mock_send_mail.return_value = 1

            result = notification_service.send_email(valid_data)

            assert result is True
            mock_send_mail.assert_called_once_with(
                subject=f"【お問い合わせ】{valid_data['subject']}",
                message=notification_service._create_message_text(valid_data),
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[settings.EMAIL_HOST_USER],
                fail_silently=False,
            )

        @patch("apps.contact.services.send_mail")
        def test_email_send_failure(self, mock_send_mail, notification_service, valid_data):
            """異常系: メール送信失敗のテスト"""
            mock_send_mail.side_effect = Exception("Email sending failed")

            result = notification_service.send_email(valid_data)

            assert result is False
            mock_send_mail.assert_called_once()

    class TestSendLine:
        """send_lineメソッドのテストクラス"""

        @patch("requests.post")
        def test_successful_line_send(self, mock_post, notification_service, valid_data):
            """正常系: LINE送信成功のテスト"""
            mock_response = Mock()
            mock_response.status_code = 200
            mock_post.return_value = mock_response

            result = notification_service.send_line(valid_data)

            assert result is True
            expected_data = {
                "to": settings.LINE_USER_ID,
                "messages": [{"type": "text", "text": notification_service._create_message_text(valid_data)}],
            }
            mock_post.assert_called_once_with(
                notification_service.line_api_url,
                headers=notification_service.headers,
                data=json.dumps(expected_data),
                timeout=10,
            )

        @patch("requests.post")
        def test_line_send_api_error(self, mock_post, notification_service, valid_data):
            """異常系: LINE API エラーのテスト"""
            mock_response = Mock()
            mock_response.status_code = 400
            mock_response.text = "Bad Request"
            mock_post.return_value = mock_response

            result = notification_service.send_line(valid_data)

            assert result is False
            mock_post.assert_called_once()

        @patch("requests.post")
        def test_line_send_timeout(self, mock_post, notification_service, valid_data):
            """異常系: タイムアウトのテスト"""
            mock_post.side_effect = Timeout()

            result = notification_service.send_line(valid_data)

            assert result is False
            mock_post.assert_called_once()

    class TestNotify:
        """notifyメソッドのテストクラス"""

        def test_missing_required_fields(self, notification_service):
            """異常系: 必須フィールド欠落のテスト"""
            invalid_data = {"name": "テストユーザー", "email": "test@example.com"}

            result = notification_service.notify(invalid_data)

            assert result is False

        @patch.object(NotificationService, "send_email")
        @patch.object(NotificationService, "send_line")
        def test_all_notifications_success(self, mock_send_line, mock_send_email, notification_service, valid_data):
            """正常系: 全通知チャネル成功のテスト"""
            mock_send_email.return_value = True
            mock_send_line.return_value = True

            result = notification_service.notify(valid_data)

            assert result is True
            mock_send_email.assert_called_once_with(valid_data)
            mock_send_line.assert_called_once_with(valid_data)

    class TestCreateMessageText:
        """_create_message_textメソッドのテストクラス"""

        def test_create_message_with_valid_data(self, notification_service, valid_data):
            """正常系: 有効なデータでのメッセージ作成テスト"""
            message = notification_service._create_message_text(valid_data)

            assert "お問い合わせがありました。" in message
            assert valid_data["name"] in message
            assert valid_data["email"] in message
            assert valid_data["subject"] in message
            assert valid_data["message"] in message
