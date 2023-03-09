"""
Views for shopping list APIs.
"""
from django.db.models import Q

from rest_framework import status
from rest_framework import viewsets
from rest_framework import mixins
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from core.models import ShoppingList, Item, User
from shopping_list import serializers


class ShoppingListViewSet(viewsets.ModelViewSet):
    """View for manage shopping list APIs."""

    serializer_class = serializers.ShoppingListDetailSerializer
    queryset = ShoppingList.objects.all()
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Retrieve shopping lists for authenticated user."""
        return self.queryset.filter(
            Q(user=self.request.user) | Q(additional_users=self.request.user)
        ).order_by("-id")

    def get_serializer_class(self):
        """Return the serializer class for request."""
        if self.action == "list":
            return serializers.ShoppingListSerializer

        return self.serializer_class

    def perform_create(self, serializer):
        """Create a new shopping list"""
        serializer.save(user=self.request.user)

    # def partial_update(self, request, *args, **kwargs):
    #     shopping_list = self.get_object()
    #     data = request.data
    #     print(data)
    #     if data["additional_users"]:
    #         user_email = data["additional_users"][0]["email"]
    #         user = User.objects.filter(email=user_email)
    #         if user:
    #             shopping_list.additional_users.add(user[0].id)
    #             shopping_list.save()
    #             serializer = serializers.ShoppingListDetailSerializer(
    #                 shopping_list, partial=True
    #             )
    #             return Response(status=status.HTTP_200_OK, data=serializer.data)
    #         elif len(user) == 0:
    #             return Response(
    #                 status=status.HTTP_400_BAD_REQUEST, data="User Not Found"
    #             )


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
        return self.queryset.filter(user=self.request.user).order_by("-name")
