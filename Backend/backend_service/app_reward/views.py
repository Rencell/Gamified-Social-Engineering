from rest_framework import generics, viewsets
from .models import RewardLog, UserStats
from .serializers import RewardLogSerializer, UserStatsSerializer
from rest_framework.decorators import action
from rest_framework import status
from rest_framework.response import Response

class UserStatsViewSet(viewsets.ModelViewSet):
    queryset = UserStats.objects.all()
    serializer_class = UserStatsSerializer
    
    def get_queryset(self):
        return UserStats.objects.filter(user__is_superuser=False)
    
    @action(detail=False, methods=['get'])
    def by_user(self, request):
        user_id = request.query_params.get('user_id')

        stats = UserStats.objects.filter(user_id=user_id).first()
        
        if not stats or stats.user.is_superuser or stats.user.is_staff:
            return Response({}, status=status.HTTP_200_OK)

        serializer = self.get_serializer(stats)
        return Response(serializer.data)
    
class RewardLogViewSet(viewsets.ModelViewSet):
    queryset = RewardLog.objects.all()
    serializer_class = RewardLogSerializer
