"""
Tests for shopping list API.
"""
from django.contrib.auth import get_user_model
from django.db.models import Q
from django.test import TestCase
from django.urls import reverse

from rest_framework import status
from rest_framework.test import APIClient

from core.models import ShoppingList

from shopping_list.serializers import (
    ShoppingListSerializer,
    ShoppingListDetailSerializer,
)


SHOPPING_LIST_URL = reverse("shopping_list:shopping_list-list")


def detail_url(shopping_list_id):
    """Create and return a shopping list detail URL."""
    return reverse("shopping_list:shopping_list-detail", args=[shopping_list_id])


def create_shopping_list(user, **params):
    """Create and return a sample shopping list"""
    defaults = {"title": "Sample shopping list", "description": "Sample description"}
    defaults.update(params)

    shopping_list = ShoppingList.objects.create(user=user, **defaults)
    return shopping_list


class PublicShoppingListAPITests(TestCase):
    """Test unauthenticated API requests."""

    def setUp(self):
        self.client = APIClient()

    def test_auth_required(self):
        """Test auth is required to call API."""
        res = self.client.get(SHOPPING_LIST_URL)

        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)


class PrivateRecipeApiTests(TestCase):
    """Test authenticated API requests."""

    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(
            "user@example.com", "testpass2123"
        )
        self.client.force_authenticate(self.user)

    def test_retrieve_shopping_lists(self):
        """Test retrieving a list of shopping lists"""
        create_shopping_list(user=self.user)
        create_shopping_list(user=self.user)

        res = self.client.get(SHOPPING_LIST_URL)

        shopping_lists = ShoppingList.objects.all().order_by("-id")
        serializer = ShoppingListSerializer(shopping_lists, many=True)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)

    def test_shopping_list_limited_to_user(self):
        """Test list of shopping lists are limited to authenticated user."""
        other_user = get_user_model().objects.create_user(
            "other@example.com", "pass1234"
        )
        create_shopping_list(user=other_user)
        create_shopping_list(user=self.user)

        shared_list = create_shopping_list(user=other_user)
        shared_list.additional_users.add(self.user)
        res = self.client.get(SHOPPING_LIST_URL)

        shopping_lists = ShoppingList.objects.filter(
            Q(user=self.user) | Q(additional_users=self.user)
        )
        serializer = ShoppingListSerializer(shopping_lists, many=True)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)

    def test_get_shopping_list_detail(self):
        """Test get shopping list details."""
        shopping_list = create_shopping_list(user=self.user)

        url = detail_url(shopping_list.id)
        res = self.client.get(url)

        serializer = ShoppingListDetailSerializer(shopping_list)
        self.assertEqual(res.data, serializer.data)
