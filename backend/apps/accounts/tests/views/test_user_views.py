"""
tests/views/test_user_views.py
ユーザー情報の取得・更新に関するビューテスト
"""

from unittest.mock import patch

import pytest
from rest_framework import status

from apps.accounts.tests.views.base import BaseAuthViewTest


class TestUserDetailView(BaseAuthViewTest):
    """UserDetailViewのテストクラス"""

    @pytest.fixture
    def url(self):
        """エンドポイントのURL"""
        return "/api/auth/user/detail/"

    def test_get_user_details_success(self, auth_client, active_user, url):
        """
        正常系: ユーザー詳細情報の取得が成功することを確認
        """
        response = auth_client.get(url)

        self.assert_success_response(response)
        assert response.data["username"] == active_user.username

        # 必須フィールドの存在確認
        expected_fields = {"username", "name", "birth_date", "gender", "profile_image", "height"}
        assert set(response.data.keys()) == expected_fields

    def test_get_user_details_unauthorized(self, api_client, url):
        """
        異常系: 未認証ユーザーのアクセスが拒否されることを確認
        """
        response = api_client.get(url)
        self.assert_error_response(response, status.HTTP_401_UNAUTHORIZED)


class TestUserUpdateView(BaseAuthViewTest):
    """UserUpdateViewのテストクラス"""

    @pytest.fixture
    def url(self):
        """エンドポイントのURL"""
        return "/api/auth/user/update/"

    @patch("core.utils.storages.CustomStorage.save")
    def test_update_user_profile_success(self, mock_save, auth_client, active_user, url, valid_image):
        """
        正常系: ユーザープロフィールの更新が成功することを確認
        """
        # カスタムストレージのsaveメソッドをモック
        mock_save.return_value = "path/to/saved/image.png"

        update_data = {
            "username": "updated_username",
            "name": "Updated Name",
            "gender": "male",
            "height": 180,
            "profile_image": valid_image,
        }

        response = auth_client.patch(url, data=update_data, format="multipart")
        self.assert_success_response(response)

        active_user.refresh_from_db()
        assert active_user.username == "updated_username"
        assert active_user.name == "Updated Name"
        assert active_user.gender == "male"
        assert active_user.height == 180
        assert mock_save.called

    def test_update_user_profile_unauthorized(self, api_client, url):
        """
        異常系: 未認証ユーザーの更新が拒否されることを確認
        """
        response = api_client.patch(url, data={"username": "new_username"})
        self.assert_error_response(response, status.HTTP_401_UNAUTHORIZED)

    @patch("core.utils.storages.CustomStorage.exists")
    @patch("core.utils.storages.CustomStorage.delete")
    def test_delete_profile_image(self, mock_delete, mock_exists, auth_client, active_user, url):
        """
        正常系: プロフィール画像の削除が成功することを確認
        """
        # 画像が存在することをモック
        mock_exists.return_value = True

        # プロフィール画像を設定
        active_user.profile_image = "path/to/image.jpg"
        active_user.save()

        response = auth_client.patch(url, data={"delete_profile_image": True}, format="json")
        self.assert_success_response(response)
        active_user.refresh_from_db()

        # profile_image が空文字になっていることを確認
        assert str(active_user.profile_image) == ""
        assert mock_delete.called

    def test_delete_birth_date(self, auth_client, active_user, url):
        """
        正常系: 生年月日の削除が成功することを確認
        """
        # まず生年月日を設定
        response = auth_client.patch(url, data={"birth_date": "1990-01-01"}, format="json")
        self.assert_success_response(response)

        active_user.refresh_from_db()
        assert active_user.birth_date is not None

        # 生年月日を削除
        response = auth_client.patch(url, data={"delete_birth_date": True}, format="json")
        self.assert_success_response(response)
        active_user.refresh_from_db()
        assert active_user.birth_date is None

    def test_partial_update(self, auth_client, url):
        """
        正常系: 部分的な更新が成功することを確認
        """
        response = auth_client.patch(url, data={"username": "partial_update"}, format="json")
        self.assert_success_response(response)
        assert response.data["username"] == "partial_update"
