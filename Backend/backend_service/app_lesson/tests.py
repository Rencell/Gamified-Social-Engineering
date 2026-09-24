from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.urls import reverse

from .models import LessonTest, UserLessonTestProgress
from app_section.models import Section


class LessonTestModelTests(TestCase):
    def test_str_returns_title(self):
        lt = LessonTest.objects.create(title="Intro Security", description="desc")
        self.assertEqual(str(lt), "Intro Security")

    def test_save_sets_slug_on_create_and_does_not_override_on_update(self):
        lt = LessonTest.objects.create(title="My Lesson", description="desc")
        self.assertEqual(lt.slug, "my-lesson")
        # Update title should not change slug
        lt.title = "Updated Title"
        lt.save()
        self.assertEqual(lt.slug, "my-lesson")

    def test_lesson_order_auto_increments(self):
        a = LessonTest.objects.create(title="A", description="desc")
        b = LessonTest.objects.create(title="B", description="desc")
        self.assertEqual(a.lesson_order, 1)
        self.assertEqual(b.lesson_order, 2)

    def test_lesson_order_respected_if_set(self):
        a = LessonTest.objects.create(title="A", description="desc", lesson_order=5)
        self.assertEqual(a.lesson_order, 5)
        b = LessonTest.objects.create(title="B", description="desc")
        # Next auto should consider max existing (5) and set 6
        self.assertEqual(b.lesson_order, 6)

    def test_objective_defaults_to_list(self):
        lt = LessonTest.objects.create(title="Obj", description="desc")
        self.assertIsInstance(lt.objective, list)


class LessonTestViewSetTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="u1", password="pass")
        self.client.force_authenticate(user=self.user)
        self.lesson1 = LessonTest.objects.create(title="Lesson One", description="d1")
        self.lesson2 = LessonTest.objects.create(title="Lesson Two", description="d2")

    def test_list_ordered_by_id(self):
        url = reverse("lessontest-list")
        res = self.client.get(url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        ids = [item["id"] for item in res.data]
        self.assertEqual(ids, sorted(ids))

    def test_unlocked_returns_only_user_progress_slugs(self):
        # Create progress for current user and for another user
        UserLessonTestProgress.objects.create(user=self.user, lesson_test=self.lesson1)
        other = User.objects.create_user(username="u2", password="pass")
        UserLessonTestProgress.objects.create(user=other, lesson_test=self.lesson2)
        url = reverse("lessontest-unlocked-lessons-test")
        res = self.client.get(url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, [self.lesson1.slug])

    def test_section_returns_sections_for_lesson(self):
        # Create sections tied to lesson1
        s1 = Section.objects.create(name="S1", lesson=self.lesson1)
        s2 = Section.objects.create(name="S2", lesson=self.lesson1)
        # Section for another lesson should not be returned
        Section.objects.create(name="S3", lesson=self.lesson2)
        url = reverse("lessontest-section", args=[self.lesson1.id])
        res = self.client.get(url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        titles = [s["name"] for s in res.data]
        self.assertListEqual(sorted(titles), ["S1", "S2"])


class UserLessonTestProgressViewSetTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="u1", password="pass")
        self.client.force_authenticate(user=self.user)
        self.lesson = LessonTest.objects.create(title="L", description="d")

    def test_create_uses_request_user_and_is_idempotent(self):
        url = reverse("userlessontestprogress-list")
        payload = {"lesson_test": self.lesson.id}
        res1 = self.client.post(url, payload, format="json")
        self.assertEqual(res1.status_code, status.HTTP_201_CREATED)
        # Second call should return 202 and not create duplicate
        res2 = self.client.post(url, payload, format="json")
        self.assertEqual(res2.status_code, status.HTTP_202_ACCEPTED)
        self.assertEqual(UserLessonTestProgress.objects.filter(user=self.user, lesson_test=self.lesson).count(), 1)

    def test_current_lesson_returns_latest_with_stats(self):
        # Create two progresses; latest should be the second
        lt2 = LessonTest.objects.create(title="L2", description="d2")
        UserLessonTestProgress.objects.create(user=self.user, lesson_test=self.lesson)
        UserLessonTestProgress.objects.create(user=self.user, lesson_test=lt2)
        url = reverse("userlessontestprogress-current-lesson")
        res = self.client.get(url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data["lesson_test"], lt2.id)
        self.assertIn("percentage", res.data)
        self.assertIn("module_count", res.data)
        self.assertIn("completed_module_count", res.data)
        # No image uploaded, should be None
        self.assertIsNone(res.data.get("image"))

    def test_calculate_progress_zero_when_no_modules(self):
        # Directly call the method via the viewset
        from .views import UserLessonTestProgressViewSet
        viewset = UserLessonTestProgressViewSet()
        pct = viewset.calculate_lesson_progress(self.user, self.lesson.id)
        self.assertEqual(pct, 0.0)
