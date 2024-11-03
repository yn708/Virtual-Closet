"""ユーザーサービスのテスト"""

from django.utils import timezone
from freezegun import freeze_time

from apps.accounts.services.user_service import UserService
from apps.accounts.tests.services.base import BaseServiceTest


class TestUserService(BaseServiceTest):
    """ユーザーサービスのテスト"""

    @freeze_time("2024-01-01 12:00:00")
    def test_new_user_status(self, inactive_user):
        """新規ユーザー判定のテスト"""
        assert UserService.is_new_user(inactive_user) is True

        inactive_user.created_at = timezone.now() - timezone.timedelta(minutes=2)
        inactive_user.save()
        assert UserService.is_new_user(inactive_user) is False

    @freeze_time("2024-01-01 12:00:00")
    def test_google_login_update(self, inactive_user):
        """Googleログイン後の更新テスト"""
        is_new = UserService.update_user_after_google_login(inactive_user)
        assert is_new is True
        assert inactive_user.auth_provider == "google"
        assert inactive_user.is_active is True
