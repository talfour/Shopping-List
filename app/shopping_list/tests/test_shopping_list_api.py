"""
Tests for shopping list API.
"""
from django.contrib.auth import get_user_model
from django.db.models import Q
from django.test import TestCase
from django.urls import reverse

from rest_framework import status
from rest_framework.test import APIClient

from core.models import ShoppingList, Item

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


def create_user(**params):
    """Create and return a new user"""
    return get_user_model().objects.create(**params)


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
        self.user = create_user(email="user@example.com", password="test123")
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
        other_user = create_user(email="other@example.com", password="pass1234")
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

    def test_create_shopping_list(self):
        """Test create shopping list"""
        payload = {"title": "Sample shopping", "description": "Test description"}
        res = self.client.post(SHOPPING_LIST_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        shopping_list = ShoppingList.objects.get(id=res.data["id"])
        for k, v in payload.items():
            self.assertEqual(getattr(shopping_list, k), v)
        self.assertEqual(shopping_list.user, self.user)

    def test_partial_update(self):
        """Test partial update of shopping list"""
        original_description = "test original"
        shopping_list = create_shopping_list(
            user=self.user, title="sample title", description=original_description
        )

        payload = {"title": "New list title"}
        url = detail_url(shopping_list.id)
        res = self.client.patch(url, payload)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        shopping_list.refresh_from_db()
        self.assertEqual(shopping_list.title, payload["title"])
        self.assertEqual(shopping_list.description, original_description)
        self.assertEqual(shopping_list.user, self.user)

    def test_full_update(self):
        """Test full update of shopping list."""
        shopping = create_shopping_list(
            user=self.user, title="Sample title", description="Sample description"
        )
        other_user = create_user(email="another@example.com", password="pass123")

        payload = {
            "title": "New shopping list",
            "description": "New sample description",
            "additional_users": [other_user.email],
        }
        url = detail_url(shopping.id)
        res = self.client.put(url, payload)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        shopping.refresh_from_db()
        for k, v in payload.items():
            if k != "additional_users":
                self.assertEqual(getattr(shopping, k), v)

        self.assertEqual(len(shopping.additional_users.all()), 1)
        self.assertEqual(shopping.user, self.user)

    def test_update_user_returns_error(self):
        """Test chaning the shopping list user results in an error."""
        new_user = create_user(email="user2@example.com", password="test123")
        shopping_list = create_shopping_list(user=self.user)

        payload = {"user": new_user.id}
        url = detail_url(shopping_list.id)
        self.client.patch(url, payload)

        shopping_list.refresh_from_db()
        self.assertEqual(shopping_list.user, self.user)

    def test_delete_shopping_list(self):
        """Test delete shopping list is successful."""
        shopping_list = create_shopping_list(user=self.user)

        url = detail_url(shopping_list.id)
        res = self.client.delete(url)

        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)

    def test_shopping_list_other_users_error(self):
        new_user = create_user(email="user2@example.com", password="testpassword")
        shopping_list = create_shopping_list(user=new_user)

        url = detail_url(shopping_list.id)
        res = self.client.delete(url)

        self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND)
        self.assertTrue(ShoppingList.objects.filter(id=shopping_list.id).exists())

    def test_create_shopping_list_with_new_items(self):
        """Test creating a shopping list with new items."""
        payload = {
            "title": "My new shopping list",
            "description": "Food to buy",
            "items": [
                {"name": "Cauliflower", "food_type": "vegetables"},
                {"name": "Salt", "food_type": "spices"},
            ],
        }
        res = self.client.post(SHOPPING_LIST_URL, payload, format="json")

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        shopping_lists = ShoppingList.objects.filter(user=self.user)
        self.assertEqual(shopping_lists.count(), 1)
        shopping_list = shopping_lists[0]
        self.assertEqual(shopping_list.items.count(), 2)
        for item in payload["items"]:
            exists = shopping_list.items.filter(
                name=item["name"], user=self.user
            ).exists()
            self.assertTrue(exists)

    def test_create_shopping_list_with_existing_item(self):
        """Test creating shopping list with existing item."""
        item = Item.objects.create(user=self.user, name="Lemon", food_type="fruits")
        payload = {
            "title": "My shopping list",
            "description": "Veggies to buy",
            "items": [{"name": "Lemon"}, {"name": "Oregano"}],
        }
        res = self.client.post(SHOPPING_LIST_URL, payload, format="json")

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        shopping_lists = ShoppingList.objects.filter(user=self.user)
        self.assertEqual(shopping_lists.count(), 1)
        shopping_list = shopping_lists[0]
        self.assertEqual(shopping_list.items.count(), 2)
        self.assertIn(item, shopping_list.items.all())
        for item in payload["items"]:
            exists = shopping_list.items.filter(
                name=item["name"], user=self.user
            ).exists()
            self.assertTrue(exists)

    def test_create_item_on_update(self):
        """Test creating an item when updating a shopping list"""
        shopping_list = create_shopping_list(user=self.user)

        payload = {"items": [{"name": "Sugar"}]}
        url = detail_url(shopping_list.id)
        res = self.client.patch(url, payload, format="json")

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        new_item = Item.objects.get(user=self.user, name="Sugar")
        self.assertIn(new_item, shopping_list.items.all())

    def test_update_shopping_list_assign_item(self):
        """Test assigning an existing item when updating a shopping list."""
        item1 = Item.objects.create(user=self.user, name="Pepper")
        shopping_list = create_shopping_list(user=self.user)
        shopping_list.items.add(item1)

        item2 = Item.objects.create(user=self.user, name="Chili")
        payload = {"items": [{"name": "Chili"}]}
        url = detail_url(shopping_list.id)
        res = self.client.patch(url, payload, format="json")

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn(item2, shopping_list.items.all())
        self.assertNotIn(item1, shopping_list.items.all())

    def test_clear_shopping_list_items(self):
        """Test clearing a shopping list items."""
        item = Item.objects.create(user=self.user, name="Thyme")
        shopping_list = create_shopping_list(user=self.user)
        shopping_list.items.add(item)

        payload = {"ingredients": []}
        url = detail_url(shopping_list.id)
        res = self.client.patch(url, payload, format="json")

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(shopping_list.items.count(), 0)
