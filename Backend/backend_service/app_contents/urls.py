
from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import ContentViewSet, ContentItemViewSet, ContentImageViewSet, ContentQuizViewSet, ContentQuizImageViewSet

router = DefaultRouter()
router.register(r'content', ContentViewSet, basename='content')
router.register(r'content-items', ContentItemViewSet, basename='content-items')
router.register(r'content-image', ContentImageViewSet, basename='content-image')
router.register(r'content-quiz', ContentQuizViewSet, basename='content-quiz')
router.register(r'content-quiz-image', ContentQuizImageViewSet, basename='content-quiz-image')

urlpatterns = router.urls

