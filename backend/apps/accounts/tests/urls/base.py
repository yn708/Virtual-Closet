from django.urls import resolve, reverse


class BaseUrlTest:
    """URLテスト用の基底クラス"""

    @staticmethod
    def assert_url_resolves(url_name, expected_path):
        """URLの解決とパスを検証するヘルパーメソッド"""
        url = reverse(url_name)
        assert resolve(url).view_name == url_name
        assert url == expected_path
