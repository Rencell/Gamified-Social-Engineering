from rest_framework import generics, viewsets
from .models import RewardLog, UserStats
from .serializers import RewardLogSerializer, UserStatsSerializer
from rest_framework.decorators import action
from rest_framework import status
from rest_framework.response import Response

class UserStatsViewSet(viewsets.ModelViewSet):
    queryset = UserStats.objects.all()
    serializer_class = UserStatsSerializer
    
    @action(detail=False, methods=['get'])
    def by_user(self, request):
        user_id = request.query_params.get('user_id')
        if not user_id:
            return Response({'detail': 'user_id is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        stats = UserStats.objects.filter(user_id=user_id).first()
        if stats:
            serializer = self.get_serializer(stats)
            return Response(serializer.data)
        return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
    
class RewardLogViewSet(viewsets.ModelViewSet):
    queryset = RewardLog.objects.all()
    serializer_class = RewardLogSerializer
