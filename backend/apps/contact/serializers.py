from rest_framework import serializers


class AnonymousContactSerializer(serializers.Serializer):
    name = serializers.CharField(
        max_length=20,
        error_messages={"required": "名前は必須です。", "max_length": "名前は20文字以内で入力してください。"},
    )
    email = serializers.EmailField(
        error_messages={"required": "メールアドレスは必須です。", "invalid": "有効なメールアドレスを入力してください。"}
    )
    subject = serializers.CharField(
        max_length=200,
        error_messages={"required": "件名は必須です。", "max_length": "件名は200文字以内で入力してください。"},
    )
    message = serializers.CharField(
        max_length=700,
        error_messages={
            "required": "お問い合わせ内容は必須です。",
            "max_length": "お問い合わせ内容は700文字以内で入力してください。",
        },
    )

    def validate_message(self, value):
        """メッセージの追加バリデーション"""
        if len(value.strip()) < 10:
            raise serializers.ValidationError("お問い合わせ内容は10文字以上で入力してください。")
        return value.strip()


class AuthenticatedContactSerializer(serializers.Serializer):
    subject = serializers.CharField(
        max_length=200,
        error_messages={"required": "件名は必須です。", "max_length": "件名は200文字以内で入力してください。"},
    )
    message = serializers.CharField(
        max_length=700,
        error_messages={
            "required": "お問い合わせ内容は必須です。",
            "max_length": "お問い合わせ内容は700文字以内で入力してください。",
        },
    )

    def validate_message(self, value):
        """メッセージの追加バリデーション"""
        if len(value.strip()) < 10:
            raise serializers.ValidationError("お問い合わせ内容は10文字以上で入力してください。")
        return value.strip()
