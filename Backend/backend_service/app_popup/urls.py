from rest_framework.routers import DefaultRouter
from .views import PopupScenarioViewSet, PopupTriggerLogViewSet, get_today_popup
from django.urls import path

router = DefaultRouter()
router.register(r'pop-up-scenario', PopupScenarioViewSet, basename='pop-up-scenario')
router.register(r'popup-trigger-log', PopupTriggerLogViewSet, basename='popup-trigger-log')

urlpatterns = [
    # Other URL patterns can be added here if needed    
    path('today-popup/', get_today_popup, name='today-popup'),
]
urlpatterns += router.urls