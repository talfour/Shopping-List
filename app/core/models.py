"""
Database models.
"""
from django.conf import settings
from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.utils import timezone


class UserManager(BaseUserManager):
    """Manager for users."""

    def create_user(self, email, password=None, **extra_fields):
        """Create, save and return a new user."""
        if not email:
            raise ValueError("User must have an email address.")
        user = self.model(email=self.normalize_email(email), **extra_fields)
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, password=None):
        """Create, save and return a new superuser"""
        user = self.create_user(email, password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser, PermissionsMixin):
    """User in the system."""

    email = models.EmailField(max_length=255, unique=True)
    name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = "email"


class ShoppingList(models.Model):
    """Shopping list object."""

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    additional_users = models.ManyToManyField(
        settings.AUTH_USER_MODEL, related_name="additional_users", blank=True
    )
    items = models.ManyToManyField("Item")

    def __str__(self):
        return self.title


FOOD_TYPE = (
    ("vegetables", "vegetables"),
    ("fruits", "fruits"),
    ("grains, beans and nuts", "grains, beans and nuts"),
    ("meat and poultry", "meat and poultry"),
    ("fish and seafood", "fish and seafood"),
    ("dairy foods", "dairy foods"),
    ("fat", "fat"),
    ("sweets", "sweets"),
    ("spices", "spices"),
    ("other", "other"),
)


class Item(models.Model):
    name = models.CharField(max_length=255)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    last_time_used = models.DateTimeField(default=timezone.now)
    food_type = models.CharField(choices=FOOD_TYPE, blank=True, max_length=100)
    description = models.CharField(max_length=255)

    def __str__(self):
        return self.name
