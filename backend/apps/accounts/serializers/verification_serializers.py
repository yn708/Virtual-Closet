from django.core.exceptions import ValidationError
from django.core.validators import validate_email as django_validate_email
from rest_framework import serializers

from ..exceptions import InvalidEmailFormatError


class VerificationCodeSerializer(serializers.Serializer):
    """確認コード検証用シリアライザー"""

    email = serializers.EmailField()
    confirmation_code = serializers.CharField()


class UserVerificationResponseSerializer(serializers.Serializer):
    """ユーザー検証レスポンス用シリアライザー"""

    id = serializers.CharField(source="userId")
    email = serializers.EmailField()
    username = serializers.CharField()


class EmailPasswordVerificationSerializer(serializers.Serializer):
    """メールアドレスとパスワードの検証用シリアライザー"""

    email = serializers.EmailField(
        error_messages={
            "required": "メールアドレスを入力してください。",
            "invalid": "有効なメールアドレスを入力してください。",
        }
    )
    password = serializers.CharField(error_messages={"required": "パスワードを入力してください。"})

    def validate_email(self, value):
        """メールアドレスの追加バリデーション"""

        try:
            django_validate_email(value)
            return value
        except ValidationError as err:
            raise InvalidEmailFormatError() from err
