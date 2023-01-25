"""
URL mapping for the recipe app.
"""
from django.urls import path, include

from rest_framework.routers import DefaultRouter

from shopping_list import views


router = DefaultRouter()
router.register("shopping_lists", views.ShoppingListViewSet, basename="shopping_list")
router.register('items', views.ItemViewSet)

app_name = "shopping_list"

urlpatterns = [path("", include(router.urls))]
