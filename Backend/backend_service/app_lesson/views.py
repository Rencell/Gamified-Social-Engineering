from rest_framework import viewsets, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Lesson, UserLessonProgress
from .serializers import LessonSerializer, UserLessonProgressSerializer
from app_modules.models import Modules, UserModuleProgress
from app_modules.serializers import ModuleSerializer
from rest_framework import status

class LessonViewSet(viewsets.ModelViewSet):

    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    
    @action(detail=False, methods=['get'], url_path='unlocked', url_name='unlocked-lessons')
    def get_unlocked_lessons(self, request):
        user = request.user
        unlocked_lessons = UserLessonProgress.objects.filter(user=user).values_list('lesson__name', flat=True)
        unlocked_lesson_names = [name.lower() for name in unlocked_lessons]
        return Response(list(unlocked_lesson_names), status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['get'], url_path='unlocked-modules', url_name='unlocked-modules')
    def get_unlocked_modules(self, request, pk=None):
        try:
            lesson = self.get_object()
        except Lesson.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        unlocked_modules = Modules.objects.filter(lesson=lesson, users=request.user).values_list('name', flat=True)    
        unlocked_modules_names = [name.lower() for name in unlocked_modules]
        return Response(list(unlocked_modules_names), status=status.HTTP_200_OK)

class UserLessonProgressViewSet(viewsets.ModelViewSet):

    queryset = UserLessonProgress.objects.all()
    serializer_class = UserLessonProgressSerializer

    def create(self, request, *args, **kwargs):
        user = request.data.get('user')
        lesson = request.data.get('lesson')
        
        obj, created = UserLessonProgress.objects.update_or_create(
            user_id=user,
            lesson_id=lesson,
        )
        serializer = self.get_serializer(obj)
        
        if created:
            return Response(serializer.data, status=201)
        else:
            return Response(serializer.data, status=202)
        
    def calculate_lesson_progress(self, user, number):

        lesson = Lesson.objects.get(id=number)

        total_modules = lesson.modules.count()
        completed_modules = lesson.modules.filter(users=user).count()

        if total_modules == 0:
            return 0.0
        
        return round((completed_modules / total_modules) * 100, 0)
    
    @action(detail=False, methods=['get'])
    def current_lesson(self, request):
        user = request.user


        latest_lesson = UserLessonProgress.objects.filter(user=user).last()
        percentage = self.calculate_lesson_progress(user, latest_lesson.lesson.id)
        
        serializer = self.get_serializer(latest_lesson)
        data = serializer.data
        data['percentage'] = percentage
        return Response(data)
