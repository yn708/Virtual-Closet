# tests/conftest.py

import io
import shutil
import uuid

import pytest
from django.core.files.uploadedfile import SimpleUploadedFile
from PIL import Image
from rest_framework.test import APIClient

from apps.accounts.models import CustomUser
from apps.coordinate.models import CoordinateItem, CustomCoordinate, PhotoCoordinate, Scene, Taste
from apps.fashion_items.models import Brand, Category, Color, Design, FashionItem, PriceRange, Season, SubCategory


def generate_unique_id():
    """
    テスト用のユニークなIDを生成する

    Returns:
        str: 8文字のユニークな16進数文字列
    """
    return uuid.uuid4().hex[:8]


@pytest.fixture(autouse=True)
def media_storage(settings, tmp_path):
    """
    テスト用のメディアルートを一時ディレクトリに設定し、
    テスト終了後にクリーンアップを行う
    """
    settings.MEDIA_ROOT = tmp_path / "media"
    settings.MEDIA_URL = "/media/"
    settings.MEDIA_ROOT.mkdir()

    yield

    shutil.rmtree(settings.MEDIA_ROOT, ignore_errors=True)


@pytest.fixture
def test_image(media_storage):
    """
    テスト用の実際の画像ファイルを生成

    Returns:
        SimpleUploadedFile: テスト用画像ファイル
    """
    file = io.BytesIO()
    image = Image.new("RGB", (100, 100), "white")
    image.save(file, "jpeg")
    file.name = "test.jpg"
    file.seek(0)
    return SimpleUploadedFile(name=file.name, content=file.read(), content_type="image/jpeg")


@pytest.fixture
def sample_image(media_storage):
    """
    シンプルなテスト用画像ファイルを生成

    Returns:
        SimpleUploadedFile: テスト用のダミー画像ファイル
    """
    return SimpleUploadedFile(name="test_image.jpg", content=b"file_content", content_type="image/jpeg")


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
def scene():
    """テスト用シーンを作成"""
    unique_id = generate_unique_id()
    return Scene.objects.create(scene=f"休日_{unique_id}")


@pytest.fixture
def taste():
    """テスト用テイストを作成"""
    unique_id = generate_unique_id()
    return Taste.objects.create(taste=f"古着コーデ_{unique_id}")


@pytest.fixture
def season():
    """テスト用シーズンを作成"""
    unique_id = generate_unique_id()
    return Season.objects.create(id=f"spring_{unique_id}", season_name=f"春_{unique_id}")


@pytest.fixture
def photo_coordinate(user, season, scene, taste, sample_image):
    """テスト用写真コーディネートを作成"""
    coord = PhotoCoordinate.objects.create(user=user, image=sample_image)
    coord.seasons.add(season)
    coord.scenes.add(scene)
    coord.tastes.add(taste)
    return coord


@pytest.fixture
def custom_coordinate(user, season, scene, taste, sample_image):
    """テスト用カスタムコーディネートを作成"""
    coord = CustomCoordinate.objects.create(user=user, preview_image=sample_image)
    coord.seasons.add(season)
    coord.scenes.add(scene)
    coord.tastes.add(taste)
    return coord


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
def coordinate_item(custom_coordinate, fashion_item):
    """テスト用コーディネートアイテムを作成"""
    return CoordinateItem.objects.create(
        coordinate=custom_coordinate,
        item=fashion_item,
        position_data={"x": 100, "y": 100, "scale": 1.0, "rotate": 0, "zIndex": 1},
    )


@pytest.fixture
def api_client():
    """未認証APIクライント"""
    return APIClient()


@pytest.fixture
def auth_client(api_client, user):
    """認証済みAPIクライアント"""
    api_client.force_authenticate(user=user)
    return api_client


@pytest.fixture
def category():
    """テスト用カテゴリーを作成"""
    return Category.objects.create(id="test_category", category_name="Test Category")


@pytest.fixture
def subcategory(category):
    """テスト用サブカテゴリーを作成"""
    return SubCategory.objects.create(id="test_subcategory", subcategory_name="Test SubCategory", category=category)


@pytest.fixture
def brand():
    """テスト用ブランドを作成"""
    return Brand.objects.create(brand_name="Test Brand", brand_name_kana="テストブランド")


@pytest.fixture
def design():
    """テスト用デザインを作成"""
    return Design.objects.create(id="test_design", design_pattern="Test Design")


@pytest.fixture
def color():
    """テスト用カラーを作成"""
    return Color.objects.create(id="test_color", color_name="Test Color", color_code="#000000")


@pytest.fixture
def price_range():
    """テスト用価格帯を作成"""
    return PriceRange.objects.create(id="test_price_range", price_range="¥1,000〜¥2,000")


@pytest.fixture
def fashion_items(auth_client, subcategory, brand, season, design, color, price_range, sample_image):
    """テスト用ファッションアイテムを2つ作成"""
    items = []
    # auth_clientのユーザーを使用
    user = auth_client.handler._force_user

    # 1つ目のアイテム
    item1 = FashionItem.objects.create(
        user=user,
        sub_category=subcategory,
        brand=brand,
        price_range=price_range,
        design=design,
        main_color=color,
        image=sample_image,
        is_owned=True,
    )
    item1.seasons.add(season)
    items.append(item1)

    # 2つ目のアイテム
    item2 = FashionItem.objects.create(
        user=user,
        sub_category=subcategory,
        brand=brand,
        price_range=price_range,
        design=design,
        main_color=color,
        image=sample_image,
        is_owned=True,
    )
    item2.seasons.add(season)
    items.append(item2)

    return items
