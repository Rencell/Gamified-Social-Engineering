from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import RewardLog, UserStats
from app_level.models import Level


@receiver(post_save, sender=RewardLog)
def log_reward_change(sender, instance, created, **kwargs):
    if created:
        stats, _ = UserStats.objects.get_or_create(user=instance.user)
        stats.exp += instance.xp
        stats.coins += instance.coin
        stats.save()
        
        if stats.exp >= stats.level.xp_required:
            next_level = Level.objects.filter(xp_required__gt=stats.level.xp_required).first()
            
            if next_level:
                stats.level = next_level
                stats.save()
                print(f"{instance.user.username} leveled up to {next_level.name}!")
