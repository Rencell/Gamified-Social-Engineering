from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import SectionViewSet

router = DefaultRouter()
router.register(r'section', SectionViewSet, basename='section')

urlpatterns = router.urls

