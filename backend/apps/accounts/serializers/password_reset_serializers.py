from dj_rest_auth.serializers import PasswordResetConfirmSerializer, PasswordResetSerializer
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from rest_framework import serializers

User = get_user_model()


class CustomPasswordResetSerializer(PasswordResetSerializer):
    """
    パスワードリセット用シリアライザー
    Email送信
    """

    def validate_email(self, value):
        """カスタムのメールアドレス検証"""
        # 親クラスのvalidate_emailを呼び出し
        super().validate_email(value)

        # 追加のバリデーション
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("このメールアドレスに紐づくアカウントが存在しません。")
        return value

    def get_email_options(self):
        """メール送信オプションのカスタマイズ"""
        user = User.objects.get(email=self.validated_data["email"])

        # トークンとuidの生成
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))

        # リセットURLの生成
        reset_url = f"{settings.FRONTEND_URL}/auth/password/reset/{uid}/{token}"

        return {
            "subject_template_name": "account/email/password_reset/password_reset_subject.txt",
            "email_template_name": "account/email/password_reset/password_reset_email.txt",
            "html_email_template_name": "account/email/password_reset/password_reset_email.html",
            "extra_email_context": {
                "user": user,
                "reset_url": reset_url,
                "uid": uid,
                "token": token,
                "frontend_url": settings.FRONTEND_URL,
            },
        }

    def save(self):
        """
        パスワードリセットメールの送信処理
        """
        email = self.validated_data["email"]

        # メールのコンテキストを設定
        opts = self.get_email_options()
        context = opts["extra_email_context"]

        # メールテンプレートの読み込みと内容生成
        subject = render_to_string(opts["subject_template_name"], context).strip()
        text_content = render_to_string(opts["email_template_name"], context)
        html_content = render_to_string(opts["html_email_template_name"], context)

        # メールの送信
        msg = EmailMultiAlternatives(subject, text_content, settings.DEFAULT_FROM_EMAIL, [email])
        msg.attach_alternative(html_content, "text/html")
        msg.send()


class CustomPasswordResetConfirmSerializer(PasswordResetConfirmSerializer):
    """
    パスワードリセット確認用シリアライザー
    """

    def validate(self, attrs):
        """
        トークンとパスワードの検証
        """
        try:
            # UIDの検証とユーザーの取得
            uid = force_str(urlsafe_base64_decode(attrs["uid"]))
            self.user = User.objects.get(pk=uid)

            # トークンの検証
            if not default_token_generator.check_token(self.user, attrs["token"]):
                raise serializers.ValidationError({"token": ["パスワードリセットリンクが無効か期限切れです。"]})

            # パスワードの一致確認
            if attrs["new_password1"] != attrs["new_password2"]:
                raise serializers.ValidationError({"new_password2": ["パスワードが一致しません。"]})

            return attrs

        except (TypeError, ValueError, OverflowError, User.DoesNotExist) as err:
            raise serializers.ValidationError({"uid": ["無効なパスワードリセットリンクです。"]}) from err

    def save(self):
        """
        新しいパスワードの保存
        """
        password = self.validated_data["new_password1"]
        self.user.set_password(password)
        self.user.save()
        return self.user
