from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
from dj_rest_auth.views import LoginView as DjRestAuthLoginView
from django.contrib.auth import get_user_model
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from ..serializers.login_serializers import LoginUserSerializer
from ..services.user_service import UserService

User = get_user_model()


class GoogleLoginView(SocialLoginView):
    """Googleログイン用のカスタムビュー"""

    adapter_class = GoogleOAuth2Adapter
    client_class = OAuth2Client

    def get_response(self):
        """ログインレスポンスをカスタマイズ"""
        response = super().get_response()

        if response.status_code == 200:
            is_new_user = UserService.update_user_after_google_login(self.user)
            response.data["is_new_user"] = is_new_user

        return response


class EmailLoginView(DjRestAuthLoginView):
    """
    Emailログイン用のカスタムビュー
    DjRestAuthLoginViewを拡張
    """

    def get_response(self):
        response = super().get_response()
        if response.status_code == 200:
            user = self.user
            user_serializer = LoginUserSerializer(user)

            response.data.update({"user": user_serializer.data, "is_new_user": UserService.is_new_user(user)})
        return response


class LoginAfterVerificationView(APIView):
    """
    認証後そのままログイン
    """

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_serializer = LoginUserSerializer(request.user)
        return Response(user_serializer.data)
