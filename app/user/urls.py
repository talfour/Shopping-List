"""
URL mappings for the user API.
"""
from django.urls import path

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)


from user import views


app_name = "user"

urlpatterns = [
    path("create/", views.CreateUserView.as_view(), name="create"),
    path("token/", views.MyTokenObtainPairView.as_view(), name="token-obtain"),
    path("token/refresh", TokenRefreshView.as_view(), name="token-refresh"),
    path("me/", views.ManageUserView.as_view(), name="me"),
]
