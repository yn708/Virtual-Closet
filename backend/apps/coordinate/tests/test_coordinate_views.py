import json

import pytest
from django.urls import reverse
from rest_framework import status


@pytest.mark.django_db
class TestMetaDataView:
    """MetaDataViewのテストクラス"""

    def test_unauthenticated_access(self, api_client):
        """未認証アクセスのテスト"""
        url = reverse("coordinate_metadata")
        response = api_client.get(url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_get_metadata(self, auth_client, season, scene, taste):
        """メタデータ取得のテスト"""

        url = reverse("coordinate_metadata")
        response = auth_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert "seasons" in response.data
        assert "scenes" in response.data
        assert "tastes" in response.data


@pytest.mark.django_db
class TestPhotoCoordinateViewSet:
    """PhotoCoordinateViewSetのテストクラス"""

    def test_unauthenticated_access(self, api_client):
        """未認証アクセスのテスト"""
        url = reverse("photo-coordination-list")
        response = api_client.get(url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_create_coordinate_item(self, auth_client, season, scene, taste, test_image):
        """作成のテスト"""
        data = {
            "seasons": [season.id],
            "scenes": [scene.id],
            "tastes": [taste.id],
            "image": test_image,
        }

        url = reverse("photo-coordination-list")
        response = auth_client.post(url, data=data, format="multipart")

        assert response.status_code == status.HTTP_201_CREATED


@pytest.mark.django_db
class TestCustomCoordinateViewSet:
    """CustomCoordinateViewSetのテストクラス"""

    def test_unauthenticated_access(self, api_client):
        """未認証アクセスのテスト"""
        url = reverse("custom-coordination-list")
        response = api_client.get(url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_create_coordinate_item(
        self,
        auth_client,
        season,
        scene,
        taste,
        test_image,
        fashion_items,
    ):
        """作成のテスト"""
        items_data = [
            {"item": fashion_items[0].id, "position_data": {"x": 100, "y": 100, "scale": 1, "rotate": 0, "zIndex": 1}},
            {"item": fashion_items[1].id, "position_data": {"x": 200, "y": 200, "scale": 1, "rotate": 0, "zIndex": 2}},
        ]

        data = {
            "seasons": [season.id],
            "scenes": [scene.id],
            "tastes": [taste.id],
            "preview_image": test_image,
            "items": json.dumps(items_data),
        }

        url = reverse("custom-coordination-list")
        response = auth_client.post(url, data=data, format="multipart")

        assert response.status_code == status.HTTP_201_CREATED
        assert "items" in response.data
        assert len(response.data["items"]) == 2
