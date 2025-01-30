# # """UserDetailView および UserUpdateViewのテストモジュール"""

# # import os

# # import pytest
# # from django.core.files.uploadedfile import SimpleUploadedFile
# # from rest_framework import status

# # from apps.accounts.constants import IMAGE_SIZE_ERROR, MAX_IMAGE_SIZE
# # from apps.accounts.tests.views.base import BaseAuthViewTest


# # class TestUserDetailView(BaseAuthViewTest):
# #     """UserDetailViewのテストクラス"""

# #     @pytest.fixture
# #     def detail_url(self):
# #         """詳細エンドポイントのURL"""
# #         return "/api/auth/user/detail/"

# #     def test_get_user_detail_authenticated(self, api_client, detail_url, active_user):
# #         """正常系: 認証済みユーザーが自身の詳細情報を取得"""
# #         # ユーザーで認証
# #         self._authenticate_user(api_client, active_user)

# #         # リクエスト実行
# #         response = api_client.get(detail_url)

# #         # レスポンスの検証
# #         self.assert_success_response(response)
# #         expected_fields = {"username", "name", "birth_date", "gender", "profile_image", "height"}
# #         assert set(response.data.keys()) == expected_fields
# #         assert response.data["username"] == active_user.username

# #     def test_get_user_detail_unauthenticated(self, api_client, detail_url):
# #         """異常系: 未認証ユーザーがアクセスを試みた場合"""
# #         response = api_client.get(detail_url)
# #         self.assert_error_response(response, status.HTTP_401_UNAUTHORIZED)


# # class TestUserUpdateView(BaseAuthViewTest):
# #     """UserUpdateViewのテストクラス"""

# #     @pytest.fixture
# #     def update_url(self):
# #         """更新エンドポイントのURL"""
# #         return "/api/auth/user/update/"

# #     @pytest.fixture
# #     def test_image(self):
# #         """テスト用の画像ファイル"""
# #         return SimpleUploadedFile(name="test_image.jpg", content=b"file_content", content_type="image/jpeg")

# #     @pytest.fixture
# #     def update_data(self):
# #         """更新用のテストデータ"""
# #         return {
# #             "username": "updated_username",
# #             "name": "Updated Name",
# #             "birth_date": "1990-01-01",
# #             "gender": "male",
# #             "height": 170,
# #         }

# #     def test_update_user_profile_authenticated(self, api_client, update_url, active_user, update_data):
# #         """正常系: 認証済みユーザーがプロフィール情報を更新"""
# #         self._authenticate_user(api_client, active_user)

# #         response = api_client.patch(update_url, data=update_data, format="json")

# #         self.assert_success_response(response)
# #         assert response.data["username"] == update_data["username"]
# #         assert response.data["name"] == update_data["name"]
# #         assert response.data["birth_date"] == update_data["birth_date"]

# #     def test_update_profile_image(self, api_client, update_url, active_user, test_image):
# #         """正常系: プロフィール画像のアップロード"""
# #         self._authenticate_user(api_client, active_user)

# #         response = api_client.patch(update_url, data={"profile_image": test_image}, format="multipart")

# #         self.assert_success_response(response)
# #         assert "profile_image" in response.data
# #         assert response.data["profile_image"] is not None

# #     def test_delete_profile_image(self, api_client, update_url, active_user, test_image):
# #         """正常系: プロフィール画像の削除"""
# #         self._authenticate_user(api_client, active_user)

# #         # まず画像をアップロード
# #         upload_response = api_client.patch(update_url, data={"profile_image": test_image}, format="multipart")
# #         self.assert_success_response(upload_response)

# #         # 画像を削除
# #         delete_response = api_client.patch(update_url, data={"delete_profile_image": True}, format="json")

# #         self.assert_success_response(delete_response)
# #         assert delete_response.data["profile_image"] is None

