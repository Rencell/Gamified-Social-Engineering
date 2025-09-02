from rest_framework import serializers
from .models import Badge, UserBadge

class BadgeSerializer(serializers.ModelSerializer):
     class Meta:
        model = Badge
        fields = '__all__'
        
class UserBadgeSerializer(serializers.ModelSerializer):
   
     badge = BadgeSerializer(read_only=True)
     badge_id = serializers.PrimaryKeyRelatedField(source='badge', queryset=Badge.objects.all())
     class Meta:
        model = UserBadge
        fields = ['user', 'badge', 'badge_id', 'completed_at']