from rest_framework import serializers
from .models import Section
from app_modules.serializers import ModuleTestSerializer

class SectionSerializer(serializers.ModelSerializer):
    modules = ModuleTestSerializer(many=True, read_only=True)
    
    class Meta:
        model = Section
        fields = '__all__'