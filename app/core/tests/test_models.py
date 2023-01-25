"""
Tests for models.
"""
from django.test import TestCase
from django.contrib.auth import get_user_model

from core import models


def create_user(**params):
    """Create an user"""
    defaults = {"email": "test@example.com", "password": "testpass123"}
    defaults.update(params)
    user = get_user_model().objects.create_user(**defaults)
    return user


class ModelTests(TestCase):
    """Test models."""

    def test_create_user_with_email_successful(self):
        """Test creating a user with an email is successful."""
        email = "test@example.com"
        password = "testpass123"
        user = create_user(
            email=email,
            password=password,
        )

        self.assertEqual(user.email, email)
        self.assertTrue(user.check_password(password))

    def test_new_user_email_normalized(self):
        """Test email is normalized for new users."""
        sample_emails = [
            ["test1@EXAMPLE.com", "test1@example.com"],
            ["Test2@Example.com", "Test2@example.com"],
            ["TEST3@EXAMPLE.COM", "TEST3@example.com"],
            ["test4@example.COM", "test4@example.com"],
        ]

        for email, expected in sample_emails:
            user = create_user(email=email, password="sample123")
            self.assertEqual(user.email, expected)

    def test_new_user_without_email_raises_error(self):
        """Test that creating a user without an email raises a ValueError."""
        with self.assertRaises(ValueError):
            create_user(email="", password="test123")

    def test_create_superuser(self):
        """Test creating a superuser."""
        user = get_user_model().objects.create_superuser(
            "test@example.com", "test123admin"
        )
        self.assertTrue(user.is_superuser)
        self.assertTrue(user.is_staff)

    def test_create_shopping_list(self):
        """Test creating a shopping list is successful."""
        user = create_user(email="test@example.com", password="testpass234")
        shopping_list = models.ShoppingList.objects.create(
            user=user, title="Sample shopping list", description="Sample description"
        )

        self.assertEqual(str(shopping_list), shopping_list.title)

    def test_create_items(self):
        """Test creating an item is successful."""
        user = create_user()
        item = models.Item.objects.create(user=user, name="Item1")

        self.assertEqual(str(item), item.name)
