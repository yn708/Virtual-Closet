from django.urls import path

from .views import AnonymousContactAPIView, AuthenticatedContactAPIView

app_name = "contact"

urlpatterns = [
    path("anonymous/", AnonymousContactAPIView.as_view(), name="anonymous-contact"),
    path("authenticated/", AuthenticatedContactAPIView.as_view(), name="authenticated-contact"),
]
