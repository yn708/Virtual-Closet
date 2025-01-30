import datetime
from datetime import timedelta, timezone

import pytest
from django.db import connection, models
from django.utils import timezone as django_timezone
from freezegun import freeze_time

from core.mixins.timestamp_mixin import TimestampMixin


@pytest.fixture(scope="session")
def test_model_class():
    """テストモデルのクラスを定義するだけのフィクスチャ"""

    class TestModel(TimestampMixin):
        name = models.CharField(max_length=100)

        class Meta:
            app_label = "test_timestamp_mixin"
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
def frozen_datetime():
    """固定の日時を提供するフィクスチャ"""
    return datetime.datetime(2024, 1, 1, 12, 0, tzinfo=timezone.utc)


@pytest.fixture
def frozen_time(frozen_datetime):
    """時間を固定するフィクスチャ"""
    with freeze_time(frozen_datetime) as frozen:
        yield frozen


@pytest.fixture
def test_instance(test_model, frozen_time):
    """テスト用インスタンスを提供するフィクスチャ"""
    return test_model.objects.create(name="test")


@pytest.mark.django_db
class TestTimestampMixin:
    """TimestampMixinの機能テスト"""

    def test_fields_on_create(self, test_instance, frozen_datetime):
        """作成時にタイムスタンプが正しく設定されることを確認"""
        assert test_instance.created_at == frozen_datetime
        assert test_instance.updated_at == frozen_datetime

    def test_updated_at_on_save(self, test_instance):
        """保存時にupdated_atのみが更新されることを確認"""
        initial_created_at = test_instance.created_at

        with freeze_time(django_timezone.now() + timedelta(hours=1)):
            test_instance.name = "updated"
            test_instance.save()

            assert test_instance.created_at == initial_created_at
            assert test_instance.updated_at == django_timezone.now()

    def test_update_preserves_created_at(self, test_instance):
        """更新時にcreated_atが保持されることを確認"""
        original_created_at = test_instance.created_at

        # 複数回更新
        for i in range(3):
            with freeze_time(django_timezone.now() + timedelta(hours=i + 1)):
                test_instance.name = f"update_{i}"
                test_instance.save()
                assert test_instance.created_at == original_created_at
                assert test_instance.updated_at > original_created_at
