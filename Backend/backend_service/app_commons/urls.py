from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import AgreementSectionViewSet, AgreementViewSet

router = DefaultRouter()
router.register(r'aggreement-section', AgreementSectionViewSet, basename='agreement-sections')
router.register(r'aggreement', AgreementViewSet, basename='agreements')

urlpatterns = router.urls