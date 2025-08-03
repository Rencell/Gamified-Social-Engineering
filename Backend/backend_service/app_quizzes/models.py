from django.db import models
from django.contrib.auth.models import User
from app_modules.models import Modules
# Create your models here.

class QuizType(models.Model):
    name = models.CharField(max_length=100, unique=True)
    

class QuizProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    module = models.ForeignKey(Modules, on_delete=models.CASCADE)
    score = models.IntegerField(default=0)
    quiz_type = models.CharField(QuizType, default=1) 
    total_questions = models.IntegerField(default=0)
    completed_at = models.DateTimeField(auto_now_add=True)