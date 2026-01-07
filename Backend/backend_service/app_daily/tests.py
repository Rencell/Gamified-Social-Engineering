from django.test import TestCase
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
import datetime

from .models import UserStreak, Activity


class UserStreakAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="tester", password="pass1234")
        self.client.login(username="tester", password="pass1234")

    def test_get_streak_creates_new_streak_and_activity(self):
        url = reverse("user-streak-get-streak")
        resp = self.client.post(url)
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        streak = UserStreak.objects.get(user_id=self.user)
        today = datetime.date.today()
        self.assertEqual(streak.current_streak, 1)
        self.assertEqual(streak.longest_streak, 1)
        self.assertEqual(streak.last_activity_date, today)
        self.assertEqual(streak.streak_start_date, today)
        self.assertTrue(Activity.objects.filter(user=self.user, date=today).exists())

    def test_get_streak_same_day_returns_same_data_without_increment(self):
        # First call creates streak and activity
        self.client.post(reverse("user-streak-get-streak"))
        # Second call on same day should not increment
        resp2 = self.client.post(reverse("user-streak-get-streak"))
        self.assertEqual(resp2.status_code, status.HTTP_200_OK)
        streak = UserStreak.objects.get(user_id=self.user)
        self.assertEqual(streak.current_streak, 1)

    def test_get_streak_increments_on_consecutive_day(self):
        # Create initial streak on day N
        today = datetime.date.today()
        self.client.post(reverse("user-streak-get-streak"))
        # Pretend next day by modifying model and calling endpoint
        next_day = today + datetime.timedelta(days=1)
        streak = UserStreak.objects.get(user_id=self.user)
        streak.last_activity_date = today
        streak.save(update_fields=["last_activity_date"])  # explicit
        # Monkeypatch date.today via manual setting of last_activity_date then simulate next day call
        # We can't change system date in test easily; instead set streak to yesterday relative to 'next_day' scenario
        # Simulate by setting last_activity_date to yesterday and then calling endpoint after overriding today variable in view is not possible.
        # Alternative: set last_activity_date to yesterday and call endpoint; view compares to real today.
        # To make assertion robust when running on real today, we instead manually adjust to emulate consecutive day:
        # Set last_activity_date to yesterday and ensure endpoint increments.
        streak.last_activity_date = datetime.date.today() - datetime.timedelta(days=1)
        streak.save(update_fields=["last_activity_date"])\

        resp = self.client.post(reverse("user-streak-get-streak"))
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        streak.refresh_from_db()
        self.assertEqual(streak.current_streak, 2)
        self.assertGreaterEqual(streak.longest_streak, 2)
        self.assertEqual(streak.last_activity_date, datetime.date.today())

    def test_view_streak_resets_when_missed_day(self):
        # Create streak with last_activity_date 3 days ago
        old_date = datetime.date.today() - datetime.timedelta(days=3)
        UserStreak.objects.create(
            user_id=self.user,
            current_streak=5,
            longest_streak=5,
            last_activity_date=old_date,
            streak_start_date=old_date,
        )
        resp = self.client.get(reverse("user-streak-view-streak"))
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        streak = UserStreak.objects.get(user_id=self.user)
        self.assertEqual(streak.current_streak, 0)
        self.assertIsNone(streak.streak_start_date)

    def test_check_streak_true_when_today(self):
        today = datetime.date.today()
        UserStreak.objects.create(
            user_id=self.user,
            current_streak=3,
            longest_streak=5,
            last_activity_date=today,
            streak_start_date=today,
        )
        resp = self.client.get(reverse("user-streak-check-streak"))
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertTrue(resp.data.get("is_streak_today"))

    def test_check_streak_false_when_missed_day_and_resets(self):
        missed_day = datetime.date.today() - datetime.timedelta(days=2)
        UserStreak.objects.create(
            user_id=self.user,
            current_streak=4,
            longest_streak=6,
            last_activity_date=missed_day,
            streak_start_date=missed_day,
        )
        resp = self.client.get(reverse("user-streak-check-streak"))
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertFalse(resp.data.get("is_streak_today"))
        streak = UserStreak.objects.get(user_id=self.user)
        self.assertEqual(streak.current_streak, 0)
        self.assertIsNone(streak.streak_start_date)


class ActivityAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="tester2", password="pass1234")
        self.client.login(username="tester2", password="pass1234")

    def test_active_days_returns_week_dates(self):
        today = datetime.date.today()
        # Calculate week Sunday..Saturday using same logic as view
        days_since_sunday = (today.weekday() + 1) % 7
        start_of_week = today - datetime.timedelta(days=days_since_sunday)
        # Create activities on some days of the current week
        dates = [start_of_week, start_of_week + datetime.timedelta(days=2), start_of_week + datetime.timedelta(days=6)]
        for d in dates:
            Activity.objects.create(user=self.user, date=d)
        resp = self.client.get(reverse("activity-active-days"))
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        returned = resp.data.get("active_days", [])
        expected = [d.strftime("%Y-%m-%d") for d in dates]
        # Order is not guaranteed by DB; compare as sets
        self.assertEqual(set(returned), set(expected))
