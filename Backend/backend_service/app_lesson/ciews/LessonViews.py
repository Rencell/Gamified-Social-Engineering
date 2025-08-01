from rest_framework import viewsets
from app_lesson.models import Lesson, UserLessonProgress
from app_lesson.serializers import LessonSerializer, UserLessonProgressSerializer

class LessonViewSet(viewsets.ModelViewSet):

    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    

class UserLessonProgressViewSet(viewsets.ModelViewSet):

    queryset = UserLessonProgress.objects.all()
    serializer_class = UserLessonProgressSerializer
    
    