from rest_framework.routers import DefaultRouter
from .views import LessonViewSet, UserLessonProgressViewSet

router = DefaultRouter()
router.register(r'lesson', LessonViewSet, basename='lesson')
router.register(r'user-lesson-progress', UserLessonProgressViewSet, basename='userlessonprogress')

urlpatterns = router.urls