import pytest
from django.db import connection, models
from django.utils import timezone

from apps.accounts.constants import CONFIRMATION_CODE_EXPIRATION_MINUTES
from apps.accounts.mixins.confirmation_code_mixin import ConfirmationCodeMixin


@pytest.fixture(scope="session")
def test_model_class():
    """テストモデルのクラスを定義するだけのフィクスチャ"""

    class TestModel(ConfirmationCodeMixin):
        is_active = models.BooleanField(default=False)

        class Meta:
            app_label = "test_confirmation_code_mixin"
            managed = True  # テスト用の一時的なモデルであることを指定

    return TestModel


@pytest.fixture
def test_model(test_model_class):  # dbフィクスチャを使用
    """テスト用モデルを動的に作成するフィクスチャ"""
    # テーブルを作成
    with connection.schema_editor() as schema_editor:
        schema_editor.create_model(test_model_class)

    yield test_model_class

    # テーブルを削除
    with connection.schema_editor() as schema_editor:
        schema_editor.delete_model(test_model_class)


@pytest.fixture
def test_instance(test_model):
    """テスト用インスタンスを提供するフィクスチャ"""
    return test_model.objects.create()


@pytest.mark.django_db
class TestConfirmationCodeMixin:
    def test_set_confirmation_code(self, test_instance):
        """確認コードの設定をテスト"""
        code = "123456"
        test_instance.set_confirmation_code(code)

        assert test_instance.confirmation_code == code
        assert test_instance.confirmation_code_created_at is not None
        assert not test_instance.is_active

        # DBから再取得して確認
        refreshed_instance = test_instance.__class__.objects.get(pk=test_instance.pk)
        assert refreshed_instance.confirmation_code == code
        assert not refreshed_instance.is_active

    def test_check_confirmation_code_valid(self, test_instance):
        """有効な確認コードのチェックをテスト"""
        code = "123456"
        test_instance.confirmation_code = code
        test_instance.confirmation_code_created_at = timezone.now()
        test_instance.save()

        assert test_instance.check_confirmation_code(code) == "ok"

    def test_check_confirmation_code_invalid(self, test_instance):
        """無効な確認コードのチェックをテスト"""
        test_instance.confirmation_code = "123456"
        test_instance.confirmation_code_created_at = timezone.now()
        test_instance.save()

        assert test_instance.check_confirmation_code("654321") == "invalid"

    def test_check_confirmation_code_expired(self, test_instance):
        """期限切れ確認コードのチェックをテスト"""
        code = "123456"
        test_instance.confirmation_code = code
        # 期限切れの時間を設定
        test_instance.confirmation_code_created_at = timezone.now() - timezone.timedelta(
            minutes=CONFIRMATION_CODE_EXPIRATION_MINUTES + 1
        )
        test_instance.save()

        assert test_instance.check_confirmation_code(code) == "expired"

    def test_confirm_email(self, test_instance):
        """認証コード確認時処理をテスト"""
        # 初期状態を設定
        test_instance.confirmation_code = "123456"
        test_instance.confirmation_code_created_at = timezone.now()
        test_instance.is_active = False
        test_instance.save()

        test_instance.confirm_email()

        assert test_instance.is_active
        assert test_instance.confirmation_code is None
        assert test_instance.confirmation_code_created_at is None

    def test_confirmation_code_edge_cases(self, test_instance):
        """確認コードのエッジケースをテスト"""
        # 空のコードの場合
        test_instance.confirmation_code = ""
        assert test_instance.check_confirmation_code("123456") == "invalid"

        # Noneの場合
        test_instance.confirmation_code = None
        assert test_instance.check_confirmation_code("123456") == "invalid"

        # 作成日時がNoneの場合
        test_instance.confirmation_code = "123456"
        test_instance.confirmation_code_created_at = None
        with pytest.raises(TypeError):
            test_instance.check_confirmation_code("123456")

    @pytest.mark.parametrize(
        "code,expected",
        [
            ("123456", "ok"),
            ("12345", "invalid"),  # 短すぎる
            ("1234567", "invalid"),  # 長すぎる
            ("abcdef", "invalid"),  # 数字以外
            ("", "invalid"),  # 空文字
        ],
    )
    def test_confirmation_code_formats(self, test_instance, code, expected):
        """様々な形式の確認コードをテスト"""
        if expected == "ok":
            test_instance.confirmation_code = code
            test_instance.confirmation_code_created_at = timezone.now()
            test_instance.save()

        result = test_instance.check_confirmation_code(code)
        assert result == expected
