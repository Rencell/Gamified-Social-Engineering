from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import RewardLog, UserStats


@receiver(post_save, sender=RewardLog)
def log_reward_change(sender, instance, created, **kwargs):
    if created:
        stats, _ = UserStats.objects.get_or_create(user=instance.user)
        stats.exp += instance.xp
        stats.coins += instance.coin
        stats.save()
