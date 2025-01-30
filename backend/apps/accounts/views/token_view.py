from rest_framework import status
from rest_framework.response import Response
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.views import TokenRefreshView as SimpleJWTTokenRefreshView

from ..services.token_service import TokenService


class TokenRefreshView(SimpleJWTTokenRefreshView):
    """トークンリフレッシュ用ビュー"""

    def post(self, request, *args, **kwargs):
        """リフレッシュトークンを使用して新しいアクセストークンを取得"""
        try:
            refresh_token = request.data.get("refresh")
            if not refresh_token:
                return Response({"error": "Refresh token is required"}, status=status.HTTP_400_BAD_REQUEST)

            tokens = TokenService.refresh_token(refresh_token)
            return Response(tokens)

        except TokenError as e:
            return Response({"error": str(e)}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception:
            return Response(
                {"error": "An error occurred while refreshing the token"}, status=status.HTTP_400_BAD_REQUEST
            )
