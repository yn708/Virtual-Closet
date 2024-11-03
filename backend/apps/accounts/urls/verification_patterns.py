from django.urls import path

from apps.accounts.views.registration_views import ResendVerificationCodeView, SendVerificationCodeView
from apps.accounts.views.verification_views import VerifyCodeView, VerifyEmailPasswordView

verification_patterns = [
    path("send/", SendVerificationCodeView.as_view(), name="send_verification_code"),
    path("resend/", ResendVerificationCodeView.as_view(), name="resend_verification_code"),
    path("verify/", VerifyCodeView.as_view(), name="verify_code"),
    path("verify-email-password/", VerifyEmailPasswordView.as_view(), name="verify_email_password"),
]
