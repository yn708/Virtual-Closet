"""共通のフィクスチャ定義"""

import pytest


@pytest.fixture
def user_data():
    """基本的なユーザーデータ"""
    return {
        "email": "test@example.com",
        "username": "testuser",
        "password": "TESTpass123",
    }


@pytest.fixture
def registration_data(user_data):
    """登録用データ"""
    return {
        **user_data,
        "password1": user_data["password"],
        "password2": user_data["password"],
    }


@pytest.fixture
def verification_data():
    """確認コード検証用データ"""
    return {"email": "test@example.com", "confirmation_code": "123456"}
