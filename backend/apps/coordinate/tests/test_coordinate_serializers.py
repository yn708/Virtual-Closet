import pytest
from django.core.files.uploadedfile import SimpleUploadedFile

from apps.accounts.constants import MAX_IMAGE_SIZE
from apps.coordinate.serializers import (
    CustomCoordinateSerializer,
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
            "image": test_image,
            "seasons": [season.id],
            "scenes": [scene.id],
            "tastes": [taste.id],
        }

    def test_valid_serializer(self, valid_data):
        """正常系: 有効なデータでのシリアライズテスト"""
        serializer = PhotoCoordinateSerializer(data=valid_data)
        assert serializer.is_valid(), serializer.errors

    def test_image_size_validation(self, valid_data):
        """異常系: 画像サイズ制限のテスト"""
        # MAX_IMAGE_SIZEより大きいサイズのダミーデータを作成
        large_image = SimpleUploadedFile(
            name="large.jpg", content=b"0" * (MAX_IMAGE_SIZE + 1), content_type="image/jpeg"
        )
        valid_data["image"] = large_image

        serializer = PhotoCoordinateSerializer(data=valid_data)
        assert not serializer.is_valid()
        assert "image" in serializer.errors

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

    def test_empty_list_handling(self, valid_data):
        """正常系: 空リストの処理テスト"""
        valid_data["seasons"] = []
        valid_data["scenes"] = "[]"  # 文字列として送信
        valid_data["tastes"] = ""  # 空文字として送信

        serializer = PhotoCoordinateSerializer(data=valid_data)
        assert serializer.is_valid(), serializer.errors

        processed_data = serializer.validated_data
        assert processed_data["seasons"] == []
        assert processed_data["scenes"] == []
        assert processed_data["tastes"] == []

    def test_update_coordinate(self, photo_coordinate, season, scene, taste, test_image):
        """正常系: コーディネート更新のテスト"""
        # test_imageフィクスチャを再利用
        update_data = {"image": test_image, "seasons": [season.id], "scenes": [scene.id], "tastes": [taste.id]}

        serializer = PhotoCoordinateSerializer(photo_coordinate, data=update_data, partial=True)
        assert serializer.is_valid(), serializer.errors

        updated_coordinate = serializer.save()
        assert updated_coordinate.seasons.count() == 1
        assert updated_coordinate.scenes.count() == 1
        assert updated_coordinate.tastes.count() == 1


@pytest.mark.django_db
class TestCustomCoordinateSerializer:
    @pytest.fixture
    def valid_coordinate_item_data(self, user):
        """有効なコーディネートアイテムデータを作成"""
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
            "image": test_image,
            "background": "bg-gray-100",
            "seasons": [season.id],
            "scenes": [scene.id],
            "tastes": [taste.id],
        }

    def test_valid_serializer(self, valid_data, user):
        """正常系: 有効なデータでのシリアライズテスト"""
        context = {"request": type("Request", (), {"user": user})}
        serializer = CustomCoordinateSerializer(data=valid_data, context=context)

        assert serializer.is_valid(), serializer.errors
        instance = serializer.save()

        assert instance.user == user
        assert instance.image is not None
        assert instance.background == "bg-gray-100"
        assert instance.coordinate_item_set.count() == 2

    def test_image_size_validation(self, valid_data):
        """異常系: 画像サイズ制限のテスト"""
        valid_data["image"] = SimpleUploadedFile(
            name="large.jpg", content=b"0" * (MAX_IMAGE_SIZE + 1), content_type="image/jpeg"
        )

        serializer = CustomCoordinateSerializer(data=valid_data)
        assert not serializer.is_valid()
        assert "image" in serializer.errors

    def test_items_length_validation(self, valid_data):
        """異常系: アイテム数制限のテスト"""
        # 1つのアイテムだけを設定
        valid_data["items"] = valid_data["items"][:1]
        serializer = CustomCoordinateSerializer(data=valid_data)
        assert not serializer.is_valid()
        assert "items" in serializer.errors

        # 21個のアイテムを設定
        valid_data["items"] = valid_data["items"] * 21
        serializer = CustomCoordinateSerializer(data=valid_data)
        assert not serializer.is_valid()
        assert "items" in serializer.errors

    def test_empty_list_handling(self, valid_data):
        """正常系: 空リストの処理テスト"""
        valid_data["seasons"] = []
        valid_data["scenes"] = "[]"
        valid_data["tastes"] = ""

        serializer = CustomCoordinateSerializer(data=valid_data)
        assert serializer.is_valid(), serializer.errors

        processed_data = serializer.validated_data
        assert processed_data["seasons"] == []
        assert processed_data["scenes"] == []
        assert processed_data["tastes"] == []

    def test_update_coordinate(self, custom_coordinate, valid_coordinate_item_data, test_image, user):
        """正常系: コーディネート更新のテスト"""
        # 2つ目の新しいファッションアイテムを作成
        second_fashion_item = FashionItem.objects.create(
            user=user,
            sub_category=SubCategory.objects.get(id="test_sub"),
            image=SimpleUploadedFile(name="test2.jpg", content=b"file_content", content_type="image/jpeg"),
        )

        update_data = {
            "image": test_image,  # test_imageフィクスチャを使用
            "background": "bg-blue-100",
            "items": [
                valid_coordinate_item_data,
                {
                    "item": second_fashion_item.id,
                    "position_data": {"x": 200, "y": 200, "scale": 1.0, "rotate": 0, "zIndex": 2},
                },
            ],  # 2つのアイテムを指定
        }

        serializer = CustomCoordinateSerializer(custom_coordinate, data=update_data, partial=True)
        assert serializer.is_valid(), serializer.errors

        updated_coordinate = serializer.save()
        assert updated_coordinate.background == "bg-blue-100"
        assert updated_coordinate.coordinate_item_set.count() == 2  # 2つのアイテムが存在することを確認
        assert updated_coordinate.image is not None


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
