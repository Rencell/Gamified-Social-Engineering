from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import GoPhishWebhookViewSet, GophishEventViewSet,GophishUserScoreViewSet, GophishConsentViewSet, UserPhoneNumberViewSet, GophishUserScoreSmsViewSet
from .views import gophish_campaigns

urlpatterns = [
    path('gophish_campaigns/', gophish_campaigns, name='gophish_campaigns'),
]

router = DefaultRouter()
router.register(r'gophish_webhook', GoPhishWebhookViewSet, basename='gophish_webhook')
router.register(r'gophish_events', GophishEventViewSet, basename='gophish_events')
router.register(r'gophish_user_score', GophishUserScoreViewSet, basename='gophish_score')
router.register(r'gophish_user_score_sms', GophishUserScoreSmsViewSet, basename='gophish_user_score_sms')
router.register(r'gophish_consent', GophishConsentViewSet, basename='gophish_consent')
router.register(r'user_phone_number', UserPhoneNumberViewSet, basename='user_phone_number')

urlpatterns += router.urls
