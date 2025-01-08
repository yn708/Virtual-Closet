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

    def test_list_coordinates(self, auth_client, photo_coordinate):
        """一覧取得のテスト"""
        url = reverse("photo-coordination-list")
        response = auth_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) >= 1

    def test_retrieve_coordinate(self, auth_client, photo_coordinate):
        """個別取得のテスト"""
        url = reverse("photo-coordination-detail", kwargs={"pk": photo_coordinate.id})
        response = auth_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data["id"] == photo_coordinate.id

    def test_update_coordinate(self, auth_client, photo_coordinate, season, scene, taste, test_image):
        """更新のテスト"""
        url = reverse("photo-coordination-detail", kwargs={"pk": photo_coordinate.id})
        data = {"image": test_image, "seasons": [season.id], "scenes": [scene.id], "tastes": [taste.id]}

        response = auth_client.put(url, data=data, format="multipart")
        assert response.status_code == status.HTTP_200_OK

    def test_delete_coordinate(self, auth_client, photo_coordinate):
        """削除のテスト"""
        url = reverse("photo-coordination-detail", kwargs={"pk": photo_coordinate.id})
        response = auth_client.delete(url)

        assert response.status_code == status.HTTP_204_NO_CONTENT


@pytest.mark.django_db
class TestCustomCoordinateViewSet:
    """CustomCoordinateViewSetのテストクラス"""

    def test_list_coordinates(self, auth_client, custom_coordinate):
        """一覧取得のテスト"""
        url = reverse("custom-coordination-list")
        response = auth_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) >= 1

    def test_retrieve_coordinate(self, auth_client, custom_coordinate):
        """個別取得のテスト"""
        url = reverse("custom-coordination-detail", kwargs={"pk": custom_coordinate.id})
        response = auth_client.get(url)

        assert response.status_code == status.HTTP_200_OK

    def test_update_coordinate(self, auth_client, custom_coordinate, season, scene, taste, test_image, fashion_items):
        """更新のテスト"""
        items_data = [
            {"item": fashion_items[0].id, "position_data": {"x": 100, "y": 100, "scale": 1, "rotate": 0, "zIndex": 1}},
            {"item": fashion_items[1].id, "position_data": {"x": 200, "y": 200, "scale": 1, "rotate": 0, "zIndex": 2}},
        ]

        url = reverse("custom-coordination-detail", kwargs={"pk": custom_coordinate.id})
        data = {
            "image": test_image,
            "items": json.dumps(items_data),
            "background": "bg-gray-100",
            "seasons": [season.id],
            "scenes": [scene.id],
            "tastes": [taste.id],
        }

        response = auth_client.put(url, data=data, format="multipart")
        assert response.status_code == status.HTTP_200_OK

    def test_delete_coordinate(self, auth_client, custom_coordinate):
        """削除のテスト"""
        url = reverse("custom-coordination-detail", kwargs={"pk": custom_coordinate.id})
        response = auth_client.delete(url)

        assert response.status_code == status.HTTP_204_NO_CONTENT
