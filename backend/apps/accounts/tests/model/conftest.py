import shutil
from datetime import date
from pathlib import Path

import pytest
from django.conf import settings
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import override_settings

# テスト用のメディアディレクトリを設定
TEST_MEDIA_ROOT = Path(settings.MEDIA_ROOT) / "test_media"


@pytest.fixture(autouse=True)
def media_storage():
    """テスト用のメディアストレージを設定し、テスト後にクリーンアップを行うフィクスチャ"""
    # テスト用のメディアディレクトリを作成
    TEST_MEDIA_ROOT.mkdir(parents=True, exist_ok=True)

    # テスト用のメディア設定を適用
    with override_settings(MEDIA_ROOT=TEST_MEDIA_ROOT):
        yield

    # テスト終了後にテスト用メディアディレクトリを削除
    if TEST_MEDIA_ROOT.exists():
        shutil.rmtree(TEST_MEDIA_ROOT)


@pytest.fixture
def valid_user_data():
    """ユーザーデータフィクスチャ"""
    return {
        "email": "test@example.com",
        "username": "testuser",
        "password": "TESTpass123",
        "name": "Test User",
        "birth_date": date(1990, 1, 1),
        "height": 170,
    }


@pytest.fixture
def test_image():
    """テスト用画像ファイル"""
    content = (
        b"GIF87a\x01\x00\x01\x00\x80\x01\x00\x00\x00\x00ccc,\x00" b"\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02D\x01\x00;"
    )
    return SimpleUploadedFile("test.gif", content, content_type="image/gif")
