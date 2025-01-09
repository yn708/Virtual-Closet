import json
import logging

import requests
from django.conf import settings
from django.core.mail import send_mail

logger = logging.getLogger(__name__)


class NotificationService:
    def __init__(self):
        self.line_api_url = "https://api.line.me/v2/bot/message/push"
        self.headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {settings.LINE_CHANNEL_ACCESS_TOKEN}",
        }

    def send_email(self, data):
        """
        メール通知を送信（送信成功ならTrue）
        """
        try:
            subject = f"【お問い合わせ】{data.get('subject', '不明')}"
            message = self._create_message_text(data)

            send_mail(
                subject=subject,
                message=message,
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[settings.EMAIL_HOST_USER],
                fail_silently=False,
            )
            logger.info(
                "Email sent successfully",
                extra={"name": data.get("name"), "email": data.get("email"), "subject": data.get("subject")},
            )
            return True
        except Exception as e:
            logger.error(f"Email sending failed: {e}", exc_info=True)
            return False

    def send_line(self, data):
        """
        LINE通知を送信（送信成功ならTrue）
        """
        try:
            message = {
                "to": settings.LINE_USER_ID,
                "messages": [{"type": "text", "text": self._create_message_text(data)}],
            }

            response = requests.post(self.line_api_url, headers=self.headers, data=json.dumps(message), timeout=10)

            if response.status_code != 200:
                logger.error(f"LINE API error: {response.text}")
                return False

            logger.info(
                "LINE message sent successfully", extra={"name": data.get("name"), "subject": data.get("subject")}
            )
            return True
        except requests.Timeout:
            logger.error("LINE API request timed out")
            return False
        except Exception as e:
            logger.error(f"LINE sending failed: {e}", exc_info=True)
            return False

    def notify(self, data):
        """
        全通知チャネルに送信（いずれかのチャネルで送信成功ならTrue）
        """
        required_fields = ["name", "email", "subject", "message"]
        if not all(key in data for key in required_fields):
            logger.error("Missing required data fields", extra={"data": data})
            return False

        email_success = self.send_email(data)
        line_success = self.send_line(data)

        return email_success or line_success

    def _create_message_text(self, data):
        """
        通知メッセージを作成（フォーマット済みメッセージ）
        """
        return f"""
お問い合わせがありました。

■お名前
{data.get('name', '不明')}

■メールアドレス
{data.get('email', '不明')}

■件名
{data.get('subject', '不明')}

■お問い合わせ内容
{data.get('message', '内容なし')}
"""
