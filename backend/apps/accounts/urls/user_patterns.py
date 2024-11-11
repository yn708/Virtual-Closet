from django.urls import path

from ..views.user_views import UserDetailView, UserUpdateView

user_patterns = [
    path("detail/", UserDetailView.as_view(), name="user_detail"),
    path("update/", UserUpdateView.as_view(), name="user_update"),
]
