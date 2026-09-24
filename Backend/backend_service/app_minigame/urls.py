from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MiniGameViewSet

router = DefaultRouter()
router.register(r'minigame', MiniGameViewSet, basename='minigame')

urlpatterns = [
    path('', include(router.urls)),
]
