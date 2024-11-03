from django.db import models


class TimestampMixin(models.Model):
    """
    作成日時と更新日時を自動的に記録するミックスイン。
    モデルに継承させることで、タイムスタンプ機能を簡単に追加可能
    """

    created_at = models.DateTimeField("作成日時", auto_now_add=True)
    updated_at = models.DateTimeField("更新日時", auto_now=True)

    class Meta:
        abstract = True  # この設定により、このミックスインは単独でテーブルを作成しない
