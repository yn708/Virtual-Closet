from unittest.mock import Mock, patch

import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

User = get_user_model()

# 共通のテストデータ
TEST_USER_EMAIL = "test@example.com"
TEST_USER_PASSWORD = "TESTpass123"
GMAIL_USER_EMAIL = "test@gmail.com"


@pytest.fixture
def api_client():
    """APIクライアントを提供するフィクスチャ"""
    return APIClient()


@pytest.fixture
def test_password():
    """共通のテストパスワード"""
    return TEST_USER_PASSWORD


@pytest.fixture
def test_email():
    """共通のテストメールアドレス"""
    return TEST_USER_EMAIL


@pytest.fixture
def valid_registration_data(test_email, test_password):
    """有効な登録データを提供"""
    return {
        "email": test_email,
        "password1": test_password,
        "password2": test_password,
    }


@pytest.fixture
def gmail_registration_data(test_password):
    """Gmailアドレスでの登録データを提供"""
    return {
        "email": GMAIL_USER_EMAIL,
        "password1": test_password,
        "password2": test_password,
    }


@pytest.fixture
def inactive_user(db, test_email, test_password):
    """非アクティブなユーザーを作成"""
    return User.objects.create_user(email=test_email, password=test_password, username="inactive-user", is_active=False)


@pytest.fixture
def active_user(db, test_email, test_password):
    """アクティブなユーザーを作成"""
    return User.objects.create_user(email=test_email, password=test_password, username="active-user", is_active=True)


@pytest.fixture
def mock_user():
    """モックユーザーを提供"""
    return Mock(spec=User)


# サービスのモックフィクスチャ
@pytest.fixture
def mock_email_service():
    """EmailServiceのモック"""
    with patch("apps.accounts.services.email_service.EmailService") as mock:
        yield mock


@pytest.fixture
def mock_verification_service():
    """VerificationServiceのモック"""
    with patch("apps.accounts.services.email_service.VerificationService") as mock:
        yield mock


@pytest.fixture
def mock_auth_service():
    """AuthenticationServiceのモック"""
    with patch("apps.accounts.services.authentication_service.AuthenticationService") as mock:
        yield mock


@pytest.fixture(autouse=True)
def enable_db_access_for_all_tests(db):
    """全テストでDBアクセスを有効化"""
    pass
