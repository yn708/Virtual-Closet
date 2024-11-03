import pytest
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken


@pytest.fixture
def api_client():
    """APIクライアント提供"""
    return APIClient()


@pytest.fixture
def auth_client(api_client, user):
    """JWT認証済みAPIクライアント提供"""
    refresh = RefreshToken.for_user(user)
    api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")
    return api_client


@pytest.fixture
def user(django_user_model):
    """テストユーザー作成"""
    return django_user_model.objects.create_user(email="test@example.com", password="TESTpass123")
