from rest_framework.viewsets import ReadOnlyModelViewSet
from .models import Level
from .serializers import LevelSerializer

class LevelViewSet(ReadOnlyModelViewSet):
    queryset = Level.objects.all()
    serializer_class = LevelSerializer
