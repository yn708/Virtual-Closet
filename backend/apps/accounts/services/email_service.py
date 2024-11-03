from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string

from .verification_service import VerificationService

User = get_user_model()


class EmailService:
    def __init__(self, verification_service: VerificationService):
        self.verification_service = verification_service

    def get_email_context(self, user, confirmation_code):
        """メールテンプレート用のコンテキストを生成"""

        return {
            "confirmation_code": confirmation_code,
            "expiration_message": self.verification_service.get_expiration_message(user.confirmation_code_created_at),
            "user": user,
        }

    def send_confirmation_email(self, user):
        """6桁の確認コードを生成し、メールで送信"""
        confirmation_code = self.verification_service.generate_confirmation_code()  # ６桁の認証コード作成
        user.set_confirmation_code(confirmation_code)  # ConfirmationCodeMixin.set_confirmation_code

        # コンテキストの作成
        context = self.get_email_context(user, confirmation_code)

        # 件名の取得
        subject = render_to_string("account/email/confirmation_code/confirmation_code_subject.txt", context).strip()

        # HTMLとテキストコンテンツの作成
        html_content = render_to_string("account/email/confirmation_code/confirmation_code.html", context)
        text_content = render_to_string("account/email/confirmation_code/confirmation_code.txt", context)

        # メールの作成と送信
        email = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[user.email],
            alternatives=[(html_content, "text/html")],
        )

        email.send(fail_silently=False)
