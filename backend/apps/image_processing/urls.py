from django.urls import path

from .views import remove_bg

urlpatterns = [
    path("remove-bg/", remove_bg, name="remove_bg"),
]
