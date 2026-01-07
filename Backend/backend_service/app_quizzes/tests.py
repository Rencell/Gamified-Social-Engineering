from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIRequestFactory, force_authenticate
from rest_framework import status

from .views import QuizProgressViewSet
from .models import QuizProgress
from app_modules.models import ModuleTest, LessonTest, Section


class QuizProgressViewSetTests(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.user = User.objects.create_user(username="tester", password="pass")
        # Create a LessonTest and ModuleTest to satisfy FK requirements
        self.lesson = LessonTest.objects.create(title="Lesson 1")
        self.section = Section.objects.create(lesson=self.lesson, name="Section A", description="desc")
        self.module = ModuleTest.objects.create(title="Module 1", lesson=self.lesson, section=self.section)

    def test_create_quiz_progress_creates_new(self):
        view = QuizProgressViewSet.as_view({'post': 'create'})
        payload = {
            'user': self.user.id,
            'module': self.module.id,
            'score': 7,
            'total_questions': 10,
            'time_spent': 120,
            'attempt_number': 1,
            'accuracy': 0.7,
        }
        request = self.factory.post('/api/quizzes/quiz-progress/', payload, format='json')
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(QuizProgress.objects.count(), 1)
        qp = QuizProgress.objects.first()
        self.assertEqual(qp.user, self.user)
        self.assertEqual(qp.module, self.module)
        self.assertEqual(qp.score, 7)

    def test_create_quiz_progress_updates_when_higher_score(self):
        # Seed existing lower score
        QuizProgress.objects.create(user=self.user, module=self.module, score=5, total_questions=10, time_spent=100, attempt_number=1, accuracy=0.5)
        view = QuizProgressViewSet.as_view({'post': 'create'})
        payload = {
            'user': self.user.id,
            'module': self.module.id,
            'score': 8,
            'total_questions': 10,
            'time_spent': 150,
            'attempt_number': 2,
            'accuracy': 0.8,
        }
        request = self.factory.post('/api/quizzes/quiz-progress/', payload, format='json')
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_202_ACCEPTED)
        qp = QuizProgress.objects.get(user=self.user, module=self.module)
        self.assertEqual(qp.score, 8)
        self.assertEqual(qp.attempt_number, 2)

    def test_quiz_progress_action_returns_404_when_missing(self):
        view = QuizProgressViewSet.as_view({'get': 'quiz_progress'})
        request = self.factory.get('/api/quizzes/quiz-progress/module/', {'module_id': self.module.id})
        # Authenticate so request.user is set
        force_authenticate(request, user=self.user)
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_quiz_progress_action_returns_object(self):
        QuizProgress.objects.create(user=self.user, module=self.module, score=9, total_questions=10, time_spent=90, attempt_number=1, accuracy=0.9)
        view = QuizProgressViewSet.as_view({'get': 'quiz_progress'})
        request = self.factory.get('/api/quizzes/quiz-progress/module/', {'module_id': self.module.id})
        force_authenticate(request, user=self.user)
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['score'], 9)
        self.assertEqual(response.data['total_questions'], 10)

    def test_process_ids_validation(self):
        view = QuizProgressViewSet.as_view({'post': 'process_ids'})
        request = self.factory.post('/api/quizzes/quiz-progress/process-ids/', {'ids': 'not-a-list'}, format='json')
        force_authenticate(request, user=self.user)
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_process_ids_returns_percentage(self):
        # Create two progress entries
        QuizProgress.objects.create(user=self.user, module=self.module, score=7, total_questions=10, time_spent=120, attempt_number=1, accuracy=0.7)
        # Another module
        module2 = ModuleTest.objects.create(title="Module 2", lesson=self.lesson, section=self.section)
        QuizProgress.objects.create(user=self.user, module=module2, score=5, total_questions=20, time_spent=200, attempt_number=1, accuracy=0.25)

        view = QuizProgressViewSet.as_view({'post': 'process_ids'})
        request = self.factory.post('/api/quizzes/quiz-progress/process-ids/', {'ids': [self.module.id, module2.id]}, format='json')
        force_authenticate(request, user=self.user)
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Ensure percentage is calculated per module id (independent of ordering)
        by_module = {item['module']: item['percentage'] for item in response.data}
        self.assertEqual(by_module[self.module.id], 70.0)
        self.assertEqual(by_module[module2.id], 25.0)
