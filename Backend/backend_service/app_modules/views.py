
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import UserModuleTestProgress, ModuleTest, ModuleSource
from .serializers import  UserModuleTestProgressSerializer, ModuleTestSerializer, ModuleSourceSerializer
from app_contents.models import Content
from app_contents.serializers import ContentSerializer
        
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
        if not obj.exists() and lesson_slug and lesson_slug.isdigit():
            obj = ModuleTest.objects.filter(lesson__id=lesson_slug) if lesson_slug else None
        
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
    
    
class ModuleSourceViewSet(viewsets.ModelViewSet):

    queryset = ModuleSource.objects.all()
    serializer_class = ModuleSourceSerializer
    
    @action(detail=False, methods=['get'])
    def get_by_module(self, request):
        module_id = request.query_params.get('module_id')
        obj = ModuleSource.objects.filter(module__id=module_id) if module_id else None
        
        if obj and obj.exists():
            serializer = self.get_serializer(obj, many=True)
            return Response(serializer.data, status=200)
        return Response({'detail': 'Not found.'}, status=404)