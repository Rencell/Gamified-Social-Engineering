from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import  QuestionViewSet, AssessmentViewSet, OptionViewSet, AssessmentSessionViewSet, AssessmentAnswerViewSet,AssessmentCompleteViewSet

router = DefaultRouter()
router.register(r'assessments', AssessmentViewSet, basename='assessment')
router.register(r'question', QuestionViewSet, basename='question')
router.register(r'option', OptionViewSet, basename='option')
router.register(r'session', AssessmentSessionViewSet, basename='session')
router.register(r'session-answer', AssessmentAnswerViewSet, basename='session-answer')
router.register(r'assessment-complete', AssessmentCompleteViewSet, basename='assessment-complete')
urlpatterns = router.urls

