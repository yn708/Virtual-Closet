import pytest
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient

User = get_user_model()


@pytest.fixture
def api_client():
    """APIクライアントを提供するフィクスチャ"""
    return APIClient()


@pytest.fixture
def active_user(db):
    """アクティブなユーザーを作成"""
    return User.objects.create_user(
        email="test@example.com", password="TESTpass123", username="active-user", is_active=True
    )


@pytest.fixture
def auth_token(active_user):
    """認証トークンを生成するフィクスチャ"""
    token = Token.objects.create(user=active_user)
    return token


@pytest.fixture
def auth_client(api_client, auth_token):
    """認証済みAPIクライアントを返すフィクスチャ"""
    api_client.force_authenticate(user=auth_token.user, token=auth_token)
    return api_client
