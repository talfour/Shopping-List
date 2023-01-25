"""
Tests for the items API.
"""
from django.contrib.auth import get_user_model
from django.urls import reverse
from django.utils import timezone
from django.test import TestCase


from rest_framework import status
from rest_framework.test import APIClient

from core.models import Item

from shopping_list.serializers import ItemSerializer


ITEMS_URL = reverse("shopping_list:item-list")


def detail_url(item_id):
    """Create and return an item detail URL"""
    return reverse("shopping_list:item-detail", args=[item_id])


def create_user(email="user@example.com", password="testpass123"):
    """Create and return user."""
    return get_user_model().objects.create(email=email, password=password)


class PublicItemApiTest(TestCase):
    """Test unauthenticated API requests."""

    def setUp(self):
        self.client = APIClient()

    def test_auth_required(self):
        """Test auth is required for retrieving items."""
        res = self.client.get(ITEMS_URL)

        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)


class PrivateItemApiTest(TestCase):
    """Test authenticated API requests."""

    def setUp(self):
        self.user = create_user()
        self.client = APIClient()
        self.client.force_authenticate(self.user)

    def test_retrieve_items(self):
        """Test retrieving a list of items."""
        Item.objects.create(user=self.user, name="Pasta")
        Item.objects.create(user=self.user, name="Milk")

        res = self.client.get(ITEMS_URL)

        items = Item.objects.all().order_by("-name")
        serializer = ItemSerializer(items, many=True)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)

    def test_item_limited_to_user(self):
        """Test list of items is limited to authenticated user."""
        user2 = create_user(email="user2@example.com")
        Item.objects.create(user=user2, name="Salt", food_type="spices")
        item = Item.objects.create(
            user=self.user, name="Carrot", food_type="vegetables"
        )

        res = self.client.get(ITEMS_URL)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 1)
        self.assertEqual(res.data[0]["name"], item.name)
        self.assertEqual(res.data[0]["id"], item.id)
        self.assertEqual(res.data[0]["food_type"], item.food_type)

    def test_update_item(self):
        """Test updating an item."""
        item = Item.objects.create(user=self.user, name="Salad", food_type="vegetables")

        payload = {
            "name": "Pork",
            "food_type": "meat and poultry",
            "last_time_used": timezone.now(),
        }
        url = detail_url(item.id)
        res = self.client.patch(url, payload)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        item.refresh_from_db()
        self.assertEqual(item.name, payload['name'])
        self.assertEqual(item.food_type, payload["food_type"])
        self.assertEqual(item.last_time_used.date(), payload["last_time_used"].date())
