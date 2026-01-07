from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from .models import UserStats, RewardLog


class RewardViewsTests(APITestCase):
    def setUp(self):
        # Create users
        self.user = User.objects.create_user(username="user", password="pass")
        self.admin = User.objects.create_user(username="admin", password="pass", is_superuser=True, is_staff=True)

        # Avoid OneToOne conflicts by using get_or_create
        self.user_stats, _ = UserStats.objects.get_or_create(user=self.user, defaults={"exp": 100, "coins": 50})
        self.admin_stats, _ = UserStats.objects.get_or_create(user=self.admin, defaults={"exp": 999, "coins": 999})

    def test_userstats_list_excludes_superusers(self):
        url = "/api/rewards/userstats/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        returned_ids = {item.get("id") or item.get("pk") for item in response.json()}
        self.assertIn(self.user_stats.pk, returned_ids)
        self.assertNotIn(self.admin_stats.pk, returned_ids)

    def test_userstats_by_user_requires_param(self):
        url = "/api/rewards/userstats/by_user/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("user_id", response.json().get("detail", ""))

    def test_userstats_by_user_returns_stats(self):
        url = "/api/rewards/userstats/by_user/"
        response = self.client.get(url, {"user_id": self.user.pk})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertEqual(data.get("user"), self.user.pk)
        self.assertEqual(data.get("exp"), self.user_stats.exp)
        self.assertEqual(data.get("coins"), self.user_stats.coins)

    def test_rewardlog_create(self):
        url = "/api/rewards/rewardlog/"
        payload = {
            "user": self.user.pk,
            "action": "increase",
            "reason": "bonus",
            "coin": 10,
            "xp": 5
        }
        response = self.client.post(url, payload, format="json")
        self.assertIn(response.status_code, (status.HTTP_200_OK, status.HTTP_201_CREATED))
        data = response.json()
        self.assertEqual(data.get("user"), self.user.pk)
        self.assertEqual(data.get("action"), "increase")
        self.assertEqual(data.get("reason"), "bonus")
        self.assertEqual(data.get("coin"), 10)
        self.assertEqual(data.get("xp"), 5)
        self.assertTrue(RewardLog.objects.filter(user=self.user, action="increase", reason="bonus", coin=10, xp=5).exists())
