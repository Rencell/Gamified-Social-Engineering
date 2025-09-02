from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import BadgeViewSet, UserBadgeViewSet

router = DefaultRouter()
router.register(r'badge', BadgeViewSet, basename='badge')
router.register(r'user-badge', UserBadgeViewSet, basename='user-badge')

urlpatterns = router.urls

