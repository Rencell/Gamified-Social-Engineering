
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Modules, UserModuleProgress, UserModuleTestProgress, ModuleTest
from .serializers import ModuleSerializer, UserModuleProgressSerializer, UserModuleTestProgressSerializer, ModuleTestSerializer
from app_contents.models import Content
from app_contents.serializers import ContentSerializer
class ModuleViewSet(viewsets.ModelViewSet):

    queryset = Modules.objects.all()
    serializer_class = ModuleSerializer

    @action(detail=False, methods=['get'], url_path='unlocked', url_name='unlocked-modules')
    def get_unlocked_modules(self, request):
        user = request.user
        unlocked_modules = UserModuleProgress.objects.filter(user=user).values_list('module__name', flat=True)
        unlocked_module_names = [name.lower() for name in unlocked_modules]
        return Response(list(unlocked_module_names))
    
class UserModuleProgressViewSet(viewsets.ModelViewSet):

    queryset = UserModuleProgress.objects.all()
    serializer_class = UserModuleProgressSerializer
    
    def create(self, request, *args, **kwargs):
        user = request.data.get('user')
        module = request.data.get('module')
        
        obj, created = UserModuleProgress.objects.update_or_create(
            user_id=user,
            module_id=module,
        )
        serializer = self.get_serializer(obj)
        
        if created:
            return Response(serializer.data, status=201)
        else:
            return Response(serializer.data, status=202)
        
class UserModuleTestProgressViewSet(viewsets.ModelViewSet):

    queryset = UserModuleTestProgress.objects.all()
    serializer_class = UserModuleTestProgressSerializer
    
    def create(self, request, *args, **kwargs):
        user = request.user
        module = request.data.get('module_test')
        
        obj, created = UserModuleTestProgress.objects.update_or_create(
            user=user,
            module_test_id=module,
        )
        serializer = self.get_serializer(obj)
        
        if created:
            return Response(serializer.data, status=201)
        else:
            return Response(serializer.data, status=202)
    
class ModuleTestViewSet(viewsets.ModelViewSet):

    queryset = ModuleTest.objects.all()
    serializer_class = ModuleTestSerializer
    
    
    @action(detail=False, methods=['get'], url_path='lesson')
    def get_by_lesson(self, request):
        lesson_slug = request.query_params.get('lesson_slug')
        obj = ModuleTest.objects.filter(lesson__slug=lesson_slug) if lesson_slug else None
        
        if obj and obj.exists():
            serializer = self.get_serializer(obj, many=True)
            return Response(serializer.data, status=200)
        return Response({'detail': 'Not found.'}, status=404)
    
    
    @action(detail=False, methods=['get'], url_path='unlocked', url_name='unlocked-module-test')
    def get_unlocked_module(self, request):
        user = request.user
        unlocked_module = UserModuleTestProgress.objects.filter(user=user).values_list('module_test__slug', flat=True)
        return Response(list(unlocked_module), status=200)
    
    @action(detail=True, methods=['get'], url_path='list-contents', url_name='list-contents')
    def list_contents_on_parent(self, request, pk=None):
        try:
            module = self.get_object()
        except ModuleTest.DoesNotExist:
            return Response(status=404)

        unlocked_contents = Content.objects.filter(modules=module)    
        
        serializer = ContentSerializer(unlocked_contents, many=True)
        return Response(serializer.data, status=200)