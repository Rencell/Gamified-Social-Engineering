from django.shortcuts import render

from django.db.models import Count, Q
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import VishingScenario
from .serializers import VishingScenarioSerializer


# Create your views here.
class VishingScenarioViewSet(viewsets.ModelViewSet):

    permission_classes = [IsAuthenticated]
    serializer_class = VishingScenarioSerializer

    def get_queryset(self):
        return VishingScenario.objects.filter(user=self.request.user).order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=["get"], url_path="summary")
    def summary(self, request):
        qs = self.get_queryset()
        data = qs.aggregate(
            total=Count("id"),
            gave_information=Count("id", filter=Q(status="GAVE_INFORMATION")),
            refused=Count("id", filter=Q(status="REFUSED")),
            security_score=Count("id", filter=Q(status="REFUSED")) * 100.0 / Count("id")
        )
        return Response(data)