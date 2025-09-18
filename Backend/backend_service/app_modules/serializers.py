from rest_framework import serializers
from .models import Modules, UserModuleProgress, UserModuleTestProgress, ModuleTest
from app_contents.serializers import ContentSerializer, ContentQuizSerializer
from app_quizzes.serializers import QuizProgressSerializer

class ModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Modules
        fields = '__all__'

class UserModuleProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModuleProgress
        fields = '__all__'

class UserModuleTestProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModuleTestProgress
        fields = '__all__'

class ModuleTestSerializer(serializers.ModelSerializer):
    contents_length = serializers.IntegerField(source='contents.count', read_only=True)
    content_quiz = serializers.SerializerMethodField()  # Use SerializerMethodField to extract `type`
    # quiz_progress = QuizProgressSerializer(many=True, read_only=True)
    accuracy = serializers.SerializerMethodField()  
    # quiz_progress = QuizProgressSerializer(many=True, read_only=True)
    class Meta:
        model = ModuleTest
        fields = '__all__'

    def get_content_quiz(self, obj):
        # Get the first related ContentQuiz object and return its `type`
        first_quiz = obj.content_quiz.first()
        return first_quiz.type if first_quiz else None
    
    def get_accuracy(self, obj):
        # Get the current user from the serializer context
        request = self.context.get('request')
        if not request or not request.user:
            return 0.0  # Return 0.0 if no user is available

        # Filter quiz_progress by the current user
        progress = obj.quiz_progress.filter(user=request.user).first()
        
        return progress.accuracy if progress else 0.0