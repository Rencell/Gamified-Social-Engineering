from rest_framework import serializers
from .models import Item, BackpackItem, UserCosmetics


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ['id', 'name', 'type', 'image', 'price', 'rive_code']

    
class BackpackItemSerializer(serializers.ModelSerializer):
    item = ItemSerializer(read_only=True)
    item_id = serializers.PrimaryKeyRelatedField(queryset=Item.objects.all())
    
    class Meta:
        model = BackpackItem
        fields = ['id', 'user', 'item', 'item_id', 'acquired_at']
        
    def create(self, validated_data):
        item = validated_data.pop('item_id') 
        validated_data['item'] = item        
        return BackpackItem.objects.create(**validated_data)
        
class UserCosmeticsSerializer(serializers.ModelSerializer):
    
    equipped_avatar = BackpackItemSerializer(read_only=True)
    equipped_background = BackpackItemSerializer(read_only=True)
    equipped_avatar_id = serializers.PrimaryKeyRelatedField(queryset=BackpackItem.objects.filter(item__type='avatar'))
    equipped_background_id = serializers.PrimaryKeyRelatedField(queryset=BackpackItem.objects.filter(item__type='background'))
    
    
    class Meta:
        model = UserCosmetics
        fields = ['user', 'equipped_avatar', 'equipped_background', 'equipped_avatar_id', 'equipped_background_id']
      
    def create(self, validated_data):
        equipped_avatar = validated_data.pop('equipped_avatar_id') 
        equipped_background = validated_data.pop('equipped_background_id') 
        
        validated_data['equipped_avatar'] = equipped_avatar        
        validated_data['equipped_background'] = equipped_background        
        return BackpackItem.objects.create(**validated_data)
