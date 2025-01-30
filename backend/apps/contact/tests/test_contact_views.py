from unittest.mock import patch

import pytest
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

User = get_user_model()


@pytest.mark.django_db
class TestAnonymousContactAPIView:
    """匿名ユーザーのお問い合わせAPIビューのテスト"""

    @pytest.fixture
    def api_client(self):
        return APIClient()

    @pytest.fixture
    def valid_data(self):
        return {
            "name": "テストユーザー",
            "email": "test@example.com",
            "subject": "テスト件名",
            "message": "これはテストメッセージです。問い合わせ内容のテストです。",
        }

    def test_successful_contact_submission(self, api_client, valid_data):
        """正常系: 有効なデータでの問い合わせ送信テスト"""
        with patch("apps.contact.services.NotificationService.notify") as mock_notify:
            mock_notify.return_value = True
            url = reverse("contact:anonymous-contact")

            response = api_client.post(url, valid_data, format="json")

            assert response.status_code == status.HTTP_200_OK
            assert response.data["success"] is True
            assert "お問い合わせを送信しました。" in response.data["message"]
            mock_notify.assert_called_once_with(valid_data)

    def test_invalid_data_submission(self, api_client):
        """異常系: 無効なデータでの問い合わせ送信テスト"""
        invalid_data = {
            "name": "",  # 必須フィールドを空に
            "email": "invalid-email",  # 無効なメールアドレス
            "subject": "件名",
            "message": "短すぎる",  # 最小長より短い
        }
        url = reverse("contact:anonymous-contact")

        response = api_client.post(url, invalid_data, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data["success"] is False
        assert "errors" in response.data
        assert "name" in response.data["errors"]
        assert "email" in response.data["errors"]
        assert "message" in response.data["errors"]

    def test_notification_service_failure(self, api_client, valid_data):
        """異常系: 通知サービス失敗時のテスト"""
        with patch("apps.contact.services.NotificationService.notify") as mock_notify:
            mock_notify.return_value = False
            url = reverse("contact:anonymous-contact")

            response = api_client.post(url, valid_data, format="json")

            assert response.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR
            assert response.data["success"] is False
            assert "送信に失敗しました。" in response.data["error"]

    def test_service_exception_handling(self, api_client, valid_data):
        """異常系: サービス例外発生時のテスト"""
        with patch("apps.contact.services.NotificationService.notify") as mock_notify:
            mock_notify.side_effect = Exception("サービスエラー")
            url = reverse("contact:anonymous-contact")

            response = api_client.post(url, valid_data, format="json")

            assert response.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR
            assert response.data["success"] is False
            assert "サービスエラー" in response.data["error"]


@pytest.mark.django_db
class TestAuthenticatedContactAPIView:
    """認証済みユーザーのお問い合わせAPIビューのテスト"""

    @pytest.fixture
    def api_client(self):
        return APIClient()

    @pytest.fixture
    def user(self):
        return User.objects.create_user(username="testuser", email="testuser@example.com", password="testpass123")

    @pytest.fixture
    def authenticated_client(self, api_client, user):
        api_client.force_authenticate(user=user)
        return api_client

    @pytest.fixture
    def valid_data(self):
        return {"subject": "テスト件名", "message": "これはテストメッセージです。問い合わせ内容のテストです。"}

    def test_unauthenticated_access(self, api_client, valid_data):
        """異常系: 未認証アクセスのテスト"""
        url = reverse("contact:authenticated-contact")
        response = api_client.post(url, valid_data, format="json")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_successful_contact_submission(self, authenticated_client, valid_data, user):
        """正常系: 認証済みユーザーの問い合わせ送信テスト"""
        with patch("apps.contact.services.NotificationService.notify") as mock_notify:
            mock_notify.return_value = True
            url = reverse("contact:authenticated-contact")

            response = authenticated_client.post(url, valid_data, format="json")

            assert response.status_code == status.HTTP_200_OK
            assert response.data["success"] is True
            assert "お問い合わせを送信しました。" in response.data["message"]

            # 通知サービスに渡されるデータの検証
            expected_notification_data = {
                "name": user.username,
                "email": user.email,
                "subject": valid_data["subject"],
                "message": valid_data["message"],
            }
            mock_notify.assert_called_once_with(expected_notification_data)

    def test_invalid_data_submission(self, authenticated_client):
        """異常系: 無効なデータでの問い合わせ送信テスト"""
        invalid_data = {
            "subject": "",  # 必須フィールドを空に
            "message": "短すぎる",  # 最小長より短い
        }
        url = reverse("contact:authenticated-contact")

        response = authenticated_client.post(url, invalid_data, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data["success"] is False
        assert "errors" in response.data
        assert "subject" in response.data["errors"]
        assert "message" in response.data["errors"]

    def test_notification_service_failure(self, authenticated_client, valid_data):
        """異常系: 通知サービス失敗時のテスト"""
        with patch("apps.contact.services.NotificationService.notify") as mock_notify:
            mock_notify.return_value = False
            url = reverse("contact:authenticated-contact")

            response = authenticated_client.post(url, valid_data, format="json")

            assert response.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR
            assert response.data["success"] is False
            assert "送信に失敗しました。" in response.data["error"]

    def test_service_exception_handling(self, authenticated_client, valid_data):
        """異常系: サービス例外発生時のテスト"""
        with patch("apps.contact.services.NotificationService.notify") as mock_notify:
            mock_notify.side_effect = Exception("サービスエラー")
            url = reverse("contact:authenticated-contact")

            response = authenticated_client.post(url, valid_data, format="json")

            assert response.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR
            assert response.data["success"] is False
            assert "サービスエラー" in response.data["error"]
