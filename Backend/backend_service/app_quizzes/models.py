from django.db import models
from django.contrib.auth.models import User
from app_modules.models import Modules, ModuleTest
# Create your models here.

class QuizType(models.Model):
    name = models.CharField(max_length=100, unique=True)
    

class QuizProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    module = models.ForeignKey(ModuleTest, on_delete=models.CASCADE, related_name='quiz_progress')
    score = models.IntegerField(default=0)
    quiz_type = models.CharField(QuizType, default=1) 
    total_questions = models.IntegerField(default=0)
    time_spent = models.IntegerField(default=1, null=True, blank=True)
    attempt_number = models.IntegerField(default=1)
    accuracy = models.FloatField(default=0.0)
    pass_fail = models.BooleanField(default=True)
    completed_at = models.DateTimeField(auto_now_add=True)
    