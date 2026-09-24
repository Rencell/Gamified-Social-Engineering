from rest_framework import serializers
from .models import RewardLog, UserStats
from django.contrib.auth.models import User
from django.db.models import Q
class UserStatsSerializer(serializers.ModelSerializer):

    user_name = serializers.StringRelatedField(source='user', read_only=True)
    rank = serializers.SerializerMethodField()
    class Meta:
        model = UserStats
        fields = 'pk', 'user', 'user_name', 'rank', 'exp', 'coins', 'level'
        
    def get_rank(self, obj):
        if obj.exp == 0:
            return 0
        
        user_ids = list(
            UserStats.objects.exclude(
                 Q(user__is_superuser=True)
            ).order_by('-exp', 'pk').values_list('user_id', flat=True)
        )
        print(user_ids)
        return user_ids.index(obj.user_id) + 1

class RewardLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = RewardLog
        fields = '__all__'
