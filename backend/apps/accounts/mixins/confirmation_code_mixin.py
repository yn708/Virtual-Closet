from django.db import models
from django.utils import timezone

from apps.accounts.constants import CONFIRMATION_CODE_EXPIRATION_MINUTES


class ConfirmationCodeMixin(models.Model):
    """
    メール確認用の確認コードに関する機能を提供するミックスイン。
    確認コードの設定、チェック、有効期限の管理などの機能を含む
    """

    confirmation_code = models.CharField("確認コード", max_length=6, null=True, blank=True)
    confirmation_code_created_at = models.DateTimeField("確認コード作成日時", null=True, blank=True)

    class Meta:
        abstract = True

    def set_confirmation_code(self, code):
        """
        確認コードを設定し、関連するフィールドを更新するメソッド

        :param code: 設定する確認コード
        """
        self.confirmation_code = code
        self.confirmation_code_created_at = timezone.now()
        self.is_active = False  # コード確認前はユーザーを非アクティブに設定
        self.save()

    def check_confirmation_code(self, code):
        """
        提供された確認コードの有効性をチェックするメソッド

        :param code: チェックする確認コード
        :return: 'ok', 'invalid', 'expired'のいずれか
        """
        if self.confirmation_code != code:
            return "invalid"
        if timezone.now() > self.confirmation_code_created_at + timezone.timedelta(
            minutes=CONFIRMATION_CODE_EXPIRATION_MINUTES
        ):
            return "expired"
        return "ok"

    def confirm_email(self):
        """認証コード確認が取れた場合に関連フィールドをリセットするメソッド"""
        self.is_active = True  # ユーザーをアクティブにする
        self.confirmation_code = None  # 確認コードをクリア（セキュリティのため）
        self.confirmation_code_created_at = None  # 同じく
        self.save()
