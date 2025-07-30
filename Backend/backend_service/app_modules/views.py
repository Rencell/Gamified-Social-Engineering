
from rest_framework import viewsets
from .models import Modules, UserModuleProgress
from .serializers import ModuleSerializer, UserModuleProgressSerializer

class ModuleViewSet(viewsets.ModelViewSet):

    queryset = Modules.objects.all()
    serializer_class = ModuleSerializer


class UserModuleProgressViewSet(viewsets.ModelViewSet):

    queryset = UserModuleProgress.objects.all()
    serializer_class = UserModuleProgressSerializer