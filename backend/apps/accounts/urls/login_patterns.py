from django.urls import path

from apps.accounts.views.auth_login_views import (
    EmailLoginView,
    GoogleLoginView,
    LoginAfterVerificationView,
)

login_patterns = [
    path("google/", GoogleLoginView.as_view(), name="login_google"),
    path("email/", EmailLoginView.as_view(), name="login_email"),
    path("after-verification/", LoginAfterVerificationView.as_view(), name="login_after_verification"),
]
