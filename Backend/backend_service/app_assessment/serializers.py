from rest_framework import serializers
from .models import Assessment, Question, Option, AssessmentSession, AssessmentAnswer


        
class OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = '__all__'
        
class QuestionSerializer(serializers.ModelSerializer):
    options = OptionSerializer(many=True, read_only=True)
    class Meta:
        model = Question
        fields = '__all__'
        
class AssessmentSerializer(serializers.ModelSerializer):
    
    question_count = serializers.IntegerField(source='questions.count', read_only=True)
    class Meta:
        model = Assessment
        fields = '__all__'
        
class AssessmentSessionSerializer(serializers.ModelSerializer):
    assessment = AssessmentSerializer(read_only=True)
    
    class Meta:
        model = AssessmentSession
        fields = '__all__'

class AssessmentAnswerSerializer(serializers.ModelSerializer):
    
    question = QuestionSerializer(read_only=True)
    selected_option = OptionSerializer(read_only=True)
    
    class Meta:
        model = AssessmentAnswer
        fields = '__all__'