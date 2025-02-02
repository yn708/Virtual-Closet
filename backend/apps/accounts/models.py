from uuid import uuid4

from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models

from apps.accounts.managers.auth_manager import CustomUserManager
from apps.accounts.mixins.confirmation_code_mixin import ConfirmationCodeMixin
from core.mixins.timestamp_mixin import TimestampMixin
from core.utils.storages import CustomStorage


class CustomUser(AbstractBaseUser, PermissionsMixin, TimestampMixin, ConfirmationCodeMixin):
    """
    カスタムユーザーモデル。
    AbstractBaseUser, PermissionsMixinsその他 を拡張し、追加のフィールドと機能を提供
    """

    userId = models.CharField("ユーザーID", max_length=255, default=uuid4, primary_key=True, editable=False)
    username = models.CharField(
        "ユーザーネーム",
        max_length=255,
        unique=True,  # 重複不可
    )
    name = models.CharField("名前", max_length=255, null=True, blank=True)  # 重複可能
    email = models.EmailField("メールアドレス", max_length=255, unique=True)
    birth_date = models.DateField("生年月日", null=True, blank=True)
    gender = models.CharField(
        "性別",
        max_length=10,
        choices=[
            ("unanswered", "未回答"),
            ("male", "男性"),
            ("female", "女性"),
            ("other", "その他"),
        ],
        default="unanswered",  # デフォルトで未回答
        null=True,
        blank=True,
    )
    profile_image = models.ImageField(
        "プロフィール画像", upload_to="profile_images/", storage=CustomStorage(), null=True, blank=True
    )
    height = models.PositiveIntegerField("身長(cm)", null=True, blank=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(
        default=False,  # メール認証で仮登録過程があるため、デフォルトをFalseに設定
    )
    auth_provider = models.CharField(max_length=50, default="email")  # Email or Google

    objects = CustomUserManager()

    USERNAME_FIELD = "email"  # ログイン時に使用するフィールド
    REQUIRED_FIELDS = []  # createsuperuser管理コマンド使用時に追加で要求されるフィールド

    def __str__(self):
        return self.email
