from django.urls import path
from .views import UserStreakViewSet, ActivityViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'user-streak', UserStreakViewSet, basename='user-streak')
router.register(r'activity', ActivityViewSet, basename='activity')

urlpatterns = router.urls
