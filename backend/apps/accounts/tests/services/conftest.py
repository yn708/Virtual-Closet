"""共通のフィクスチャ定義"""

from unittest.mock import Mock

import pytest
from django.contrib.auth import get_user_model

User = get_user_model()


@pytest.fixture
def user_data():
    """基本的なユーザーデータ"""
    return {"email": "test@example.com", "password": "TESTpass123"}


@pytest.fixture
def inactive_user(db, user_data):
    """非アクティブユーザー"""
    return User.objects.create_user(username="inactive-user", is_active=False, **user_data)


@pytest.fixture
def active_user(db, user_data):
    """アクティブユーザー"""
    return User.objects.create_user(username="active-user", is_active=True, **user_data)


@pytest.fixture
def mock_verification_service():
    """VerificationServiceモック"""
    service = Mock()
    service.generate_confirmation_code.return_value = "123456"
    service.get_expiration_message.return_value = "このコードは20分間有効です。"
    return service
