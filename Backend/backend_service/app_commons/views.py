from django.shortcuts import render
from rest_framework import generics, viewsets

from .serializer import AgreementSectionSerializer, AgreementSerializer, SimulationGuideSerializer
from .models import AgreementSection, Agreement, simulationGuide

# Create your views here.
class AgreementSectionViewSet(viewsets.ModelViewSet):
    queryset = AgreementSection.objects.all()
    serializer_class = AgreementSectionSerializer
    
class AgreementViewSet(viewsets.ModelViewSet):
    queryset = Agreement.objects.all()
    serializer_class = AgreementSerializer
    
class SimulationGuideViewSet(viewsets.ModelViewSet):
    queryset = simulationGuide.objects.all()
    serializer_class = SimulationGuideSerializer
    
    def get_queryset(self):
        queryset = simulationGuide.objects.all()
        type = self.request.query_params.get('type')
        
        queryset = queryset.filter(type=type) if type else queryset
        
        return queryset.order_by('ordering')
    