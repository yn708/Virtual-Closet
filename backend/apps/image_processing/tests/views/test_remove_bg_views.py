import io
import shutil

import pytest
from django.core.files.uploadedfile import SimpleUploadedFile
from PIL import Image
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from apps.accounts.models import CustomUser


@pytest.fixture(autouse=True)
def media_storage(settings, tmp_path):
    """テスト用のメディアストレージをセットアップ"""
    settings.MEDIA_ROOT = tmp_path / "media"
    settings.MEDIA_URL = "/media/"
    settings.MEDIA_ROOT.mkdir()

    yield

    shutil.rmtree(settings.MEDIA_ROOT, ignore_errors=True)


@pytest.fixture
def user():
    """テストユーザーを作成"""
    return CustomUser.objects.create_user(
        email="test@example.com",
        password="testpass123",
        username="testuser",
        is_active=True,
    )


@pytest.fixture
def test_image(media_storage):
    """テスト用の画像を作成"""
    file = io.BytesIO()
    image = Image.new("RGB", (100, 100), "white")
    image.save(file, "jpeg")
    file.name = "test.jpg"
    file.seek(0)
    return SimpleUploadedFile(name=file.name, content=file.read(), content_type="image/jpeg")


@pytest.fixture
def api_client():
    """未認証APIクライアント"""
    return APIClient()


@pytest.fixture
def auth_token(user):
    """JWT認証トークンを生成"""
    refresh = RefreshToken.for_user(user)
    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }


@pytest.fixture
def auth_client(api_client, auth_token):
    """認証済みAPIクライアント"""
    api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {auth_token["access"]}')
    return api_client


@pytest.mark.django_db
def test_remove_bg_authentication(api_client):
    """未認証アクセスのテスト"""
    response = api_client.post("/api/image/remove-bg/")
    assert response.status_code == 401


@pytest.mark.django_db
def test_remove_bg_success(auth_client, test_image):
    """正常系のテスト"""
    response = auth_client.post("/api/image/remove-bg/", {"image": test_image}, format="multipart")

    assert response.status_code == 200
    assert response.json()["status"] == "success"
    assert "image" in response.json()
    assert "process_time" in response.json()


@pytest.mark.django_db
def test_remove_bg_no_image(auth_client):
    """画像なしでのリクエストテスト"""
    response = auth_client.post("/api/image/remove-bg/")
    assert response.status_code == 400
    assert response.json()["status"] == "error"


@pytest.mark.django_db
def test_remove_bg_invalid_image(auth_client):
    """無効な画像データでのテスト"""
    invalid_file = SimpleUploadedFile("test.png", b"invalid image content", content_type="image/png")

    response = auth_client.post("/api/image/remove-bg/", {"image": invalid_file}, format="multipart")

    assert response.status_code == 400
    assert response.json()["status"] == "error"
