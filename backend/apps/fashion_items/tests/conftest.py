import io
import shutil
import uuid

import pytest
from django.core.files.uploadedfile import SimpleUploadedFile
from PIL import Image
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from apps.accounts.models import CustomUser
from apps.fashion_items.models import Brand, Category, Color, Design, FashionItem, PriceRange, Season, SubCategory


@pytest.fixture(autouse=True)
def media_storage(settings, tmp_path):
    """
    テスト用のメディアルートを一時ディレクトリに設定し、
    テスト終了後にクリーンアップを行う
    """
    settings.MEDIA_ROOT = tmp_path / "media"
    settings.MEDIA_URL = "/media/"
    settings.MEDIA_ROOT.mkdir()

    yield  # テストを実行

    # テスト終了後にメディアディレクトリを削除
    shutil.rmtree(settings.MEDIA_ROOT, ignore_errors=True)


def generate_unique_id():
    """ユニークなIDを生成"""
    return uuid.uuid4().hex[:8]


@pytest.fixture
def user():
    """テスト用ユーザーを作成"""
    unique_id = generate_unique_id()
    return CustomUser.objects.create_user(
        email=f"test_{unique_id}@example.com",
        password="testpass123",
        username=f"testuser_{unique_id}",
        is_active=True,
    )


@pytest.fixture
def category():
    """テスト用カテゴリーを作成"""
    unique_id = generate_unique_id()
    return Category.objects.create(id=f"tops_{unique_id}", category_name=f"トップス_{unique_id}")


@pytest.fixture
def subcategory(category):
    """テスト用サブカテゴリーを作成"""
    unique_id = generate_unique_id()
    return SubCategory.objects.create(
        id=f"tshirt_{unique_id}", subcategory_name=f"Tシャツ_{unique_id}", category=category
    )


@pytest.fixture
def brand():
    """テスト用ブランドを作成"""
    unique_id = generate_unique_id()
    return Brand.objects.create(
        brand_name=f"テストブランド_{unique_id}", brand_name_kana=f"テストブランド_{unique_id}", is_popular=True
    )


@pytest.fixture
def season():
    """テスト用シーズンを作成"""
    unique_id = generate_unique_id()
    return Season.objects.create(id=f"spring_{unique_id}", season_name=f"春_{unique_id}")


@pytest.fixture
def design():
    """テスト用デザインを作成"""
    unique_id = generate_unique_id()
    return Design.objects.create(id=f"solid_{unique_id}", design_pattern=f"無地_{unique_id}")


@pytest.fixture
def color():
    """テスト用カラーを作成"""
    unique_id = generate_unique_id()
    return Color.objects.create(id=f"white_{unique_id}", color_name=f"白_{unique_id}", color_code="#FFFFFF")


@pytest.fixture
def price_range():
    """テスト用価格帯を作成"""
    unique_id = generate_unique_id()
    return PriceRange.objects.create(id=f"price_{unique_id}", price_range=f"¥1,000〜¥1,999_{unique_id}")


@pytest.fixture
def fashion_item(user, subcategory, brand, season, design, color, price_range, sample_image):
    """テスト用ファッションアイテムを作成"""
    item = FashionItem.objects.create(
        user=user,
        sub_category=subcategory,
        brand=brand,
        price_range=price_range,
        design=design,
        main_color=color,
        image=sample_image,
        is_owned=True,
    )
    item.seasons.add(season)
    return item


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


@pytest.fixture
def test_image(media_storage):
    """
    PIL を使用して実際の画像ファイルを作成
    """
    file = io.BytesIO()
    image = Image.new("RGB", (100, 100), "white")
    image.save(file, "jpeg")
    file.name = "test.jpg"
    file.seek(0)
    return SimpleUploadedFile(name=file.name, content=file.read(), content_type="image/jpeg")


@pytest.fixture
def sample_image(media_storage):
    """テスト用画像を作成"""
    return SimpleUploadedFile(name="test_image.jpg", content=b"file_content", content_type="image/jpeg")