# #     def test_delete_birth_date(self, api_client, update_url, active_user, update_data):
# #         """正常系: 生年月日の削除"""
# #         self._authenticate_user(api_client, active_user)

# #         # まず生年月日を設定
# #         set_response = api_client.patch(update_url, data={"birth_date": update_data["birth_date"]}, format="json")
# #         self.assert_success_response(set_response)

# #         # 生年月日を削除
# #         delete_response = api_client.patch(update_url, data={"delete_birth_date": True}, format="json")

# #         self.assert_success_response(delete_response)
# #         assert delete_response.data["birth_date"] is None

# #     def test_large_profile_image(self, api_client, update_url, active_user):
# #         """異常系: サイズ制限を超える画像のアップロード"""
# #         self._authenticate_user(api_client, active_user)

# #         # サイズ制限を超える画像を作成
# #         large_image = SimpleUploadedFile(
# #             name="large_image.jpg", content=b"x" * (MAX_IMAGE_SIZE + 1), content_type="image/jpeg"
# #         )

# #         response = api_client.patch(update_url, data={"profile_image": large_image}, format="multipart")

# #         self.assert_error_response(response)
# #         assert "profile_image" in response.data
# #         assert response.data["profile_image"][0] == IMAGE_SIZE_ERROR

# #     def test_update_user_profile_unauthenticated(self, api_client, update_url, update_data):
# #         """異常系: 未認証ユーザーが更新を試みた場合"""
# #         response = api_client.patch(update_url, update_data)
# #         self.assert_error_response(response, status.HTTP_401_UNAUTHORIZED)

# #     @pytest.fixture(autouse=True)
# #     def teardown(self):
# #         """テスト終了後のクリーンアップ"""
# #         yield
# #         # テストで作成された画像ファイルを削除
# #         if os.path.exists("media/profile_images/"):
# #             for file in os.listdir("media/profile_images/"):
# #                 os.remove(os.path.join("media/profile_images/", file))


# """
# tests/views/test_user_views.py
# ユーザー情報の取得・更新に関するビューテスト
# """

# import os

# import pytest
# from django.core.files.uploadedfile import SimpleUploadedFile
# from rest_framework import status

# from apps.accounts.constants import IMAGE_SIZE_ERROR, MAX_IMAGE_SIZE
# from apps.accounts.tests.views.base import BaseAuthViewTest


# class TestUserDetailView(BaseAuthViewTest):
#     """UserDetailViewのテストクラス"""

#     @pytest.fixture
#     def url(self):
#         """エンドポイントのURL"""
#         return "/api/auth/user/detail/"

#     def test_get_user_details_success(self, auth_client, active_user, url):
#         """
#         正常系: ユーザー詳細情報の取得が成功することを確認
#         """
#         response = auth_client.get(url)

#         self.assert_success_response(response)
#         assert response.data["username"] == active_user.username

#         # 必須フィールドの存在確認
#         expected_fields = {"username", "name", "birth_date", "gender", "profile_image", "height"}
#         assert set(response.data.keys()) == expected_fields

#     def test_get_user_details_unauthorized(self, api_client, url):
#         """
#         異常系: 未認証ユーザーのアクセスが拒否されることを確認
#         """
#         response = api_client.get(url)
#         self.assert_error_response(response, status.HTTP_401_UNAUTHORIZED)


# class TestUserUpdateView(BaseAuthViewTest):
#     """UserUpdateViewのテストクラス"""

#     @pytest.fixture
#     def url(self):
#         """エンドポイントのURL"""
#         return "/api/auth/user/update/"

#     @pytest.fixture
#     def test_image(self):
#         """テスト用の画像ファイル"""
#         return SimpleUploadedFile("test_image.jpg", b"file_content", content_type="image/jpeg")

#     @pytest.fixture
#     def large_image(self):
#         """サイズ制限を超える画像ファイル"""
#         return SimpleUploadedFile("large_image.jpg", b"x" * (MAX_IMAGE_SIZE + 1), content_type="image/jpeg")

