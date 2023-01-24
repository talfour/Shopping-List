"""
Views for shopping list APIs.
"""
from django.db.models import Q

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from rest_framework_simplejwt.authentication import JWTAuthentication

from core.models import ShoppingList
from shopping_list import serializers


class ShoppingListViewSet(viewsets.ModelViewSet):
    """View for manage shopping list APIs."""

    serializer_class = serializers.ShoppingListSerializer
    queryset = ShoppingList.objects.all()
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Retrieve shopping lists for authenticated user."""
        return self.queryset.filter(
            Q(user=self.request.user) | Q(additional_users=self.request.user)
        ).order_by("-id")
