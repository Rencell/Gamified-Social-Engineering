from rest_framework import viewsets, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Lesson, UserLessonProgress, LessonTest, UserLessonTestProgress
from .serializers import LessonSerializer, UserLessonProgressSerializer, LessonTestSerializer, UserLessonTestProgressSerializer
from app_modules.models import Modules, UserModuleProgress
from app_modules.serializers import ModuleSerializer
from rest_framework import status
from app_section.models import Section
from app_section.serializers import SectionSerializer

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


class LessonTestViewSet(viewsets.ModelViewSet):

    queryset = LessonTest.objects.all()
    serializer_class = LessonTestSerializer
    
    @action(detail=False, methods=['get'], url_path='unlocked', url_name='unlocked-lessons-test')
    def get_unlocked_lessons(self, request):
        user = request.user
        unlocked_lessons = UserLessonTestProgress.objects.filter(user=user).values_list('lesson_test__slug', flat=True)
        # unlocked_lesson_names = [name.lower() for name in unlocked_lessons]
        return Response(list(unlocked_lessons), status=status.HTTP_200_OK)
    
    
    @action(detail=True, methods=['get'], url_path='section', url_name='section')
    def get_sections(self, request, pk=None):
        
        
        try:
            lesson = self.get_object()
        except LessonTest.DoesNotExist:
            return Response(status=404)

        unlocked_contents = Section.objects.filter(lesson=lesson.id)    
        serializer = SectionSerializer(unlocked_contents, many=True, context={'request': request})
        return Response(serializer.data, status=200)
    
class UserLessonTestProgressViewSet(viewsets.ModelViewSet):

    queryset = UserLessonTestProgress.objects.all()
    serializer_class = UserLessonTestProgressSerializer
    
    def create(self, request, *args, **kwargs):
        user = request.user  # Automatically set the user from the request
        lesson = request.data.get('lesson_test')
        
        obj, created = UserLessonTestProgress.objects.update_or_create(
            user=user,
            lesson_test_id=lesson,
        )
        serializer = self.get_serializer(obj)
        
        if created:
            return Response(serializer.data, status=201)
        else:
            return Response(serializer.data, status=202)
    
    def calculate_lesson_progress(self, user, number):

        lesson = LessonTest.objects.filter(id=number).first()

        total_modules = lesson.module_tests.count()
        completed_modules = lesson.module_tests.filter(users=user).count()

        if total_modules == 0:
            return 0.0
        
        return round((completed_modules / total_modules) * 100, 0)
    
    @action(detail=False, methods=['get'])
    def current_lesson(self, request):
        user = request.user


        latest_lesson = UserLessonTestProgress.objects.filter(user=user).last()
        percentage = self.calculate_lesson_progress(user, latest_lesson.lesson_test.id)
        
        serializer = self.get_serializer(latest_lesson)
        data = serializer.data
        data['percentage'] = percentage
        data['module_count'] = latest_lesson.lesson_test.module_tests.count()
        data['completed_module_count'] = latest_lesson.lesson_test.module_tests.filter(users=user).count()
        return Response(data)
    
    