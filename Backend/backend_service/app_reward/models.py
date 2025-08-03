from django.db import models
from django.contrib.auth.models import User


class UserStats(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='stats')
    exp = models.IntegerField(default=0)
    coins = models.IntegerField(default=0)
    level = models.IntegerField(default=1)

    def __str__(self):
        return f"{self.user.username} | XP: {self.exp} | Coins: {self.coins}"

class RewardLog(models.Model):
    ACTION_CHOICES = [
        ('increase', 'Increase'),
        ('decrease', 'Decrease'),
    ]

    REASON_CHOICES = [
        ('content', 'content'),
        ('quiz', 'Quiz'),
        ('bonus', 'Bonus'),
        ('spend', 'Spend'),
        ('admin', 'Admin Adjustment'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reward_logs')
    action = models.CharField(max_length=10, choices=ACTION_CHOICES)
    reason = models.CharField(max_length=20, choices=REASON_CHOICES)
    coin = models.IntegerField(default=0)  # Can be negative
    xp = models.IntegerField(default=0)    # Can be negative for penalties
    timestamp = models.DateTimeField(auto_now_add=True)