from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from app_section.models import Section
from app_lesson.models import LessonTest


class SectionViewSetTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        # Create a minimal LessonTest instance to associate with Section
        self.lesson = LessonTest.objects.create(title="Test Lesson", slug="test-lesson")
        self.list_url = reverse("section-list")

    def test_list_sections(self):
        Section.objects.create(lesson=self.lesson, name="Intro", description="Introduction")
        Section.objects.create(lesson=self.lesson, name="Basics", description="Basics section")

        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 2)

    def test_create_section(self):
        payload = {
            "lesson": self.lesson.id,
            "name": "New Section",
            "description": "New section description",
        }
        response = self.client.post(self.list_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Section.objects.count(), 1)
        self.assertEqual(Section.objects.first().name, "New Section")

    def test_retrieve_update_delete_section(self):
        section = Section.objects.create(lesson=self.lesson, name="Details", description="Details desc")
        detail_url = reverse("section-detail", args=[section.id])

        # Retrieve
        resp_get = self.client.get(detail_url)
        self.assertEqual(resp_get.status_code, status.HTTP_200_OK)
        self.assertEqual(resp_get.data["name"], "Details")

        # Update
        update_payload = {"name": "Updated Details", "description": "Updated desc", "lesson": self.lesson.id}
        resp_put = self.client.put(detail_url, update_payload, format="json")
        self.assertEqual(resp_put.status_code, status.HTTP_200_OK)
        section.refresh_from_db()
        self.assertEqual(section.name, "Updated Details")

        # Partial update
        resp_patch = self.client.patch(detail_url, {"description": "Patched desc"}, format="json")
        self.assertEqual(resp_patch.status_code, status.HTTP_200_OK)
        section.refresh_from_db()
        self.assertEqual(section.description, "Patched desc")

        # Delete
        resp_del = self.client.delete(detail_url)
        self.assertEqual(resp_del.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Section.objects.filter(id=section.id).exists())
