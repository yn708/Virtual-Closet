"""
テストクラスの基底クラスを定義
共通の検証ロジックやヘルパーメソッドを提供
"""

from rest_framework import status


class BaseAuthViewTest:
    """認証関連ビューのテスト基底クラス"""

    def assert_error_response(self, response, expected_status=status.HTTP_400_BAD_REQUEST):
        """エラーレスポンスの共通アサーション"""
        assert response.status_code == expected_status

    def assert_success_response(self, response, expected_status=status.HTTP_200_OK):
        """成功レスポンスの共通アサーション"""
        assert response.status_code == expected_status
