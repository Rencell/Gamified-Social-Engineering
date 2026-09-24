from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from django.urls import reverse
from django.utils import timezone
from .models import PopupScenario, PopupTriggerLog

class GetTodayPopupTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.User = get_user_model()
        self.user = self.User.objects.create_user(username="user", password="pass")
        self.staff = self.User.objects.create_user(username="staff", password="pass", is_staff=True)
        self.admin = self.User.objects.create_user(username="admin", password="pass", is_superuser=True)
        self.url = '/api/popup/today-popup/'

    def auth(self, user):
        self.client.force_authenticate(user)

    def test_staff_and_admin_do_not_get_popup(self):
        self.auth(self.staff)
        res_staff = self.client.get(self.url)
        self.assertEqual(res_staff.status_code, 200)
        self.assertFalse(res_staff.data.get('show'))

        self.auth(self.admin)
        res_admin = self.client.get(self.url)
        self.assertEqual(res_admin.status_code, 200)
        self.assertFalse(res_admin.data.get('show'))

    def test_no_scenarios_returns_no_popup(self):
        self.auth(self.user)
        PopupScenario.objects.all().delete()
        res = self.client.get(self.url)
        self.assertEqual(res.status_code, 200)
        self.assertFalse(res.data.get('show'))

    def test_waiting_log_blocks_new_popup(self):
        self.auth(self.user)
        scenario = PopupScenario.objects.create(name="Test", category="malvertising", difficulty="normal")
        PopupTriggerLog.objects.create(user=self.user, scenario=scenario, status="waiting", date_triggered=timezone.now().date())
        res = self.client.get(self.url)
        self.assertEqual(res.status_code, 200)
        self.assertFalse(res.data.get('show'))

    def test_existing_today_log_blocks_new_popup(self):
        self.auth(self.user)
        scenario = PopupScenario.objects.create(name="Test", category="malvertising", difficulty="normal")
        PopupTriggerLog.objects.create(user=self.user, scenario=scenario, status="closed", date_triggered=timezone.now().date())
        res = self.client.get(self.url)
        self.assertEqual(res.status_code, 200)
        self.assertFalse(res.data.get('show'))

    def test_user_gets_popup_and_log_created(self):
        self.auth(self.user)
        PopupScenario.objects.create(name="A", category="malvertising", difficulty="normal")
        res = self.client.get(self.url)
        self.assertEqual(res.status_code, 200)
        self.assertTrue(res.data.get('show'))
        self.assertIsNotNone(res.data.get('scenario'))
        self.assertTrue(PopupTriggerLog.objects.filter(user=self.user, status="waiting").exists())

class PopupTriggerLogViewSetTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.User = get_user_model()
        self.user = self.User.objects.create_user(username="user", password="pass")
        self.client.force_authenticate(self.user)
        self.scenario = PopupScenario.objects.create(name="S", category="malvertising", difficulty="normal")
        self.waiting_log = PopupTriggerLog.objects.create(user=self.user, scenario=self.scenario, status="waiting", date_triggered=timezone.now().date())

    def test_get_pending_popups(self):
        res = self.client.get('/api/popup/popup-trigger-log/get_pending_popups/')
        self.assertEqual(res.status_code, 200)
        self.assertIsNotNone(res.data)
        self.assertEqual(res.data['status'], 'waiting')

    def test_mark_popup_as_seen(self):
        res = self.client.post('/api/popup/popup-trigger-log/mark_popup_as_seen/', {"scenario_id": self.scenario.id, "status": "closed"}, format='json')
        self.assertEqual(res.status_code, 200)
        self.waiting_log.refresh_from_db()
        self.assertEqual(self.waiting_log.status, 'closed')

    def test_get_popup_log_statistics(self):
        self.waiting_log.status = 'closed'
        self.waiting_log.save()
        res = self.client.get('/api/popup/popup-trigger-log/get_popup_log_statistics/')
        self.assertEqual(res.status_code, 200)
        self.assertIn('security_score', res.data)
        self.assertIn('logs', res.data)

    def test_get_totals(self):
        # add another user log to ensure totals count across all users
        other = self.User.objects.create_user(username="other", password="pass")
        PopupTriggerLog.objects.create(user=other, scenario=self.scenario, status="clicked", date_triggered=timezone.now().date())
        # ensure the existing waiting log is counted by marking it non-waiting
        self.waiting_log.status = 'closed'
        self.waiting_log.save()
        res = self.client.get('/api/popup/popup-trigger-log/get_totals/')
        self.assertEqual(res.status_code, 200)
        self.assertIn('total_popups_sent', res.data)
        self.assertGreaterEqual(res.data['total_popups_sent'], 2)
