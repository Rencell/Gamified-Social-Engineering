from rest_framework import serializers
from .models import PopupScenario, PopupTriggerLog

class PopupScenarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = PopupScenario
        fields = '__all__'

class PopupTriggerLogModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = PopupTriggerLog
        fields = '__all__'