#     def test_update_user_profile_success(self, auth_client, active_user, url, test_image):
#         """
#         正常系: ユーザープロフィールの更新が成功することを確認
#         """
#         update_data = {
#             "username": "updated_username",
#             "name": "Updated Name",
#             "gender": "male",
#             "height": 180,
#             "profile_image": test_image,
#         }

#         response = auth_client.patch(url, data=update_data, format="multipart")

#         self.assert_success_response(response)
#         active_user.refresh_from_db()

#         # 更新されたフィールドの確認
#         assert active_user.username == "updated_username"
#         assert active_user.name == "Updated Name"
#         assert active_user.gender == "male"
#         assert active_user.height == 180
#         assert active_user.profile_image is not None

#     def test_update_user_profile_unauthorized(self, api_client, url):
#         """
#         異常系: 未認証ユーザーの更新が拒否されることを確認
#         """
#         response = api_client.patch(url, data={"username": "new_username"})
#         self.assert_error_response(response, status.HTTP_401_UNAUTHORIZED)

#     def test_update_profile_with_large_image(self, auth_client, url, large_image):
#         """
#         異常系: サイズ制限を超える画像アップロードが拒否されることを確認
#         """
#         response = auth_client.patch(url, data={"profile_image": large_image}, format="multipart")

#         self.assert_error_response(response)
#         assert IMAGE_SIZE_ERROR in str(response.data["profile_image"])

#     def test_delete_profile_image(self, auth_client, active_user, url, test_image):
#         """
#         正常系: プロフィール画像の削除が成功することを確認
#         """
#         # まず画像をアップロード
#         auth_client.patch(url, data={"profile_image": test_image}, format="multipart")
#         active_user.refresh_from_db()
#         assert active_user.profile_image is not None

#         # 画像を削除
#         response = auth_client.patch(url, data={"delete_profile_image": True}, format="json")

#         self.assert_success_response(response)
#         active_user.refresh_from_db()
#         assert active_user.profile_image is None

#     def test_delete_birth_date(self, auth_client, active_user, url):
#         """
#         正常系: 生年月日の削除が成功することを確認
#         """
#         # 生年月日を設定
#         auth_client.patch(url, data={"birth_date": "1990-01-01"}, format="json")
#         active_user.refresh_from_db()
#         assert active_user.birth_date is not None

#         # 生年月日を削除
#         response = auth_client.patch(url, data={"delete_birth_date": True}, format="json")

#         self.assert_success_response(response)
#         active_user.refresh_from_db()
#         assert active_user.birth_date is None

#     def test_partial_update(self, auth_client, url):
#         """
#         正常系: 部分的な更新が成功することを確認
#         """
#         response = auth_client.patch(url, data={"username": "partial_update"}, format="json")

#         self.assert_success_response(response)
#         assert response.data["username"] == "partial_update"

#     @pytest.fixture(autouse=True)
#     def cleanup_test_files(self, request):
#         """テストで作成された画像ファイルを削除"""

#         def cleanup():
#             from django.conf import settings

#             test_upload_dir = os.path.join(settings.MEDIA_ROOT, "test")
#             if os.path.exists(test_upload_dir):
#                 for filename in os.listdir(test_upload_dir):
#                     os.remove(os.path.join(test_upload_dir, filename))
#                 os.rmdir(test_upload_dir)

#         request.addfinalizer(cleanup)

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

    @patch("django.core.files.storage.default_storage.save")
    def test_update_user_profile_success(self, mock_save, auth_client, active_user, url, valid_image):
        """
        正常系: ユーザープロフィールの更新が成功することを確認
        """
        # デフォルトストレージのsaveメソッドをモック
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

    @patch("django.core.files.storage.default_storage.exists")
    @patch("django.core.files.storage.default_storage.delete")
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

        # ImageFieldFileがNoneかどうかを文字列で比較
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
