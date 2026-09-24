from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Rank, Level


class LevelViewSetTests(APITestCase):
    def setUp(self):
        self.rank_bronze = Rank.objects.create(name="BronzeTest", min_level=1)
        self.rank_silver = Rank.objects.create(name="SilverTest", min_level=5)
        # xp_required ordering in Meta should sort ascending
        self.level1 = Level.objects.create(number=97, name="Level 1", xp_required=0, rank=self.rank_bronze)
        self.level2 = Level.objects.create(number=98, name="Level 2", xp_required=100, rank=self.rank_bronze)
        self.level5 = Level.objects.create(number=99, name="Level 5", xp_required=500, rank=self.rank_silver)

    def test_list_levels(self):
        url = reverse("level-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        # Ensure we got at least our seeded levels
        self.assertGreaterEqual(len(data), 3)
        # Check ascending ordering by xp_required
        xp_list = [item["xp_required"] for item in data]
        self.assertEqual(xp_list, sorted(xp_list))
        # Confirm our seeded levels are present
        names = [item["name"] for item in data]
        self.assertIn("Level 1", names)
        self.assertIn("Level 2", names)
        self.assertIn("Level 5", names)

    def test_retrieve_level(self):
        url = reverse("level-detail", args=[self.level2.pk])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertEqual(data["name"], "Level 2")
        self.assertEqual(data["number"], 98)
        self.assertEqual(data["xp_required"], 100)
        # Serializer likely includes rank id; accept either id or nested representation
        # If nested, ensure name matches; if id, ensure it equals rank pk
        if isinstance(data.get("rank"), dict):
            self.assertEqual(data["rank"].get("name"), "BronzeTest")
        else:
            self.assertEqual(data.get("rank"), self.rank_bronze.pk)
