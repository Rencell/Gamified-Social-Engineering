from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from .models import Item, BackpackItem, UserCosmetics

User = get_user_model()

class CosmeticViewsTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='alice', password='pass1234')
        self.admin = User.objects.create_user(username='admin', password='adminpass', is_staff=True)
        # Create items
        self.avatar_item = Item.objects.create(name='Avatar A', type='avatar', image='items/a.png', price=0, rive_code=0)
        self.bg_item = Item.objects.create(name='BG A', type='background', image='items/b.png', price=0, rive_code=0)
        self.other_bg_item = Item.objects.create(name='BG B', type='background', image='items/c.png', price=0, rive_code=0)
        # Give user one avatar and one background in backpack
        self.avatar_backpack = BackpackItem.objects.create(user=self.user, item=self.avatar_item)
        self.bg_backpack = BackpackItem.objects.create(user=self.user, item=self.bg_item)

    def auth(self, user):
        self.client.force_authenticate(user=user)

    def test_item_viewset_filters_out_owned_items_for_regular_user(self):
        self.auth(self.user)
        # The user owns avatar_item and bg_item; the queryset should exclude them
        resp = self.client.get('/api/cosmetics/item/')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        ids = {obj['id'] for obj in resp.data}
        self.assertNotIn(self.avatar_item.id, ids)
        self.assertNotIn(self.bg_item.id, ids)
        self.assertIn(self.other_bg_item.id, ids)

    def test_item_viewset_admin_sees_all_items(self):
        self.auth(self.admin)
        resp = self.client.get('/api/cosmetics/item/')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        ids = {obj['id'] for obj in resp.data}
        self.assertIn(self.avatar_item.id, ids)
        self.assertIn(self.bg_item.id, ids)
        self.assertIn(self.other_bg_item.id, ids)

    def test_backpack_item_viewset_returns_only_user_items(self):
        # Create another user's backpack item
        bob = User.objects.create_user(username='bob', password='pass5678')
        bob_backpack = BackpackItem.objects.create(user=bob, item=self.other_bg_item)
        self.auth(self.user)
        resp = self.client.get('/api/cosmetics/backpack-item/')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        returned_ids = {obj['id'] for obj in resp.data}
        # Should include the authenticated user's items
        self.assertIn(self.avatar_backpack.id, returned_ids)
        self.assertIn(self.bg_backpack.id, returned_ids)
        # Should not include other users' items
        self.assertNotIn(bob_backpack.id, returned_ids)

    def test_user_cosmetics_create_updates_or_creates(self):
        self.auth(self.user)
        # First call should create
        payload = {
            'equipped_avatar_id': self.avatar_backpack.id,
            'equipped_background_id': self.bg_backpack.id,
        }
        resp = self.client.post('/api/cosmetics/user-cosmetics/', payload, format='json')
        self.assertIn(resp.status_code, (status.HTTP_201_CREATED, status.HTTP_202_ACCEPTED))
        obj = UserCosmetics.objects.get(user=self.user)
        self.assertEqual(obj.equipped_avatar_id, self.avatar_backpack.id)
        self.assertEqual(obj.equipped_background_id, self.bg_backpack.id)
        # Second call should update
        payload2 = {'equipped_background_id': self.bg_backpack.id}
        resp2 = self.client.post('/api/cosmetics/user-cosmetics/', payload2, format='json')
        self.assertEqual(resp2.status_code, status.HTTP_202_ACCEPTED)

    def test_user_cosmetics_create_rejects_items_not_owned_by_user(self):
        # Create backpack item for another user and try to equip it
        bob = User.objects.create_user(username='bob2', password='xyz')
        bob_avatar_backpack = BackpackItem.objects.create(user=bob, item=self.avatar_item)
        self.auth(self.user)
        payload = {'equipped_avatar_id': bob_avatar_backpack.id}
        resp = self.client.post('/api/cosmetics/user-cosmetics/', payload, format='json')
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(resp.data.get('detail'), 'Invalid avatar id.')

  