from django.db import models
from django.contrib.auth.models import User


class UserStreak(models.Model):
    user_id = models.OneToOneField(User, on_delete=models.CASCADE)
    current_streak = models.IntegerField()
    longest_streak = models.IntegerField()
    last_activity_date = models.DateField()
    streak_start_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"User {self.user_id}: Current Streak {self.current_streak}, Longest Streak {self.longest_streak}"


class Activity(models.Model):
    user = models.ForeignKey("auth.User", on_delete=models.CASCADE)
    date = models.DateField()

    class Meta:
        unique_together = ("user", "date")  # Prevent duplicates