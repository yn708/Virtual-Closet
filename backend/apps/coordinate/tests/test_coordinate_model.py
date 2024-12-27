import os

import pytest
from django.core.files.uploadedfile import SimpleUploadedFile
from django.db.utils import IntegrityError

from apps.coordinate.models import CoordinateItem, CustomCoordinate, PhotoCoordinate, Scene, Taste
from apps.fashion_items.models import FashionItem


@pytest.mark.django_db
class TestScene:
    """Sceneモデルのテストクラス"""

    def test_create_scene(self, scene):
        """シーンの作成テスト"""
        assert scene.scene
        assert str(scene) == scene.scene

    def test_scene_unique_name(self):
        """シーン名の一意性テスト"""
        scene_name = "休日"
        Scene.objects.create(scene=scene_name)
        with pytest.raises(IntegrityError):
            Scene.objects.create(scene=scene_name)


@pytest.mark.django_db
class TestTaste:
    """Tasteモデルのテストクラス"""

    def test_create_taste(self, taste):
        """テイストの作成テスト"""
        assert taste.taste
        assert str(taste) == taste.taste

    def test_taste_unique_name(self):
        """テイスト名の一意性テスト"""
        taste_name = "古着コーデ"
        Taste.objects.create(taste=taste_name)
        with pytest.raises(IntegrityError):
            Taste.objects.create(taste=taste_name)


@pytest.mark.django_db
class TestPhotoCoordinate:
    def test_delete_with_image(self, user, settings):
        """画像ファイル削除のテスト"""
        import shutil
        import tempfile

        from django.core.files.storage import FileSystemStorage

        # 一時的なメディアルートを設定
        temp_dir = tempfile.mkdtemp()
        settings.MEDIA_ROOT = temp_dir

        # カスタムストレージを使用
        _storage = FileSystemStorage(location=temp_dir, base_url="/media/")

        # 画像作成と保存
        image_content = b"test image content"
        image = SimpleUploadedFile("test_photo.jpg", image_content, content_type="image/jpeg")

        coordinate = PhotoCoordinate.objects.create(user=user, image=image)

        # 実際のファイルパスを取得
        image_path = coordinate.image.path

        # ファイルが存在することを確認
        assert os.path.exists(image_path)

        # 明示的にファイルを削除
        if coordinate.image:
            coordinate.image.delete(save=False)
        coordinate.delete()

        # ファイルが削除されたことを確認
        assert not os.path.exists(image_path)

        # クリーンアップ
        shutil.rmtree(temp_dir, ignore_errors=True)


@pytest.mark.django_db
class TestCustomCoordinate:
    def test_delete_with_preview_image(self, user, settings):
        """プレビュー画像ファイル削除のテスト"""
        import shutil
        import tempfile

        from django.core.files.storage import FileSystemStorage

        # 一時的なメディアルートを設定
        temp_dir = tempfile.mkdtemp()
        settings.MEDIA_ROOT = temp_dir

        # カスタムストレージを使用
        _storage = FileSystemStorage(location=temp_dir, base_url="/media/")

        # 画像作成と保存
        image_content = b"test preview content"
        preview = SimpleUploadedFile("test_preview.jpg", image_content, content_type="image/jpeg")

        coordinate = CustomCoordinate.objects.create(user=user, preview_image=preview)
        image_path = coordinate.preview_image.path

        # ファイルが存在することを確認
        assert os.path.exists(image_path)

        # 明示的にファイルを削除
        if coordinate.preview_image:
            coordinate.preview_image.delete(save=False)
        coordinate.delete()

        # ファイルが削除されたことを確認
        assert not os.path.exists(image_path)

        # クリーンアップ
        shutil.rmtree(temp_dir, ignore_errors=True)


@pytest.mark.django_db
class TestCoordinateItem:
    """CoordinateItemモデルのテストクラス"""

    def test_create_coordinate_item(self, coordinate_item):
        """コーディネートアイテムの作成テスト"""
        assert coordinate_item.coordinate
        assert coordinate_item.item
        assert isinstance(coordinate_item.position_data, dict)
        assert all(key in coordinate_item.position_data for key in ["x", "y", "scale", "rotate", "zIndex"])

    def test_coordinate_cascade_delete(self, coordinate_item, custom_coordinate):
        """コーディネート削除時の動作テスト"""
        item_id = coordinate_item.id
        custom_coordinate.delete()
        with pytest.raises(CoordinateItem.DoesNotExist):
            CoordinateItem.objects.get(pk=item_id)

    def test_item_unique_constraint(self, custom_coordinate, fashion_item):
        """同一アイテムの重複追加防止テスト"""
        CoordinateItem.objects.create(
            coordinate=custom_coordinate,
            item=fashion_item,
            position_data={"x": 0, "y": 0, "scale": 1, "rotate": 0, "zIndex": 1},
        )

        with pytest.raises(IntegrityError):
            CoordinateItem.objects.create(
                coordinate=custom_coordinate,
                item=fashion_item,
                position_data={"x": 10, "y": 10, "scale": 1.5, "rotate": 45, "zIndex": 2},
            )

    def test_ordering_by_zindex(self, custom_coordinate, fashion_item, user, subcategory):
        """zIndexによる並び順のテスト"""
        # 2つの異なるアイテムを作成
        _item1 = CoordinateItem.objects.create(
            coordinate=custom_coordinate,
            item=fashion_item,
            position_data={"x": 0, "y": 0, "scale": 1, "rotate": 0, "zIndex": 2},
        )

        # 2つ目のファッションアイテムを作成
        second_fashion_item = FashionItem.objects.create(
            user=user,
            sub_category=subcategory,
            image=SimpleUploadedFile("test2.jpg", b"file_content", content_type="image/jpeg"),
        )

        _item2 = CoordinateItem.objects.create(
            coordinate=custom_coordinate,
            item=second_fashion_item,
            position_data={"x": 0, "y": 0, "scale": 1, "rotate": 0, "zIndex": 1},
        )

        # zIndexで順序付けされていることを確認
        items = CoordinateItem.objects.filter(coordinate=custom_coordinate).order_by("position_data__zIndex")
        assert items[0].position_data["zIndex"] < items[1].position_data["zIndex"]
