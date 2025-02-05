import os
from datetime import timedelta
from pathlib import Path
from urllib.parse import urlparse

import environ

BASE_DIR = Path(__file__).resolve().parent.parent

env = environ.Env()
environ.Env.read_env(BASE_DIR / ".env")

SECRET_KEY = env("DJANGO_SECRET_KEY")
DEBUG = env.bool("DJANGO_DEBUG", default=False)


# -------------------- 環境に応じたホスト等の設定 --------------------
if DEBUG:  # 開発環境
    ALLOWED_HOSTS = ["*"]
    CORS_ALLOWED_ORIGINS = ["http://localhost:4000", "http://fronted:4000"]
    CSRF_TRUSTED_ORIGINS = ["http://localhost:4000", "http://fronted:4000"]

else:  # 本番環境
    ALLOWED_HOSTS = env.list("ALLOWED_HOSTS")
    CORS_ALLOWED_ORIGINS = env.list("CORS_ALLOWED_ORIGINS")
    CSRF_TRUSTED_ORIGINS = env.list("CSRF_TRUSTED_ORIGINS")


# 自動的にURLにスラッシュを入れてくれる設定
APPEND_SLASH = True

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # 追加
    "corsheaders",
    # 認証系
    "django.contrib.sites",
    "rest_framework",
    "rest_framework.authtoken",
    "dj_rest_auth",
    "dj_rest_auth.registration",
    "allauth",
    "allauth.account",
    "allauth.socialaccount",
    "allauth.socialaccount.providers.google",
    # swagger
    "drf_yasg",
    # AWS関連
    "storages",
    # 作成app
    "apps.accounts",
    "apps.image_processing",
    "apps.fashion_items",
    "apps.coordinate",
    "apps.contact",
]


# -------------------- allauth設定 --------------------
# Googleプロバイダー設定
SOCIALACCOUNT_PROVIDERS = {
    "google": {
        "SCOPE": [
            "profile",
            "email",
        ],
        "AUTH_PARAMS": {
            "access_type": "online",
        },
    }
}

# その他詳細設定
SOCIALACCOUNT_EMAIL_VERIFICATION = "optional"  # メール確認を提案、強制なし
SOCIALACCOUNT_EMAIL_REQUIRED = True  # メールアドレスの提供を必須

ACCOUNT_EMAIL_REQUIRED = True  # メールアドレスを必須に
ACCOUNT_AUTHENTICATION_METHOD = "email"  # メールアドレスでの認証を有効に
ACCOUNT_USERNAME_REQUIRED = False  # 登録時にユーザー名不要に。あとで設定を行う
ACCOUNT_EMAIL_VERIFICATION = "none"  # 認証コード確認のため不要
ACCOUNT_EMAIL_SUBJECT_PREFIX = "Virtual Closet - "  # 確認メールの件名プレフィックス

# 本番環境ではにフロントエンドURLはenvから取得すること
FRONTEND_URL = env("FRONTEND_URL", default="http://localhost:4000")
SITE_NAME = env("SITE_NAME", default="Virtual Closet")

# -------------------- dj_rest_auth設定 --------------------
SITE_ID = 1
REST_AUTH = {
    "USE_JWT": True,  # JWT認証を使用
    "PASSWORD_RESET_USE_SITES_DOMAIN": False,
    "PASSWORD_RESET_SERIALIZER": "apps.accounts.serializers.password_reset_serializers.CustomPasswordResetSerializer",
    "PASSWORD_RESET_CONFIRM_SERIALIZER": "apps.accounts.serializers.password_reset_serializers.CustomPasswordResetConfirmSerializer",
    "OLD_PASSWORD_FIELD_ENABLED": True,
}

# -------------------- REST Framework設定 --------------------
REST_FRAMEWORK = {
    "DEFAULT_PERMISSION_CLASSES": ["rest_framework.permissions.IsAuthenticated"],
    "DEFAULT_AUTHENTICATION_CLASSES": ("dj_rest_auth.jwt_auth.JWTCookieAuthentication",),
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 10,  # 1ページあたりの件数
}

# -------------------- Simple JWT設定 --------------------
SIMPLE_JWT = {
    "AUTH_HEADER_TYPES": ("Bearer"),
    "ACCESS_TOKEN_LIFETIME": timedelta(hours=1),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=30),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "UPDATE_LAST_LOGIN": True,
    "USER_ID_FIELD": "userId",
    "USER_ID_CLAIM": "user_id",
}

# -------------------- 認証モデル設定 --------------------
AUTH_USER_MODEL = "accounts.CustomUser"

# -------------------- MIDDLEWARE --------------------
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "allauth.account.middleware.AccountMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
]

ROOT_URLCONF = "config.urls"

# -------------------- TEMPLATES --------------------
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [
            os.path.join(BASE_DIR, "templates"),  # プロジェクトレベルのテンプレート
        ],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"

# アップロードするファイルサイズの最大値(2MB)
MAX_FILE_SIZE_LIMIT = 2000000

