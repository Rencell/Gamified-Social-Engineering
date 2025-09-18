
from rest_framework import serializers, viewsets
from .models import Content, ContentItem, ContentImage, ContentQuiz, ContentQuizImage

class ContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Content
        fields = '__all__'
        
class ContentItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContentItem
        fields = '__all__'
        
        
class ContentImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContentImage
        fields = '__all__'
        
class ContentQuizSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContentQuiz
        fields = '__all__'

class ContentQuizImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContentQuizImage
        fields = '__all__'