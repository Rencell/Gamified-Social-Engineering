from rest_framework import serializers
from .models import VishingScenario

class VishingScenarioSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = VishingScenario
        fields = '__all__'