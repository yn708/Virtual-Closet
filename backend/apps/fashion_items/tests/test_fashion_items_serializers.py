import pytest
from django.core.files.uploadedfile import SimpleUploadedFile
from django.http import QueryDict

from apps.fashion_items.serializers import FashionItemSerializer


@pytest.mark.django_db
class TestFashionItemSerializer:
    """FashionItemSerializerのテストクラス"""

    @pytest.fixture
    def valid_data(self, subcategory, brand, season, design, color, price_range, test_image):
        """有効なデータを作成するフィクスチャ"""
        return {
            "image": SimpleUploadedFile(name=test_image.name, content=test_image.read(), content_type="image/jpeg"),
            "sub_category": subcategory.id,
            "brand": brand.id,
            "seasons": [season.id],
            "price_range": price_range.id,
            "design": design.id,
            "main_color": color.id,
            "is_owned": True,
            "is_old_clothes": False,
        }

    def test_valid_serializer(self, valid_data, user):
        """正常系: 有効なデータでのシリアライズテスト"""
        serializer = FashionItemSerializer(data=valid_data)
        assert serializer.is_valid(), serializer.errors

        instance = serializer.save(user=user)

        assert instance.sub_category.id == valid_data["sub_category"]
        assert instance.brand.id == valid_data["brand"]
        assert list(instance.seasons.values_list("id", flat=True)) == valid_data["seasons"]
        assert instance.is_owned == valid_data["is_owned"]

    def test_minimal_valid_data(self, subcategory, test_image, user):
        """正常系: 必須フィールドのみでのシリアライズテスト"""
        data = {
            "image": SimpleUploadedFile(name=test_image.name, content=test_image.read(), content_type="image/jpeg"),
            "sub_category": subcategory.id,
        }

        serializer = FashionItemSerializer(data=data)
        assert serializer.is_valid(), serializer.errors

        instance = serializer.save(user=user)
        assert instance.sub_category.id == subcategory.id
        assert instance.brand is None
        assert instance.seasons.count() == 0

    def test_empty_seasons(self, subcategory, test_image, user):
        """正常系: 空のシーズンリストでのテスト"""
        # QueryDictを使用してテスト
        query_dict = QueryDict("", mutable=True)
        query_dict.update(
            {
                "image": SimpleUploadedFile(name=test_image.name, content=test_image.read(), content_type="image/jpeg"),
                "sub_category": subcategory.id,
            }
        )
        query_dict.setlist("seasons", [])

        serializer = FashionItemSerializer(data=query_dict)
        assert serializer.is_valid(), serializer.errors

        instance = serializer.save(user=user)
        assert instance.seasons.count() == 0

    def test_update_fashion_item(self, fashion_item, season):
        """正常系: アイテム更新のテスト"""
        update_data = {"is_owned": False, "is_old_clothes": True, "seasons": [season.id]}

        serializer = FashionItemSerializer(instance=fashion_item, data=update_data, partial=True)
        assert serializer.is_valid(), serializer.errors

        updated_instance = serializer.save()
        assert not updated_instance.is_owned
        assert updated_instance.is_old_clothes
        assert list(updated_instance.seasons.values_list("id", flat=True)) == [season.id]

    def test_update_fashion_item_with_image(self, fashion_item, test_image, media_storage):
        """画像更新を含むアイテム更新のテスト"""
        update_data = {"is_owned": False, "image": test_image}

        serializer = FashionItemSerializer(instance=fashion_item, data=update_data, partial=True)
        assert serializer.is_valid(), serializer.errors

        updated_instance = serializer.save()
        assert updated_instance.image is not None

    def test_missing_required_field(self, valid_data):
        """異常系: 必須フィールド欠如のテスト"""
        del valid_data["sub_category"]

        serializer = FashionItemSerializer(data=valid_data)
        assert not serializer.is_valid()
        assert "sub_category" in serializer.errors

    def test_clear_seasons(self, fashion_item):
        """正常系: シーズンをクリアするテスト"""
        assert fashion_item.seasons.exists()

        update_data = {"seasons": []}

        serializer = FashionItemSerializer(instance=fashion_item, data=update_data, partial=True)
        assert serializer.is_valid(), serializer.errors

        updated_instance = serializer.save()
        assert not updated_instance.seasons.exists()
