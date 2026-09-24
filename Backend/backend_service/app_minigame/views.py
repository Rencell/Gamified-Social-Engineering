from django.shortcuts import render
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import MiniGame
from .serializers import MiniGameSerializer

class MiniGameViewSet(viewsets.ModelViewSet):
    queryset = MiniGame.objects.all().order_by('created_at', 'required_level')
    serializer_class = MiniGameSerializer
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=['get'])
    def daily(self, request):
        qs = self.get_queryset().filter(is_daily=True)
        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)
