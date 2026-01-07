from rest_framework import serializers
from .models import LessonTest, UserLessonTestProgress

        
class LessonTestSerializer(serializers.ModelSerializer):
    completed_modules = serializers.SerializerMethodField()
    total_modules = serializers.SerializerMethodField()
    class Meta:
        model = LessonTest
        fields = '__all__'
        
    def get_total_modules(self, obj):
        return obj.module_tests.count()

    def get_completed_modules(self, obj):
        user = self.context.get("request").user
        if user.is_anonymous:
            return 0
        return obj.module_tests.filter(
            usermoduletestprogress__user=user
        ).count()

class UserLessonTestProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserLessonTestProgress
        fields = '__all__'