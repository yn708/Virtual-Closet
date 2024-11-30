import io
from unittest.mock import patch

import pytest
from django.core.files.uploadedfile import SimpleUploadedFile
from PIL import Image
from rest_framework import status

from apps.accounts.tests.views.base import BaseAuthViewTest


@pytest.mark.django_db
class TestRemoveBgView(BaseAuthViewTest):
    """背景除去APIのテストクラス"""

    @pytest.fixture(autouse=True)
    def setup(self):
        """各テストメソッド実行前のセットアップ"""
        self.url = "/api/image/remove-bg/"

    @pytest.fixture
    def test_image(self):
        """テスト用の画像ファイルを生成するフィクスチャ"""
        image = Image.new("RGB", (100, 100), "white")
        img_buffer = io.BytesIO()
        image.save(img_buffer, format="PNG")
        img_buffer.seek(0)

        return SimpleUploadedFile("test_image.png", img_buffer.getvalue(), content_type="image/png")

    def test_successful_background_removal(self, auth_client, test_image):
        """正常系: 背景除去が成功するケース"""
        with patch("rembg.remove") as mock_remove:
            # モックの戻り値を設定
            mock_output = Image.new("RGBA", (100, 100), (0, 0, 0, 0))
            mock_remove.return_value = mock_output

            response = auth_client.post(self.url, {"image": test_image}, format="multipart")

            self.assert_success_response(response)
            assert response.json()["status"] == "success"
            assert "image" in response.json()
            assert "process_time" in response.json()

            # Base64エンコードされた画像データの検証
            image_data = response.json()["image"]
            assert isinstance(image_data, str)
            assert len(image_data) > 0

    def test_unauthorized_access(self, api_client, test_image):
        """異常系: 未認証ユーザーのアクセス拒否"""
        response = api_client.post(self.url, {"image": test_image}, format="multipart")
        self.assert_error_response(response, status.HTTP_401_UNAUTHORIZED)

    def test_missing_image(self, auth_client):
        """異常系: 画像が送信されていないケース"""
        response = auth_client.post(self.url, {}, format="multipart")
        self.assert_error_response(response)
        assert response.json()["status"] == "error"
        assert response.json()["message"] == "Invalid request"

    def test_invalid_image_format(self, auth_client):
        """異常系: 無効な画像フォーマット"""
        invalid_file = SimpleUploadedFile("test.txt", b"Invalid image content", content_type="text/plain")

        response = auth_client.post(self.url, {"image": invalid_file}, format="multipart")

        self.assert_error_response(response, status.HTTP_500_INTERNAL_SERVER_ERROR)
        assert response.json()["status"] == "error"
