"""
URL mappings for the user API.
"""
from django.urls import path

from user import views


app_name = "user"

urlpatterns = [
    path("create", views.CreateUserView.as_view(), name="create"),
    path("me", views.ManageUserView.as_view(), name="me"),
    path("login", views.loginView),
    path("refresh-token", views.CookieTokenRefreshView.as_view()),
    path("logout", views.logoutView),
]
