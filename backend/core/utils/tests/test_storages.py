import pytest

from core.utils.storages import CustomStorage


@pytest.fixture
def custom_storage():
    # テスト開始前に counts を初期化しておく
    CustomStorage.counts = {}
    return CustomStorage()


def test_file_overwrite_flag(custom_storage):
    """CustomStorage の file_overwrite が False になっていることを確認"""
    assert custom_storage.file_overwrite is False


def test_get_alternative_name_first_call(custom_storage):
    """初回呼び出しで _1 が付与されることを確認"""
    file_root = "example"
    file_ext = ".jpg"
    alt_name = custom_storage.get_alternative_name(file_root, file_ext)
    assert alt_name == "example_1.jpg"
    # counts にファイル名が正しく記録されていることを確認
    assert CustomStorage.counts[file_root] == 2


def test_get_alternative_name_multiple_calls(custom_storage):
    """同じ file_root に対して複数回呼び出し、連番が付与されることを確認"""
    file_root = "sample"
    file_ext = ".png"
    # 1回目
    alt_name1 = custom_storage.get_alternative_name(file_root, file_ext)
    # 2回目
    alt_name2 = custom_storage.get_alternative_name(file_root, file_ext)
    # 3回目
    alt_name3 = custom_storage.get_alternative_name(file_root, file_ext)

    assert alt_name1 == "sample_1.png"
    assert alt_name2 == "sample_2.png"
    assert alt_name3 == "sample_3.png"
    # 最終的なカウントは 4 になっているはず
    assert CustomStorage.counts[file_root] == 4
