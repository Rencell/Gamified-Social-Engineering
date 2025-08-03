from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from app_reward.models import UserStats
from app_lesson.models import Lesson, UserLessonProgress

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
