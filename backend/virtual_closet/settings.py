import os
from pathlib import Path

import environ

BASE_DIR = Path(__file__).resolve().parent.parent

env = environ.Env()
env.read_env(os.path.join(BASE_DIR, ".env"))

SECRET_KEY = env("DJANGO_SECRET_KEY")
DEBUG = env("DJANGO_DEBUG") == "True"

ALLOWED_HOSTS = env("DJANGO_ALLOWED_HOSTS").split(" ")

# 自動的にURLにスラッシュを入れてくれる設定
APPEND_SLASH = True


# Application definition

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "virtual_closet.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
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

WSGI_APPLICATION = "virtual_closet.wsgi.application"


DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql_psycopg2",
        "NAME": env("POSTGRES_DB"),
        "HOST": env("POSTGRES_HOST"),
        "PORT": env("POSTGRES_PORT"),
        "USER": env("POSTGRES_USER"),
        "PASSWORD": env("POSTGRES_PASSWORD"),
        "ATOMIC_REQUESTS": True,  # トランザクション有効化
        "TIME_ZONE": env("TZ"),
    }
}


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
        "NAME": "virtual_closet.custom_password_validators.ComplexPasswordValidator",
    },
]


LANGUAGE_CODE = "ja"

TIME_ZONE = env("TZ")

USE_I18N = True

USE_TZ = True


# セッション設定
# SESSION_COOKIE_AGE = 3600 * 24
# SESSION_SAVE_EVERY_REQUEST = True
# SESSION_EXPIRE_AT_BROWSER_CLOSE = True


STATIC_URL = "static/"
STATIC_ROOT = f"/{BASE_DIR.name}/static"
MEDIA_URL = "/media/"
MEDIA_ROOT = f"/{BASE_DIR.name}/media"


DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
