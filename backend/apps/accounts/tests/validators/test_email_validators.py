"""
メールアドレスバリデーターのテスト
メールアドレスの一意性の検証を行う
"""

import pytest

from apps.accounts.exceptions import EmailAlreadyExistsError
from apps.accounts.tests.validators.base import BaseValidatorTest
from apps.accounts.validators.email_validators import validate_unique_email


class TestEmailValidator(BaseValidatorTest):
    """メールアドレスの一意性をテストするクラス"""

    @pytest.fixture
    def active_user(self, db):
        """アクティブユーザーを作成"""
        return self.create_test_user("test@example.com", is_active=True)

    @pytest.fixture
    def inactive_user(self, db):
        """非アクティブユーザーを作成"""
        return self.create_test_user("inactive@example.com", is_active=False)

    @pytest.mark.parametrize(
        "email,should_pass",
        [
            ("new@example.com", True),  # 新規メールアドレス
            ("test@example.com", False),  # アクティブユーザーの既存メール
        ],
    )
    def test_validate_unique_email(self, db, active_user, email, should_pass):
        """メールアドレスの一意性検証"""
        if should_pass:
            assert validate_unique_email(email) == email
        else:
            with pytest.raises(EmailAlreadyExistsError):
                validate_unique_email(email)

    def test_validate_unique_email_with_inactive_user(self, inactive_user):
        """非アクティブユーザーのメールアドレス再利用を検証"""
        email = inactive_user.email
        assert validate_unique_email(email) == email
