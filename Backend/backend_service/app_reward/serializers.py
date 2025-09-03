from rest_framework import serializers
from .models import RewardLog, UserStats
from django.contrib.auth.models import User
class UserStatsSerializer(serializers.ModelSerializer):

    user_name = serializers.StringRelatedField(source='user', read_only=True)
    class Meta:
        model = UserStats
        fields = 'pk', 'user', 'user_name', 'exp', 'coins', 'level'
        
    


class RewardLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = RewardLog
        fields = '__all__'
