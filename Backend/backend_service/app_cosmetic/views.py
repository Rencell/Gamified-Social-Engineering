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
        user = request.data.get('user')
        avatar_id = request.data.get('equipped_avatar_id')
        background_id = request.data.get('equipped_background_id')

        obj, created = UserCosmetics.objects.update_or_create(
            user_id=user,
            defaults={
                'equipped_avatar_id': avatar_id,
                'equipped_background_id': background_id
            }
        )

        serializer = self.get_serializer(obj)

        return Response(serializer.data, status=201 if created else 202)
