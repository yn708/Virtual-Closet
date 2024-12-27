from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

from .swagger import schema_view

# Swagger関連のURL群
swagger_patterns = [
    path("swagger<format>/", schema_view.without_ui(cache_timeout=0), name="schema-json"),
    path("swagger/", schema_view.with_ui("swagger", cache_timeout=0), name="schema-swagger-ui"),
    path("redoc/", schema_view.with_ui("redoc", cache_timeout=0), name="schema-redoc"),
]

urlpatterns = [
    # 管理画面
    path("admin/", admin.site.urls),
    # swagger（API仕様書）
    *swagger_patterns,
    # 認証関連のURL
    path("accounts/", include("allauth.urls")),  # allauth による認証機能へのルーティング 必須
    path("api/auth/", include("apps.accounts.urls")),  # 認証、ユーザー関連
    # アプリ
    path("api/image/", include("apps.image_processing.urls")),
    path("api/fashion-items/", include("apps.fashion_items.urls")),
    path("api/coordinate/", include("apps.coordinate.urls")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)  # 画像の保存先をローカルに設定しているため、後々変更
