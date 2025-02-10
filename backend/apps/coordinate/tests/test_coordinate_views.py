import json

import pytest
from django.test.utils import override_settings
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIRequestFactory, force_authenticate

from apps.coordinate.models import CustomCoordinate, PhotoCoordinate
from apps.coordinate.views import CoordinateCountView


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

    @override_settings(DEBUG=True)
    def test_create_coordinate(self, auth_client, season, scene, taste, fashion_items):
        """作成のテスト（最低2つのアイテムを含む）"""
        # fashion_items は conftest.py で2つ作成されている前提
        url = reverse("custom-coordination-list")
        items_data = [
            {
                "item": fashion_items[0].id,
                "position_data": {"xPercent": 50, "yPercent": 50, "scale": 1, "rotate": 0, "zIndex": 1},
            },
            {
                "item": fashion_items[1].id,
                "position_data": {"xPercent": 60, "yPercent": 60, "scale": 1, "rotate": 0, "zIndex": 2},
            },
        ]
        data = {
            "data": {"items": items_data, "background": "bg-white"},
            "seasons": [season.id],
            "scenes": [scene.id],
            "tastes": [taste.id],
        }
        response = auth_client.post(url, json.dumps(data), content_type="application/json")
        assert response.status_code == status.HTTP_201_CREATED

    @override_settings(DEBUG=True)
    def test_update_coordinate(self, auth_client, custom_coordinate, season, scene, taste, fashion_items):
        """更新のテスト（最低2つのアイテムを含む）"""
        url = reverse("custom-coordination-detail", kwargs={"pk": custom_coordinate.id})
        items_data = [
            {
                "item": fashion_items[0].id,
                "position_data": {"xPercent": 50, "yPercent": 50, "scale": 1, "rotate": 0, "zIndex": 1},
            },
            {
                "item": fashion_items[1].id,
                "position_data": {"xPercent": 60, "yPercent": 60, "scale": 1, "rotate": 0, "zIndex": 2},
            },
        ]
        data = {
            "data": {"items": items_data, "background": "bg-gray-100"},  # ネストされた辞書をそのまま
            "seasons": [season.id],
            "scenes": [scene.id],
            "tastes": [taste.id],
        }
        # format を "json" に変更
        response = auth_client.patch(url, data, format="json")
        assert response.status_code == status.HTTP_200_OK

    def test_delete_coordinate(self, auth_client, custom_coordinate):
        """削除のテスト"""
        url = reverse("custom-coordination-detail", kwargs={"pk": custom_coordinate.id})
        response = auth_client.delete(url)
        assert response.status_code == status.HTTP_204_NO_CONTENT


@pytest.mark.django_db
class TestCoordinateCountView:
    """CoordinateCountViewのテストクラス"""

    def test_empty_count(self, user):
        """ユーザーにコーディネートが1件もない場合のテスト"""
        factory = APIRequestFactory()
        request = factory.get("/coordinate-count/")
        force_authenticate(request, user=user)

        view = CoordinateCountView.as_view()
        response = view(request)
        response.render()

        assert response.data["current_count"] == 0
        assert response.data["max_items"] == 100
        assert response.status_code == status.HTTP_200_OK

    def test_with_coordinates(self, user, photo_coordinate, custom_coordinate):
        """ユーザーにコーディネートがある場合のテスト"""
        factory = APIRequestFactory()
        request = factory.get("/coordinate-count/")
        force_authenticate(request, user=user)

        view = CoordinateCountView.as_view()
        response = view(request)
        response.render()

        expected_count = (
            PhotoCoordinate.objects.filter(user=user).count() + CustomCoordinate.objects.filter(user=user).count()
        )
        assert response.data["current_count"] == expected_count
        assert response.data["max_items"] == 100
        assert response.status_code == status.HTTP_200_OK
