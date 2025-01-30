from dj_rest_auth.registration.serializers import RegisterSerializer

from ..validators.email_validators import validate_unique_email


class CustomRegisterSerializer(RegisterSerializer):
    """Emailサインアップ時に使用するカスタムシリアライザー"""

    def validate_email(self, value):
        """
        登録時にEmailが重複していないかチェック
        """
        return validate_unique_email(value)
