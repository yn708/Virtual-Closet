from rest_framework import serializers


class VerificationCodeSerializer(serializers.Serializer):
    """確認コード検証用シリアライザー"""

    email = serializers.EmailField()
    confirmation_code = serializers.CharField()


class UserVerificationResponseSerializer(serializers.Serializer):
    """ユーザー検証レスポンス用シリアライザー"""

    id = serializers.CharField(source="userId")
    email = serializers.EmailField()
    username = serializers.CharField()
