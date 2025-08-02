from rest_framework import serializers
from .models import QuizProgress

class QuizProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizProgress
        fields = '__all__'
        read_only_fields = ['completed_at']