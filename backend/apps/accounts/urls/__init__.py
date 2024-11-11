from django.urls import include, path

from ..views.token_view import TokenRefreshView
from .login_patterns import login_patterns
from .user_patterns import user_patterns
from .verification_patterns import verification_patterns

urlpatterns = [
    # 基本認証エンドポイント（パスワードリセット等）
    path("", include("dj_rest_auth.urls")),
    # ログイン関連
    path("login/", include(login_patterns)),
    # 認証コード関連(サインアップ)
    path("verification/", include(verification_patterns)),
    path("user/", include(user_patterns)),
    path("token-refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
