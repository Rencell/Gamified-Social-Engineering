from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import AgreementSectionViewSet, AgreementViewSet, SimulationGuideViewSet

router = DefaultRouter()
router.register(r'aggreement-section', AgreementSectionViewSet, basename='agreement-sections')
router.register(r'aggreement', AgreementViewSet, basename='agreements')
router.register(r'simulation-guide', SimulationGuideViewSet, basename='simulation-guides')

urlpatterns = router.urls