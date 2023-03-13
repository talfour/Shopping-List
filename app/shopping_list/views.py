"""
Views for shopping list APIs.
"""
from django.db.models import Q

from rest_framework import viewsets
from rest_framework import mixins
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from core.models import ShoppingList, Item
from shopping_list import serializers


class ShoppingListViewSet(viewsets.ModelViewSet):
    """View for manage shopping list APIs."""

    serializer_class = serializers.ShoppingListDetailSerializer
    queryset = ShoppingList.objects.all()
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Retrieve shopping lists for authenticated user."""
        return (
            self.queryset.filter(
                Q(user=self.request.user) | Q(additional_users=self.request.user)
            )
            .order_by("-id")
            .distinct()
        )

    def get_serializer_class(self):
        """Return the serializer class for request."""
        if self.action == "list":
            return serializers.ShoppingListSerializer

        return self.serializer_class

    def perform_create(self, serializer):
        """Create a new shopping list"""
        serializer.save(user=self.request.user)


class ItemViewSet(
    mixins.DestroyModelMixin,
    mixins.UpdateModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    """Manage items in the database."""

    serializer_class = serializers.ItemSerializer
    queryset = Item.objects.all()
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Filter queryset to authenticated user."""
        name = self.request.query_params.get("name", None)
        if name:
            return (
                self.queryset.filter(user=self.request.user)
                .filter(name__icontains=name)
                .order_by("-name")
            )
        return self.queryset.filter(user=self.request.user).order_by("-name")
