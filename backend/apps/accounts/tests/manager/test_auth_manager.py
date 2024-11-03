import pytest
from django.contrib.auth import get_user_model

User = get_user_model()


@pytest.mark.django_db
class TestCustomUserManager:
    def test_create_user_success(self):
        """通常ユーザー作成の正常系テスト"""
        email = "test@example.com"
        password = "TESTpass123"
        username = "testuser"
        user = User.objects.create_user(email=email, password=password, username=username)

        assert user.email == email
        assert user.check_password(password)
        assert not user.is_staff
        assert not user.is_superuser
        assert not user.is_active  # デフォルトでFalse

    def test_create_user_without_email(self):
        """メールアドレスなしでのユーザー作成テスト"""
        with pytest.raises(ValueError) as exc:
            User.objects.create_user(email="", password="TESTpass123")
        assert str(exc.value) == "メールアドレスは必須です"

    def test_create_superuser_success(self):
        """スーパーユーザー作成の正常系テスト"""
        email = "admin@example.com"
        password = "adminpass123"
        username = "testuser"

        admin_user = User.objects.create_superuser(email=email, password=password, username=username)

        assert admin_user.email == email
        assert admin_user.check_password(password)
        assert admin_user.is_staff
        assert admin_user.is_superuser
        assert admin_user.is_active

    def test_create_superuser_with_invalid_flags(self):
        """無効なフラグでのスーパーユーザー作成テスト"""
        with pytest.raises(ValueError) as exc:
            User.objects.create_superuser(email="admin@example.com", password="adminpass123", is_staff=False)
        assert str(exc.value) == "Superuser must have is_staff=True."

        with pytest.raises(ValueError) as exc:
            User.objects.create_superuser(email="admin@example.com", password="adminpass123", is_superuser=False)
        assert str(exc.value) == "Superuser must have is_superuser=True."

    def test_get_active_users(self, django_user_model):
        """アクティブユーザー取得メソッドのテスト"""
        # アクティブユーザーを作成
        active_user = django_user_model.objects.create_user(
            email="active@example.com", password="testpass123", username="active", is_active=True
        )
        # 非アクティブユーザーを作成
        inactive_user = django_user_model.objects.create_user(
            email="inactive@example.com", password="testpass123", username="inactive", is_active=False
        )

        active_users = User.objects.get_active_users()
        assert active_user.email in active_users.values_list("email", flat=True)
        assert inactive_user not in active_users

    def test_get_users_by_auth_provider(self, django_user_model):
        """認証プロバイダーでのユーザー取得テスト"""
        # Googleで認証したユーザーを作成
        google_user = django_user_model.objects.create_user(
            email="google@example.com", password="testpass123", username="google-account", auth_provider="google"
        )

        google_users = User.objects.get_users_by_auth_provider("google")
        print("google_users", google_users)

        assert google_user.email in google_users.values_list("email", flat=True)
