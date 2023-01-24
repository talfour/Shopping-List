"""
Serializers for shopping list API
"""
from rest_framework import serializers

from core.models import ShoppingList


class ShoppingListSerializer(serializers.ModelSerializer):
    """Serializer for shopping lists."""

    class Meta:
        model = ShoppingList
        fields = ["id", "title", "additional_users"]
        read_only_fields = ["id"]


class ShoppingListDetailSerializer(ShoppingListSerializer):
    """Serializer for shopping list detail view."""

    class Meta(ShoppingListSerializer.Meta):
        fields = ShoppingListSerializer.Meta.fields + ["description"]
