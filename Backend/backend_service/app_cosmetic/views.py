from rest_framework import generics, viewsets
from .models import Item, BackpackItem, UserCosmetics
from .serializers import ItemSerializer, BackpackItemSerializer, UserCosmeticsSerializer
from rest_framework.decorators import action
from rest_framework import status
from rest_framework.response import Response

class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:  # Check if the user is an admin
            return Item.objects.all()  # Return all items for admin users
        owned_item_ids = BackpackItem.objects.filter(user=user).values_list('item_id', flat=True)
        return Item.objects.exclude(id__in=owned_item_ids)
    
class BackpackItemViewSet(viewsets.ModelViewSet):
    queryset = BackpackItem.objects.all()
    serializer_class = BackpackItemSerializer
    
    def get_queryset(self):
        user = self.request.user
        owned_item_ids = BackpackItem.objects.filter(user=user)
        return owned_item_ids

class UserCosmeticViewSet(viewsets.ModelViewSet):
    queryset = UserCosmetics.objects.all()
    serializer_class = UserCosmeticsSerializer
    
    def get_queryset(self):
        user = self.request.user
        return UserCosmetics.objects.filter(user=user)
    
    def create(self, request, *args, **kwargs):
        user = request.user  # trust auth, not request body
        avatar_id = request.data.get('equipped_avatar_id') or None
        background_id = request.data.get('equipped_background_id') or None

        # Validate that provided backpack items exist and belong to the user
        defaults = {}
        if avatar_id is not None:
            if not BackpackItem.objects.filter(id=avatar_id, user=user).exists():
                return Response({"detail": "Invalid avatar id."}, status=400)
            defaults['equipped_avatar_id'] = avatar_id

        if background_id is not None:
            if not BackpackItem.objects.filter(id=background_id, user=user).exists():
                return Response({"detail": "Invalid background id."}, status=400)
            defaults['equipped_background_id'] = background_id

        obj, created = UserCosmetics.objects.update_or_create(
            user=user,
            defaults=defaults
        )

        serializer = self.get_serializer(obj)
        return Response(serializer.data, status=201 if created else 202)
