from rest_framework import status
from rest_framework.exceptions import APIException

"""Email"""


class EmailAlreadyExistsError(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = "このメールアドレスは既に使用されています。"
    default_code = "email_already_exists"


class InvalidEmailFormatError(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = "有効なメールアドレスを入力してください。"
    default_code = "invalid_email_format"


class AuthenticationFailedError(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = "メールアドレスまたはパスワードが正しくありません。"
    default_code = "authentication_failed"


class MissingCredentialsError(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = "メールアドレスとパスワードを入力してください。"
    default_code = "missing_credentials"


class GmailSignupNotAllowed(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = "Gmailアドレスでの登録はGoogleで登録をご利用ください。"
    default_code = "gmail_signup_not_allowed"


"""認証コード"""


class ConfirmationCodeError(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = "認証コードの生成に失敗しました。"
    default_code = "confirmation_code_error"


class InvalidVerificationCodeError(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = "無効な確認コードです。"
    default_code = "invalid_verification_code"


class ExpiredVerificationCodeError(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = "確認コードの有効期限が切れています。"
    default_code = "expired_verification_code"


"""認証、ユーザー関連"""


class InvalidCredentialsError(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = "認証情報が正しくありません。"
    default_code = "invalid_credentials"


class UserNotFoundError(APIException):
    status_code = status.HTTP_404_NOT_FOUND
    default_detail = "ユーザーが見つかりません。"
    default_code = "user_not_found"


class UserAlreadyActiveError(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = "このアカウントは既に有効化されています。"
    default_code = "user_already_active"
