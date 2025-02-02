from rest_framework import serializers

from apps.accounts.constants import IMAGE_SIZE_ERROR, MAX_IMAGE_SIZE

from ..models import CustomUser


# ユーザー詳細情報の取得や更新
class CustomUserDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ("username", "name", "birth_date", "gender", "profile_image", "height")


class UserUpdateSerializer(serializers.ModelSerializer):
    delete_profile_image = serializers.BooleanField(required=False, default=False)  # 画像削除する場合に使用
    delete_birth_date = serializers.BooleanField(required=False, default=False)  # 生年月日削除する場合に使用

    class Meta:
        model = CustomUser
        fields = [
            "username",
            "name",
            "birth_date",
            "gender",
            "height",
            "profile_image",
            "delete_profile_image",
            "delete_birth_date",
        ]

    def validate_profile_image(self, value):
        if value and value.size > MAX_IMAGE_SIZE:
            raise serializers.ValidationError(IMAGE_SIZE_ERROR)
        return value

    def _handle_profile_image_deletion(self, instance):
        """プロフィール画像の削除処理"""
        if instance.profile_image:
            # ファイルの削除はモデルのフィールドで指定したストレージ経由で実施
            instance.profile_image.storage.delete(instance.profile_image.name)
            instance.profile_image = None

    def update(self, instance, validated_data):
        # 削除フラグの処理
        if validated_data.pop("delete_profile_image", False):
            self._handle_profile_image_deletion(instance)

        if validated_data.pop("delete_birth_date", False):
            instance.birth_date = None

        return super().update(instance, validated_data)
