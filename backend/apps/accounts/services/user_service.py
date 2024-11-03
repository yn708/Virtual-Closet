from django.utils import timezone


class UserService:
    @staticmethod
    def is_new_user(user, minutes=1):
        """新規ユーザーかどうかを判定"""
        return user.created_at > (timezone.now() - timezone.timedelta(minutes=minutes))

    @classmethod
    def update_user_after_google_login(cls, user):
        """Googleログイン後のユーザー情報更新を担当"""
        user.auth_provider = "google"
        user.is_active = True

        user.save()
        return cls.is_new_user(user)
