import pytest

from apps.contact.serializers import AnonymousContactSerializer, AuthenticatedContactSerializer


class TestBaseContactSerializer:
    """ContactSerializerのベーステストクラス"""

    @pytest.fixture
    def valid_message(self):
        """有効なメッセージデータ"""
        return "これは10文字以上のテストメッセージです。"

    @pytest.fixture
    def valid_subject(self):
        """有効な件名データ"""
        return "テスト件名"


class TestAnonymousContactSerializer(TestBaseContactSerializer):
    """AnonymousContactSerializerのテストクラス"""

    @pytest.fixture
    def valid_data(self, valid_message, valid_subject):
        """有効な匿名問い合わせデータ"""
        return {
            "name": "テストユーザー",
            "email": "test@example.com",
            "subject": valid_subject,
            "message": valid_message,
        }

    def test_valid_data(self, valid_data):
        """正常系: 有効なデータでの検証"""
        serializer = AnonymousContactSerializer(data=valid_data)
        assert serializer.is_valid()
        assert serializer.errors == {}

    def test_name_validation(self, valid_data):
        """異常系: 名前フィールドのバリデーション"""
        # 必須チェック
        data = {**valid_data}
        data.pop("name")
        serializer = AnonymousContactSerializer(data=data)
        assert not serializer.is_valid()
        assert "name" in serializer.errors
        assert serializer.errors["name"][0] == "名前は必須です。"

        # 最大長チェック
        data = {**valid_data, "name": "あ" * 21}
        serializer = AnonymousContactSerializer(data=data)
        assert not serializer.is_valid()
        assert "name" in serializer.errors
        assert serializer.errors["name"][0] == "名前は20文字以内で入力してください。"

    def test_email_validation(self, valid_data):
        """異常系: メールアドレスフィールドのバリデーション"""
        # 必須チェック
        data = {**valid_data}
        data.pop("email")
        serializer = AnonymousContactSerializer(data=data)
        assert not serializer.is_valid()
        assert "email" in serializer.errors
        assert serializer.errors["email"][0] == "メールアドレスは必須です。"

        # 形式チェック
        data = {**valid_data, "email": "invalid-email"}
        serializer = AnonymousContactSerializer(data=data)
        assert not serializer.is_valid()
        assert "email" in serializer.errors
        assert serializer.errors["email"][0] == "有効なメールアドレスを入力してください。"

    def test_subject_validation(self, valid_data):
        """異常系: 件名フィールドのバリデーション"""
        # 必須チェック
        data = {**valid_data}
        data.pop("subject")
        serializer = AnonymousContactSerializer(data=data)
        assert not serializer.is_valid()
        assert "subject" in serializer.errors
        assert serializer.errors["subject"][0] == "件名は必須です。"

        # 最大長チェック
        data = {**valid_data, "subject": "あ" * 201}
        serializer = AnonymousContactSerializer(data=data)
        assert not serializer.is_valid()
        assert "subject" in serializer.errors
        assert serializer.errors["subject"][0] == "件名は200文字以内で入力してください。"

    def test_message_validation(self, valid_data):
        """異常系: メッセージフィールドのバリデーション"""
        # 必須チェック
        data = {**valid_data}
        data.pop("message")
        serializer = AnonymousContactSerializer(data=data)
        assert not serializer.is_valid()
        assert "message" in serializer.errors
        assert serializer.errors["message"][0] == "お問い合わせ内容は必須です。"

        # 最小長チェック
        data = {**valid_data, "message": "短すぎる"}
        serializer = AnonymousContactSerializer(data=data)
        assert not serializer.is_valid()
        assert "message" in serializer.errors
        assert serializer.errors["message"][0] == "お問い合わせ内容は10文字以上で入力してください。"

        # 最大長チェック
        data = {**valid_data, "message": "あ" * 701}
        serializer = AnonymousContactSerializer(data=data)
        assert not serializer.is_valid()
        assert "message" in serializer.errors
        assert serializer.errors["message"][0] == "お問い合わせ内容は700文字以内で入力してください。"

    def test_message_stripping(self, valid_data):
        """正常系: メッセージの前後の空白が除去されることを確認"""
        data = {**valid_data, "message": "  " + valid_data["message"] + "  "}
        serializer = AnonymousContactSerializer(data=data)
        assert serializer.is_valid()
        assert serializer.validated_data["message"] == valid_data["message"]


class TestAuthenticatedContactSerializer(TestBaseContactSerializer):
    """AuthenticatedContactSerializerのテストクラス"""

    @pytest.fixture
    def valid_data(self, valid_message, valid_subject):
        """有効な認証済みユーザーの問い合わせデータ"""
        return {"subject": valid_subject, "message": valid_message}

    def test_valid_data(self, valid_data):
        """正常系: 有効なデータでの検証"""
        serializer = AuthenticatedContactSerializer(data=valid_data)
        assert serializer.is_valid()
        assert serializer.errors == {}

    def test_subject_validation(self, valid_data):
        """異常系: 件名フィールドのバリデーション"""
        # 必須チェック
        data = {**valid_data}
        data.pop("subject")
        serializer = AuthenticatedContactSerializer(data=data)
        assert not serializer.is_valid()
        assert "subject" in serializer.errors
        assert serializer.errors["subject"][0] == "件名は必須です。"

        # 最大長チェック
        data = {**valid_data, "subject": "あ" * 201}
        serializer = AuthenticatedContactSerializer(data=data)
        assert not serializer.is_valid()
        assert "subject" in serializer.errors
        assert serializer.errors["subject"][0] == "件名は200文字以内で入力してください。"

    def test_message_validation(self, valid_data):
        """異常系: メッセージフィールドのバリデーション"""
        # 必須チェック
        data = {**valid_data}
        data.pop("message")
        serializer = AuthenticatedContactSerializer(data=data)
        assert not serializer.is_valid()
        assert "message" in serializer.errors
        assert serializer.errors["message"][0] == "お問い合わせ内容は必須です。"

        # 最小長チェック
        data = {**valid_data, "message": "短すぎる"}
        serializer = AuthenticatedContactSerializer(data=data)
        assert not serializer.is_valid()
        assert "message" in serializer.errors
        assert serializer.errors["message"][0] == "お問い合わせ内容は10文字以上で入力してください。"

        # 最大長チェック
        data = {**valid_data, "message": "あ" * 701}
        serializer = AuthenticatedContactSerializer(data=data)
        assert not serializer.is_valid()
        assert "message" in serializer.errors
        assert serializer.errors["message"][0] == "お問い合わせ内容は700文字以内で入力してください。"

    def test_message_stripping(self, valid_data):
        """正常系: メッセージの前後の空白が除去されることを確認"""
        data = {**valid_data, "message": "  " + valid_data["message"] + "  "}
        serializer = AuthenticatedContactSerializer(data=data)
        assert serializer.is_valid()
        assert serializer.validated_data["message"] == valid_data["message"]
