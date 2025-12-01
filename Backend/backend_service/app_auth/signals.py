from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from app_reward.models import UserStats
from app_lesson.models import Lesson, UserLessonProgress, UserLessonTestProgress, LessonTest
from app_cosmetic.models import UserCosmetics, BackpackItem, Item
from django.db import transaction

@receiver(post_save, sender=get_user_model())
def handle_new_user_registration(sender, instance, created, **kwargs):
    if not created:
        return
    # Wrap in atomic but swallow exceptions so user creation isn't rolled back by missing seed data
    try:
        with transaction.atomic():
            lesson = LessonTest.objects.first()
            if lesson:
                UserLessonTestProgress.objects.get_or_create(user=instance, lesson_test=lesson)
            stats, _ = UserStats.objects.get_or_create(user=instance)
            if stats.exp is None:
                stats.exp = 0
            if stats.coins is None:
                stats.coins = 0
            stats.save()
    
            # Default avatars
            item = Item.objects.filter(rive_code=0, type="avatar").first()
            item2 = Item.objects.filter(rive_code=1, type="avatar").first()
            backpack1 = None
            print(item, item2)
            if item:
                backpack1 = BackpackItem.objects.create(user=instance, item=item)
            if item2:
                BackpackItem.objects.create(user=instance, item=item2)

            
            # Default background
            background_item = Item.objects.filter(type="background", price=0).first()
            backpackBackground = None
            if background_item:
                backpackBackground = BackpackItem.objects.create(user=instance, item=background_item)

            # Create cosmetics only if we have at least one equip item
            # if backpack1 and backpackBackground:
            UserCosmetics.objects.get_or_create(user=instance, defaults={
                'equipped_avatar': backpack1,
                'equipped_background': backpackBackground
            })
    except Exception:
        # Intentionally ignore to not block social signup
        pass
