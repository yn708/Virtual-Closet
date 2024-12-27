import pytest
from django.urls import reverse
from rest_framework import status

from apps.fashion_items.models import Brand, FashionItem


@pytest.mark.django_db
class TestMetaDataView:
    """MetaDataViewのテストクラス"""

    def test_unauthenticated_access(self, api_client):
        """未認証アクセスのテスト"""
        url = reverse("fashion_item_metadata")
        response = api_client.get(url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_get_metadata(self, auth_client, category, season, design, color, price_range, brand):
        """メタデータ取得のテスト"""
        Brand.objects.create(brand_name="Popular Brand", brand_name_kana="ポピュラーブランド", is_popular=True)

        url = reverse("fashion_item_metadata")
        response = auth_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert "categories" in response.data
        assert "seasons" in response.data
        assert "designs" in response.data
        assert "colors" in response.data
        assert "price_ranges" in response.data
        assert "popular_brands" in response.data
        assert all(brand["is_popular"] for brand in response.data["popular_brands"])


@pytest.mark.django_db
class TestBrandSearchView:
    """BrandSearchViewのテストクラス"""

    def test_unauthenticated_access(self, api_client):
        """未認証アクセスのテスト"""
        url = reverse("brand_search")
        response = api_client.get(url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_search_by_name(self, auth_client, brand):
        """ブランド名での検索テスト"""
        url = f"{reverse('brand_search')}?query={brand.brand_name[:3]}"
        response = auth_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) >= 1
        assert any(b["brand_name"] == brand.brand_name for b in response.data)

    def test_search_by_kana(self, auth_client, brand):
        """カナ名での検索テスト"""
        url = f"{reverse('brand_search')}?query={brand.brand_name_kana[:3]}"
        response = auth_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) >= 1
        assert any(b["brand_name"] == brand.brand_name for b in response.data)

    def test_search_limit(self, auth_client):
        """検索結果の上限テスト"""
        # 25件のブランドを作成
        for i in range(25):
            Brand.objects.create(brand_name=f"Test Brand {i}", brand_name_kana=f"テストブランド {i}")

        url = f"{reverse('brand_search')}?query=Test"
        response = auth_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) <= 20


@pytest.mark.django_db
class TestFashionItemViewSet:
    """FashionItemViewSetのテストクラス"""

    def test_unauthenticated_access(self, api_client):
        """未認証アクセスのテスト"""
        url = reverse("fashionitem-list")
        response = api_client.get(url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_create_fashion_item(self, auth_client, subcategory, brand, season, design, color, price_range, test_image):
        """アイテム作成のテスト"""
        data = {
            "sub_category": subcategory.id,
            "brand": brand.id,
            "seasons": [season.id],
            "design": design.id,
            "main_color": color.id,
            "price_range": price_range.id,
            "image": test_image,
            "is_owned": True,
        }

        url = reverse("fashionitem-list")
        response = auth_client.post(url, data=data, format="multipart")

        assert response.status_code == status.HTTP_201_CREATED
        assert FashionItem.objects.filter(sub_category=subcategory).exists()

    def test_get_item_list(self, auth_client, fashion_item):
        """アイテム一覧取得テスト"""
        url = reverse("fashionitem-list")
        response = auth_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) >= 1

    def test_get_by_category(self, auth_client, fashion_item, category):
        """カテゴリー別アイテム取得テスト"""
        url = reverse("fashionitem-by-category")
        response = auth_client.get(f"{url}?category_id={category.id}")

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) >= 1

    def test_get_recent_items(self, auth_client, fashion_item):
        """最近のアイテム取得テスト"""
        url = reverse("fashionitem-by-category")
        response = auth_client.get(f"{url}?category_id=recent")

        assert response.status_code == status.HTTP_200_OK

    def test_update_fashion_item(self, auth_client, fashion_item, season, test_image):
        """アイテム更新テスト"""
        url = reverse("fashionitem-detail", args=[fashion_item.id])

        update_data = {"is_owned": False, "is_old_clothes": True, "seasons": [season.id], "image": test_image}

        response = auth_client.patch(url, data=update_data, format="multipart")
        assert response.status_code == status.HTTP_200_OK

        # 更新されたアイテムを取得して検証
        fashion_item.refresh_from_db()
        assert not fashion_item.is_owned
        assert fashion_item.is_old_clothes
        assert list(fashion_item.seasons.values_list("id", flat=True)) == [season.id]

    def test_delete_fashion_item(self, auth_client, fashion_item):
        """アイテム削除テスト"""
        url = reverse("fashionitem-detail", args=[fashion_item.id])
        response = auth_client.delete(url)
        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not FashionItem.objects.filter(id=fashion_item.id).exists()

    def test_clear_seasons(self, auth_client, fashion_item):
        """シーズンクリアテスト"""
        assert fashion_item.seasons.exists()

        url = reverse("fashionitem-detail", args=[fashion_item.id])
        response = auth_client.patch(url, data={"seasons": []}, format="multipart")

        assert response.status_code == status.HTTP_200_OK
        fashion_item.refresh_from_db()
        assert not fashion_item.seasons.exists()
