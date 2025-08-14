from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from app_reward.models import UserStats
from app_lesson.models import Lesson, UserLessonProgress
from app_cosmetic.models import UserCosmetics, BackpackItem, Item

@receiver(post_save, sender=User)
def handle_new_user_registration(sender, instance, created, **kwargs):
    if created:
        
        lesson = Lesson.objects.filter(id=1).first()
        
        user_lesson_progress = UserLessonProgress.objects.create(user=instance, lesson=lesson)
        user_lesson_progress.save()
        
        stats, _ = UserStats.objects.get_or_create(user=instance)
        stats.exp = 0
        stats.coins = 0
        stats.save()
        
        item = Item.objects.filter(rive_code=0, type="avatar").first()
        if item:
            backpack = BackpackItem.objects.create(user=instance, item=item)
        else:
            raise ValueError("Default avatar not found")
        
        item = Item.objects.filter(type="background", price=0).first()
        backpackBackground = BackpackItem.objects.create(user=instance, item=item)
        
        UserCosmetics.objects.create(user=instance, equipped_avatar=backpack, equipped_background=backpackBackground)