# -------------------- 環境別設定 --------------------
if DEBUG:  # 開発環境
    # -------------------- データベース設定（開発環境） --------------------
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql_psycopg2",
            "NAME": env("POSTGRES_DB"),
            "HOST": env("POSTGRES_HOST", default="db"),
            "PORT": env("POSTGRES_PORT", default=5432),
            "USER": env("POSTGRES_USER"),
            "PASSWORD": env("POSTGRES_PASSWORD"),
            "ATOMIC_REQUESTS": True,
            "TIME_ZONE": env("TZ", default="Asia/Tokyo"),
            "TEST": {
                "NAME": env("POSTGRES_DB") + "_test",  # テスト用DBの名前
                "CHARSET": "UTF8",
                # テスト時のみの設定
                "MIRROR": "default",  # デフォルトDBの設定をミラー
                "SERIALIZE": False,  # テストの高速化
            },
        }
    }
    # -------------------- Email設定（開発環境） --------------------
    # 開発時はメール送信先をコンソールへ出力
    EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
    EMAIL_HOST = "smtp.gmail.com"
    EMAIL_PORT = 587
    EMAIL_USE_TLS = True
    EMAIL_HOST_USER = env("EMAIL_HOST_USER")
    EMAIL_HOST_PASSWORD = env("EMAIL_HOST_PASSWORD")
    DEFAULT_FROM_EMAIL = env("DEFAULT_FROM_EMAIL", default=EMAIL_HOST_USER)

    # -------------------- 静的／メディアファイル設定（開発環境） --------------------
    # ローカル保存用
    DEFAULT_FILE_STORAGE = "django.core.files.storage.FileSystemStorage"
    MEDIA_URL = "/media/"
    MEDIA_ROOT = BASE_DIR / "media"

    STATIC_URL = "/static/"
    STATIC_ROOT = BASE_DIR / "static"


else:  # 本番環境
    # -------------------- データベース設定（本番環境） --------------------
    tmpPostgres = urlparse(os.getenv("DATABASE_URL"))
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": tmpPostgres.path.replace("/", ""),
            "USER": tmpPostgres.username,
            "PASSWORD": tmpPostgres.password,
            "HOST": tmpPostgres.hostname,
            "PORT": 5432,
        }
    }

    # -------------------- Email設定（本番環境） --------------------
    EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
    EMAIL_HOST = env("EMAIL_HOST", default="smtp.gmail.com")
    EMAIL_PORT = env.int("EMAIL_PORT", default=587)
    EMAIL_USE_TLS = env.bool("EMAIL_USE_TLS", default=True)
    EMAIL_HOST_USER = env("EMAIL_HOST_USER")
    EMAIL_HOST_PASSWORD = env("EMAIL_HOST_PASSWORD")
    DEFAULT_FROM_EMAIL = env("DEFAULT_FROM_EMAIL", default=EMAIL_HOST_USER)

    # -------------------- AWS S3／CloudFront設定（本番環境） --------------------
    DEFAULT_FILE_STORAGE = "storages.backends.s3boto3.S3Boto3Storage"
    AWS_ACCESS_KEY_ID = env("AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY = env("AWS_SECRET_ACCESS_KEY")
    AWS_STORAGE_BUCKET_NAME = env("AWS_STORAGE_BUCKET_NAME")
    AWS_S3_REGION_NAME = env("AWS_S3_REGION_NAME")
    AWS_S3_CUSTOM_DOMAIN = env("AWS_S3_CUSTOM_DOMAIN")

    STATIC_URL = "/static/"
    STATIC_ROOT = BASE_DIR / "static"
    STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"


# -------------------- その他環境依存しない設定 --------------------
# LINE Messaging API設定
LINE_CHANNEL_ACCESS_TOKEN = env("LINE_CHANNEL_ACCESS_TOKEN")
LINE_CHANNEL_SECRET = env("LINE_CHANNEL_SECRET")
LINE_USER_ID = env("LINE_USER_ID")

# NextAuth（Google認証）設定
SOCIAL_AUTH_GOOGLE_CLIENT_ID = env("GOOGLE_CLIENT_ID")
SOCIAL_AUTH_GOOGLE_SECRET = env("GOOGLE_CLIENT_SECRET")
SITE_DOMAIN = env("SITE_DOMAIN", default="example.com")

# superuser作成用
SUPERUSER_NAME = env("SUPERUSER_NAME")
SUPERUSER_EMAIL = env("SUPERUSER_EMAIL")
SUPERUSER_PASSWORD = env("SUPERUSER_PASSWORD")


# -------------------- AUTH_PASSWORD_VALIDATORS --------------------
AUTH_PASSWORD_VALIDATORS = [
    {
        # ユーザーの属性（名前やメールアドレスなど）と類似しているパスワードを禁止するバリデータ
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        # パスワードの最低文字数を8文字に制限するバリデータ
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
        "OPTIONS": {
            "min_length": 8,  # 最低文字数の設定
        },
    },
    {
        # よく使われる一般的なパスワードを禁止するバリデータ
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        # 数字のみのパスワードを禁止するバリデータ
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
    {
        # 独自の複雑なパスワードバリデーションルールを追加するバリデータ
        "NAME": "apps.accounts.validators.custom_password_validators.ComplexPasswordValidator",
    },
]


LANGUAGE_CODE = "ja"
TIME_ZONE = env("TZ", default="Asia/Tokyo")
USE_I18N = True
USE_TZ = True

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
