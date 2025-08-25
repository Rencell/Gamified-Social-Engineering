
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Modules, UserModuleProgress
from .serializers import ModuleSerializer, UserModuleProgressSerializer

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

    