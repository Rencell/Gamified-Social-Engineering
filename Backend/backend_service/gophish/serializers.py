from rest_framework import serializers
from .models import GophishEvent, GophishUserScore

class GophishEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = GophishEvent
        fields = '__all__'

class GophishUserScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = GophishUserScore
        fields = '__all__'