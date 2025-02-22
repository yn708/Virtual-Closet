"""検証サービスのテスト"""

from unittest.mock import patch

import pytest
from django.contrib.auth import get_user_model
from freezegun import freeze_time

from apps.accounts.exceptions import (
    ExpiredVerificationCodeError,
)
from apps.accounts.services.verification_service import VerificationService
from apps.accounts.tests.services.base import BaseServiceTest

User = get_user_model()


class TestVerificationService(BaseServiceTest):
    """検証サービスのテスト"""

    def test_confirmation_code_generation(self, db):
        """確認コード生成のテスト"""
        with patch("random.randint", return_value=1):
            code = VerificationService.generate_confirmation_code()
            assert code == "111111"

    @freeze_time("2024-01-01 12:00:00")
    def test_code_verification(self, inactive_user):
        """コード検証のテスト"""
        with patch.object(User, "check_confirmation_code", return_value="ok"):
            VerificationService.verify_confirmation_code(inactive_user, "123456")

        with patch.object(User, "check_confirmation_code", return_value="expired"):
            with pytest.raises(ExpiredVerificationCodeError):
                VerificationService.verify_confirmation_code(inactive_user, "123456")
