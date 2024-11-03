"""
パスワードバリデーターのテスト
パスワードの複雑性要件の検証を行う
"""

import pytest
from django.core.exceptions import ValidationError

from apps.accounts.tests.validators.base import BaseValidatorTest
from apps.accounts.validators.custom_password_validators import ComplexPasswordValidator


class TestComplexPasswordValidator(BaseValidatorTest):
    """パスワードの複雑性要件をテストするクラス"""

    @pytest.fixture(autouse=True)
    def setup(self):
        """バリデーターインスタンスを準備"""
        self.validator = ComplexPasswordValidator()

    @pytest.mark.parametrize(
        "password,is_valid",
        [
            # 正常系: 大文字、小文字、数字を含む有効なパスワード
            ("Test1password", True),
            ("Password123", True),
            # 異常系: 各要件を満たさないパターン
            ("nocapital1", False),  # 大文字なし
            ("NOCAPITAL1", False),  # 小文字なし
            ("Passwordabc", False),  # 数字なし
            ("Test111password", False),  # 数字の連続
            ("Testaaa123", False),  # 文字の連続
        ],
    )
    def test_password_validation(self, password, is_valid):
        """パスワードバリデーションの各パターンをテスト"""
        if is_valid:
            self.validator.validate(password)
        else:
            with pytest.raises(ValidationError):
                self.validator.validate(password)

    def test_get_help_text(self):
        """ヘルプテキストの検証"""
        help_text = self.validator.get_help_text()
        assert isinstance(help_text, str)
        assert len(help_text) > 0
