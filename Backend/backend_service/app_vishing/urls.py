from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import VishingScenarioViewSet

router = DefaultRouter()
router.register(r'score', VishingScenarioViewSet, basename='score')

urlpatterns = router.urls

