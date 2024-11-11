import shutil
from datetime import date
from pathlib import Path

import pytest
from django.conf import settings
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import override_settings

from apps.accounts.constants import MAX_IMAGE_SIZE

# テスト用のメディアディレクトリを設定
TEST_MEDIA_ROOT = Path(settings.MEDIA_ROOT) / "test_media"


@pytest.fixture(autouse=True)
def media_storage():
    """
    テスト用のメディアストレージを設定し、テスト後にクリーンアップを行うフィクスチャ
    """
    # テスト用のメディアディレクトリを作成
    TEST_MEDIA_ROOT.mkdir(parents=True, exist_ok=True)

    # テスト用のメディア設定を適用
    with override_settings(MEDIA_ROOT=TEST_MEDIA_ROOT):
        yield

    # テスト終了後にテスト用メディアディレクトリを削除
    if TEST_MEDIA_ROOT.exists():
        shutil.rmtree(TEST_MEDIA_ROOT)


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


@pytest.fixture
def user(django_user_model):
    """ユーザーデータフィクスチャ"""
    return django_user_model.objects.create(
        email="test@example.com",
        username="testuser",
        password="TESTpass123",
        name="Test User",
        birth_date=date(1990, 1, 1),
        gender="unanswered",
        height=170,
    )


@pytest.fixture
def valid_image():
    """テスト用の有効な画像ファイル"""
    content = (
        b"GIF87a\x01\x00\x01\x00\x80\x01\x00\x00\x00\x00ccc,\x00" b"\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02D\x01\x00;"
    )
    return SimpleUploadedFile("test_image.jpg", content, content_type="image/jpeg")


@pytest.fixture
def large_image():
    """サイズ制限を超える画像ファイル"""
    return SimpleUploadedFile(name="large_image.jpg", content=b"x" * (MAX_IMAGE_SIZE + 1), content_type="image/jpeg")


@pytest.fixture
def user_with_image(user, valid_image, media_storage):
    """画像付きユーザーデータ"""
    user.profile_image = valid_image
    user.save()
    return user
