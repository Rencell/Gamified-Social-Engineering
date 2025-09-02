from django.http import JsonResponse
from django.shortcuts import render
from .serializers import BadgeSerializer, UserBadgeSerializer
from rest_framework import viewsets
from .models import Badge, UserBadge
from rest_framework.response import Response
from rest_framework.decorators import action


class BadgeViewSet(viewsets.ModelViewSet):
    queryset = Badge.objects.all()
    serializer_class = BadgeSerializer
    
class UserBadgeViewSet(viewsets.ModelViewSet):
    queryset = UserBadge.objects.all()
    serializer_class = UserBadgeSerializer

    def create(self, request):
        user = self.request.user.id
        badge_id = request.data.get('badge_id')  # Assuming 'lesson' is passed in the request data
        print(badge_id)
        badge = Badge.objects.get(id=badge_id)
        obj, created = UserBadge.objects.update_or_create(  # Fixed the model reference
            user_id=user,
            badge=badge,
        )
        serializer = self.get_serializer(obj)
        
        if created:
            return Response(serializer.data, status=201)
        else:
            return Response(serializer.data, status=202)
    
    @action(detail=False, methods=['get'], url_path='unlocked')
    def unlocked(self, request):
        user_badges = UserBadge.objects.filter(user=request.user)
        serializer = self.get_serializer(user_badges, many=True)
        return Response(serializer.data)