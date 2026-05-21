from rest_framework import serializers
from .models import VishingScenario

class VishingScenarioSerializer(serializers.ModelSerializer):

    class Meta:
        model = VishingScenario
        fields = ('id', 'status', 'created_at')
        read_only_fields = ('id', 'created_at')