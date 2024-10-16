import re

from django.core.exceptions import ValidationError


class ComplexPasswordValidator:
    def validate(self, password, user=None):
        if not re.search(r"[A-Z]", password):
            raise ValidationError("パスワードは少なくとも1つの大文字を含む必要があります。")
        if not re.search(r"[a-z]", password):
            raise ValidationError("パスワードは少なくとも1つの小文字を含む必要があります。")
        if not re.search(r"[0-9]", password):
            raise ValidationError("パスワードは少なくとも1つの数字を含む必要があります。")
        if re.search(r"(.)\1{2,}", password):
            raise ValidationError("パスワードに3回以上連続する文字を含めることはできません。")

    def get_help_text(self):
        return (
            "パスワードは大文字、小文字、数字を含み、3回以上連続する文字を含まない必要があります。"
        )
