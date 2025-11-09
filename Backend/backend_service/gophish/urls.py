from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import GoPhishWebhookViewSet, GophishEventViewSet,GophishUserScoreViewSet, GophishConsentViewSet
router = DefaultRouter()
router.register(r'gophish_webhook_no_sig', GoPhishWebhookViewSet, basename='gophish_webhook_no_sig')
router.register(r'gophish_events', GophishEventViewSet, basename='gophish_events')
router.register(r'gophish_user_score', GophishUserScoreViewSet, basename='gophish_score')
router.register(r'gophish_consent', GophishConsentViewSet, basename='gophish_consent')

urlpatterns = router.urls

