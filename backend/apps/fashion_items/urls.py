from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import BrandSearchView, FashionItemCountView, FashionItemViewSet, MetaDataView

router = DefaultRouter()
router.register(r"items", FashionItemViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("metadata/", MetaDataView.as_view(), name="fashion_item_metadata"),
    path("brands/search/", BrandSearchView.as_view(), name="brand_search"),
    path("count/", FashionItemCountView.as_view(), name="fashion_item_count"),
]
