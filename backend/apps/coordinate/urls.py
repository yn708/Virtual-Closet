from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.coordinate.views import CustomCoordinateViewSet, PhotoCoordinateViewSet

from .views import MetaDataView

router = DefaultRouter()
router.register(r"photo-coordination", PhotoCoordinateViewSet, basename="photo-coordination")
router.register(r"custom-coordination", CustomCoordinateViewSet, basename="custom-coordination")

urlpatterns = [
    path("", include(router.urls)),
    path("metadata/", MetaDataView.as_view(), name="coordinate_metadata"),
]
