from rest_framework.routers import DefaultRouter
from .views import QuizProgressViewSet

router = DefaultRouter()
router.register(r'quiz-progress', QuizProgressViewSet, basename='quizprogress')

urlpatterns = router.urls