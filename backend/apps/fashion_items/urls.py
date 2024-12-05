from django.urls import path

from .views import (
    BrandSearchView,
    MetaDataView,
    RegisterFashionItemView,
)

urlpatterns = [
    path("register/", RegisterFashionItemView.as_view(), name="fashion_item_register"),
    path("metadata/", MetaDataView.as_view(), name="fashion_item_metadata"),
    path("brands/search/", BrandSearchView.as_view(), name="brand_search"),
]
