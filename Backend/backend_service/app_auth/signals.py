from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from app_reward.models import UserStats
from app_lesson.models import Lesson, UserLessonProgress, UserLessonTestProgress, LessonTest
from app_cosmetic.models import UserCosmetics, BackpackItem, Item

@receiver(post_save, sender=User)
def handle_new_user_registration(sender, instance, created, **kwargs):
    if created:
        
        lesson = LessonTest.objects.first()
        
        user_lesson_progress = UserLessonTestProgress.objects.create(user=instance, lesson_test=lesson)
        user_lesson_progress.save()
        
        stats, _ = UserStats.objects.get_or_create(user=instance)
        stats.exp = 0
        stats.coins = 0
        stats.save()
        
        item = Item.objects.filter(rive_code=0, type="avatar").first()
        item2 = Item.objects.filter(rive_code=1, type="avatar").first()
        if item and item2:
            backpack1 = BackpackItem.objects.create(user=instance, item=item)
            BackpackItem.objects.create(user=instance, item=item2)
        else:
            raise ValueError("Default avatar(s) not found")
        
        background_item = Item.objects.filter(type="background", price=0).first()
        if not background_item:
            raise ValueError("Default background not found")
        backpackBackground = BackpackItem.objects.create(user=instance, item=background_item)
        
        UserCosmetics.objects.create(user=instance, equipped_avatar=backpack1, equipped_background=backpackBackground)
