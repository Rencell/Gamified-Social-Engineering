from django.db import models
from django.contrib.auth.models import User
from app_lesson.models import Lesson

class Modules(models.Model):
    name = models.CharField(max_length=200)
    phase_order = models.IntegerField()
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='modules')
    created_at = models.DateTimeField(auto_now_add=True)  
    updated_at = models.DateTimeField(auto_now=True) 

    users = models.ManyToManyField(User, through="UserModuleProgress", related_name='modules')
    
    def __str__(self):
        return self.name
    

class UserModuleProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    module = models.ForeignKey(Modules, on_delete=models.CASCADE)
    completed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'user_module_progress'

    def __str__(self):
        return str(self.module)