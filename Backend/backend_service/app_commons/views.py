from django.shortcuts import render
from rest_framework import generics, viewsets

from .serializer import AgreementSectionSerializer, AgreementSerializer
from .models import AgreementSection, Agreement

# Create your views here.
class AgreementSectionViewSet(viewsets.ModelViewSet):
    queryset = AgreementSection.objects.all()
    serializer_class = AgreementSectionSerializer
    
class AgreementViewSet(viewsets.ModelViewSet):
    queryset = Agreement.objects.all()
    serializer_class = AgreementSerializer