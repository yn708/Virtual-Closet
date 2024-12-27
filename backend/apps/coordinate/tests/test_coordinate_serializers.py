import pytest
from django.core.files.uploadedfile import SimpleUploadedFile

from apps.coordinate.serializers import (
    MetaDataSerializer,
    PhotoCoordinateSerializer,
    SceneSerializer,
    TasteSerializer,
)
from apps.fashion_items.models import Category, FashionItem, SubCategory


@pytest.mark.django_db
class TestSceneSerializer:
    """SceneSerializerのテストクラス"""

    def test_valid_serializer(self, scene):
        """正常系: シーンのシリアライズテスト"""
        serializer = SceneSerializer(scene)
        data = serializer.data
        assert data["scene"] == scene.scene


@pytest.mark.django_db
class TestTasteSerializer:
    """TasteSerializerのテストクラス"""

    def test_valid_serializer(self, taste):
        """正常系: テイストのシリアライズテスト"""
        serializer = TasteSerializer(taste)
        data = serializer.data
        assert data["taste"] == taste.taste


@pytest.mark.django_db
class TestPhotoCoordinateSerializer:
    """PhotoCoordinateSerializerのテストクラス"""

    @pytest.fixture
    def valid_data(self, season, scene, taste, test_image):
        """有効なデータを作成するフィクスチャ"""
        return {
            "image": SimpleUploadedFile(name=test_image.name, content=test_image.read(), content_type="image/jpeg"),
            "seasons": [season.id],
            "scenes": [scene.id],
            "tastes": [taste.id],
        }

    def test_valid_serializer(self, valid_data, user):
        """正常系: 有効なデータでのシリアライズテスト"""
        context = {"request": type("Request", (), {"user": user})}
        serializer = PhotoCoordinateSerializer(data=valid_data, context=context)

        assert serializer.is_valid(), serializer.errors
        instance = serializer.save()

        assert instance.user == user
        assert instance.image is not None
        assert list(instance.seasons.values_list("id", flat=True)) == valid_data["seasons"]
        assert list(instance.scenes.values_list("id", flat=True)) == valid_data["scenes"]
        assert list(instance.tastes.values_list("id", flat=True)) == valid_data["tastes"]

    def test_scenes_limit(self, valid_data, scene):
        """異常系: シーン数制限のテスト"""
        valid_data["scenes"] = [scene.id] * 4  # 4つのシーンを設定
        serializer = PhotoCoordinateSerializer(data=valid_data)

        assert not serializer.is_valid()
        assert "scenes" in serializer.errors

    def test_tastes_limit(self, valid_data, taste):
        """異常系: テイスト数制限のテスト"""
        valid_data["tastes"] = [taste.id] * 4  # 4つのテイストを設定
        serializer = PhotoCoordinateSerializer(data=valid_data)

        assert not serializer.is_valid()
        assert "tastes" in serializer.errors


@pytest.mark.django_db
class TestCustomCoordinateSerializer:
    @pytest.fixture
    def valid_coordinate_item_data(self, user):
        """有効なコーディネートアイテムデータを作成"""
        # ユーザー専用のファッションアイテムを作成
        fashion_item = FashionItem.objects.create(
            user=user,
            sub_category=SubCategory.objects.create(
                id="test_sub",
                subcategory_name="Test Sub",
                category=Category.objects.create(id="test_cat", category_name="Test Category"),
            ),
            image=SimpleUploadedFile(name="test.jpg", content=b"file_content", content_type="image/jpeg"),
        )

        return {"item": fashion_item.id, "position_data": {"x": 100, "y": 100, "scale": 1.0, "rotate": 0, "zIndex": 1}}

    @pytest.fixture
    def valid_data(self, valid_coordinate_item_data, season, scene, taste, test_image, user):
        """有効なカスタムコーディネートデータを作成"""
        # 2つ目のファッションアイテムを作成
        second_fashion_item = FashionItem.objects.create(
            user=user,
            sub_category=SubCategory.objects.get(id="test_sub"),
            image=SimpleUploadedFile(name="test2.jpg", content=b"file_content", content_type="image/jpeg"),
        )

        return {
            "items": [
                valid_coordinate_item_data,
                {
                    "item": second_fashion_item.id,
                    "position_data": {"x": 200, "y": 200, "scale": 1.0, "rotate": 0, "zIndex": 2},
                },
            ],
            "seasons": [season.id],
            "scenes": [scene.id],
            "tastes": [taste.id],
            "preview_image": SimpleUploadedFile(
                name=test_image.name, content=test_image.read(), content_type="image/jpeg"
            ),
        }


@pytest.mark.django_db
class TestCoordinateItemSerializer:
    @pytest.fixture
    def valid_data(self, user):
        """有効なデータを作成するフィクスチャ"""
        # テスト用のファッションアイテムを作成
        fashion_item = FashionItem.objects.create(
            user=user,
            sub_category=SubCategory.objects.create(
                id="test_sub_coord",
                subcategory_name="Test Sub",
                category=Category.objects.create(id="test_cat_coord", category_name="Test Category"),
            ),
            image=SimpleUploadedFile(name="test.jpg", content=b"file_content", content_type="image/jpeg"),
        )

        return {"item": fashion_item.id, "position_data": {"x": 100, "y": 100, "scale": 1.0, "rotate": 0, "zIndex": 1}}


@pytest.mark.django_db
class TestMetaDataSerializer:
    """MetaDataSerializerのテストクラス"""

    def test_metadata_serialization(self, season, scene, taste):
        """正常系: メタデータのシリアライズテスト"""
        data = {"seasons": [season], "scenes": [scene], "tastes": [taste]}
        serializer = MetaDataSerializer(data)

        serialized_data = serializer.data
        assert len(serialized_data["seasons"]) == 1
        assert len(serialized_data["scenes"]) == 1
        assert len(serialized_data["tastes"]) == 1
