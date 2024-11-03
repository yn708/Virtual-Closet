from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions

schema_view = get_schema_view(
    openapi.Info(
        title="Virtual Closet API",
        default_version="v1",
        description="APIドキュメント",
    ),
    public=False,
    permission_classes=(permissions.IsAuthenticated,),
)
