from datetime import date

import pytest
from django.core.files.uploadedfile import SimpleUploadedFile


@pytest.fixture
def valid_user_data():
    """ユーザーデータフィクスチャ"""
    return {
        "email": "test@example.com",
        "username": "testuser",
        "password": "TESTpass123",
        "name": "Test User",
        "birth_date": date(1990, 1, 1),
        "gender": "male",
        "height": 170,
    }


@pytest.fixture
def test_image():
    """テスト用画像ファイル"""
    content = (
        b"GIF87a\x01\x00\x01\x00\x80\x01\x00\x00\x00\x00ccc,\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02D\x01\x00;"
    )
    return SimpleUploadedFile("test.gif", content, content_type="image/gif")
