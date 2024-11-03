from django.contrib.auth import get_user_model

User = get_user_model()


class BaseSerializerTest:
    @staticmethod
    def create_user(email="test@example.com", password="TESTpass123", is_active=True, **kwargs):
        """テストユーザー作成ヘルパー"""

        username = kwargs.pop("username", email.split("@")[0])
        return User.objects.create_user(
            email=email, password=password, username=username, is_active=is_active, **kwargs
        )
