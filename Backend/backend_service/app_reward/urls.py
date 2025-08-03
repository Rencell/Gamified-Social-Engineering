from django.urls import path
from .views import RewardLogViewSet, UserStatsViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'userstats', UserStatsViewSet, basename='userstats')
router.register(r'rewardlog', RewardLogViewSet, basename='rewardlog')

urlpatterns = router.urls
