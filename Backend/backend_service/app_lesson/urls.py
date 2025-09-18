from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import LessonViewSet, UserLessonProgressViewSet, LessonTestViewSet, UserLessonTestProgressViewSet

router = DefaultRouter()
router.register(r'lesson', LessonViewSet, basename='lesson')
router.register(r'user-lesson-progress', UserLessonProgressViewSet, basename='userlessonprogress')
router.register(r'lesson-test', LessonTestViewSet, basename='lessontest')
router.register(r'user-lesson-test-progress', UserLessonTestProgressViewSet, basename='userlessontestprogress')

urlpatterns = router.urls

