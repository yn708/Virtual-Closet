from django.contrib.auth.models import BaseUserManager


class CustomUserManager(BaseUserManager):
    """
    カスタムユーザーモデル用のマネージャークラス。
    ユーザーの作成と管理に関する特別なメソッドを提供
    """

    def create_user(self, email, password=None, **extra_fields):
        """
        通常のユーザーを作成するメソッド。

        :param email: ユーザーのメールアドレス（必須）
        :param password: ユーザーのパスワード（オプション）
        :param extra_fields: その他のフィールド
        :return: 作成されたユーザーオブジェクト
        """
        if not email:
            raise ValueError("メールアドレスは必須です")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """
        スーパーユーザー（管理者）を作成するメソッド。

        :param email: スーパーユーザーのメールアドレス
        :param password: スーパーユーザーのパスワード
        :param extra_fields: その他のフィールド
        :return: 作成されたスーパーユーザーオブジェクト
        """
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, password, **extra_fields)

    def get_active_users(self):
        """アクティブなユーザーのみを取得するメソッド"""
        return self.filter(is_active=True)

    def get_users_by_auth_provider(self, provider):
        """特定の認証プロバイダーでログインしたユーザーを取得するメソッド"""
        return self.filter(auth_provider=provider)
