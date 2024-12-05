import pytest
from conftest import generate_unique_id
from django.db.utils import IntegrityError

from apps.fashion_items.models import Brand, Category, Color, Design, FashionItem, PriceRange, Season, SubCategory


@pytest.mark.django_db
class TestCategory:
    """Categoryモデルのテストクラス"""

    def test_create_category(self, category):
        """カテゴリーの作成テスト"""
        assert "トップス" in category.category_name
        assert str(category) == category.category_name

    def test_category_unique_id(self):
        """カテゴリーIDの一意性テスト"""
        unique_id = generate_unique_id()
        Category.objects.create(id=f"test_id_{unique_id}", category_name="Test Category")
        with pytest.raises(IntegrityError):
            Category.objects.create(id=f"test_id_{unique_id}", category_name="Another Category")


@pytest.mark.django_db
class TestSubCategory:
    """SubCategoryモデルのテストクラス"""

    def test_create_subcategory(self, subcategory, category):
        """サブカテゴリーの作成テスト"""
        assert "Tシャツ" in subcategory.subcategory_name
        assert subcategory.category == category
        assert str(subcategory) == subcategory.subcategory_name

    def test_category_cascade_delete(self, subcategory, category):
        """カテゴリー削除時の動作テスト"""
        subcategory_id = subcategory.id
        category.delete()
        with pytest.raises(SubCategory.DoesNotExist):
            SubCategory.objects.get(id=subcategory_id)


@pytest.mark.django_db
class TestBrand:
    """Brandモデルのテストクラス"""

    def test_create_brand(self, brand):
        """ブランドの作成テスト"""
        assert brand.brand_name
        assert brand.brand_name_kana
        assert isinstance(brand.is_popular, bool)
        assert str(brand) == brand.brand_name

    def test_brand_unique_name(self, brand):
        """ブランド名の一意性テスト"""
        with pytest.raises(IntegrityError):
            Brand.objects.create(brand_name=brand.brand_name, brand_name_kana="テスト")

    def test_default_is_popular(self):
        """is_popularのデフォルト値テスト"""
        brand = Brand.objects.create(brand_name=f"テストブランド_{generate_unique_id()}", brand_name_kana="テスト")
        assert brand.is_popular is False


@pytest.mark.django_db
class TestSeason:
    """Seasonモデルのテストクラス"""

    def test_create_season(self):
        """シーズンの作成テスト"""
        unique_id = generate_unique_id()
        season = Season.objects.create(id=f"test_season_{unique_id}", season_name=f"テストシーズン_{unique_id}")
        assert season.season_name
        assert str(season) == season.season_name

    def test_season_unique_name(self, season):
        """シーズン名の一意性テスト"""
        with pytest.raises(IntegrityError):
            Season.objects.create(id="different_id", season_name=season.season_name)


@pytest.mark.django_db
class TestDesign:
    """Designモデルのテストクラス"""

    def test_create_design(self, design):
        """デザインの作成テスト"""
        assert design.design_pattern
        assert str(design) == design.design_pattern

    def test_design_unique_pattern(self):
        """デザインパターンの一意性テスト"""
        unique_id = generate_unique_id()
        pattern = f"テストパターン_{unique_id}"
        Design.objects.create(id=f"test_id_1_{unique_id}", design_pattern=pattern)
        with pytest.raises(IntegrityError):
            Design.objects.create(id=f"test_id_2_{unique_id}", design_pattern=pattern)


@pytest.mark.django_db
class TestColor:
    """Colorモデルのテストクラス"""

    def test_create_color(self, color):
        """カラーの作成テスト"""
        assert color.color_name
        assert color.color_code
        assert str(color) == color.color_name

    def test_color_unique_name(self):
        """カラー名の一意性テスト"""
        unique_id = generate_unique_id()
        color_name = f"テストカラー_{unique_id}"
        Color.objects.create(id=f"test_id_1_{unique_id}", color_name=color_name, color_code="#000000")
        with pytest.raises(IntegrityError):
            Color.objects.create(id=f"test_id_2_{unique_id}", color_name=color_name, color_code="#FFFFFF")


@pytest.mark.django_db
class TestPriceRange:
    """PriceRangeモデルのテストクラス"""

    def test_create_price_range(self, price_range):
        """価格帯の作成テスト"""
        assert price_range.price_range
        assert str(price_range) == price_range.price_range

    def test_price_range_unique_range(self):
        """価格帯の一意性テスト"""
        unique_id = generate_unique_id()
        range_str = f"¥1,000〜¥2,000_{unique_id}"
        PriceRange.objects.create(id=f"test_id_1_{unique_id}", price_range=range_str)
        with pytest.raises(IntegrityError):
            PriceRange.objects.create(id=f"test_id_2_{unique_id}", price_range=range_str)


@pytest.mark.django_db
class TestFashionItem:
    """FashionItemモデルのテストクラス"""

    def test_create_fashion_item(self, fashion_item, user, subcategory, brand):
        """ファッションアイテムの作成テスト"""
        assert fashion_item.user == user
        assert fashion_item.sub_category == subcategory
        assert fashion_item.brand == brand
        assert fashion_item.is_owned is True
        assert fashion_item.is_old_clothes is False
        assert fashion_item.seasons.count() == 1

    def test_optional_fields(self, user, subcategory, sample_image):
        """任意フィールドのテスト"""
        item = FashionItem.objects.create(user=user, sub_category=subcategory, image=sample_image)
        assert item.brand is None
        assert item.price_range is None
        assert item.design is None
        assert item.main_color is None
        assert item.seasons.count() == 0

    def test_str_representation(self, fashion_item):
        """文字列表現のテスト"""
        expected = f"{fashion_item.brand.brand_name} - {fashion_item.sub_category.subcategory_name} (Owned)"
        assert str(fashion_item) == expected

    def test_user_cascade_delete(self, fashion_item, user):
        """ユーザー削除時の動作テスト"""
        fashion_item_id = fashion_item.id
        user.delete()
        with pytest.raises(FashionItem.DoesNotExist):
            FashionItem.objects.get(pk=fashion_item_id)

    def test_fashion_item_update(self, fashion_item):
        """アイテム更新のテスト"""
        fashion_item.is_old_clothes = True
        fashion_item.save()
        updated_item = FashionItem.objects.get(pk=fashion_item.id)
        assert updated_item.is_old_clothes is True
