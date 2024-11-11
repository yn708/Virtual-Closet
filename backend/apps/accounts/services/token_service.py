from datetime import datetime, timedelta

from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken


class TokenService:
    """トークン生成と更新のためのユーティリティクラス"""

    @staticmethod
    def get_tokens_for_user(user):
        """新規ログイン時のトークン生成"""

        refresh = RefreshToken.for_user(user)

        # トークンの有効期限を計算
        access_expires = datetime.fromtimestamp(refresh.access_token["exp"])
        refresh_expires = datetime.fromtimestamp(refresh["exp"])

        return {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "expires_at": access_expires.isoformat(),
            "refresh_expires_at": refresh_expires.isoformat(),
        }

    @staticmethod
    def refresh_token(refresh_token_str):
        """既存のリフレッシュトークンから新しいトークンを生成"""
        try:
            refresh = RefreshToken(refresh_token_str)
            refresh_expires = datetime.fromtimestamp(refresh["exp"])
            remaining_time = refresh_expires - datetime.now()

            # リフレッシュトークンの期限が近い場合は新しいリフレッシュトークンを発行
            if remaining_time < timedelta(days=7):
                User = get_user_model()
                user = User.objects.get(userId=refresh["user_id"])
                new_refresh = RefreshToken.for_user(user)
                return {
                    "access": str(new_refresh.access_token),
                    "refresh": str(new_refresh),
                    "expires_at": datetime.fromtimestamp(new_refresh.access_token["exp"]).isoformat(),
                    "refresh_expires_at": datetime.fromtimestamp(new_refresh["exp"]).isoformat(),
                }
            # 通常のレスポンス
            return {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "expires_at": datetime.fromtimestamp(refresh.access_token["exp"]).isoformat(),
                "refresh_expires_at": refresh_expires.isoformat(),
            }

        except Exception as e:
            raise e
