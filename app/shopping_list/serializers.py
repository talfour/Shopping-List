"""
Serializers for shopping list API
"""
from rest_framework import serializers

from core.models import ShoppingList, Item, User


class ItemSerializer(serializers.ModelSerializer):
    """Serializer for items."""

    class Meta:
        model = Item
        fields = ["id", "name", "food_type", "description"]
        read_only_fields = ["id"]
        extra_kwargs = {
            "description": {"required": False, "allow_null": True, "allow_blank": True}
        }


class ShoppingListSerializer(serializers.ModelSerializer):
    """Serializer for shopping lists."""

    items = ItemSerializer(many=True, required=False)
    additional_users = serializers.SlugRelatedField(
        many=True, queryset=User.objects.all(), slug_field="email", required=False
    )

    class Meta:
        model = ShoppingList
        fields = ["id", "title", "additional_users", "items"]
        read_only_fields = ["id"]

    def _get_or_create_items(self, items, shopping_list):
        """Handle getting or creating items as needed"""
        auth_user = self.context["request"].user
        for item in items:
            item_obj, create = Item.objects.get_or_create(
                user=auth_user,
                **item,
            )
            shopping_list.items.add(item_obj)

    def _get_additional_user(self, additional_users, shopping_list):
        """Handle getting an additional user."""
        for user in additional_users:
            user = User.objects.get(email=user)
            shopping_list.additional_users.add(user)

    def create(self, validated_data):
        """Create a shopping list"""
        items = validated_data.pop("items", [])
        additional_users = validated_data.pop("additional_users", [])
        shopping_list = ShoppingList.objects.create(**validated_data)
        self._get_or_create_items(items, shopping_list)
        self._get_additional_user(additional_users, shopping_list)

        return shopping_list

    def update(self, instance, validated_data):
        """Update shopping list."""
        items = validated_data.pop("items", [])
        additional_users = validated_data.pop("additional_users", [])
        if items is not None:
            instance.items.clear()
            self._get_or_create_items(items, instance)
        if additional_users is not None:
            instance.additional_users.clear()
            self._get_additional_user(additional_users, instance)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance


class ShoppingListDetailSerializer(ShoppingListSerializer):
    """Serializer for shopping list detail view."""

    class Meta(ShoppingListSerializer.Meta):
        fields = ShoppingListSerializer.Meta.fields + ["description"]
