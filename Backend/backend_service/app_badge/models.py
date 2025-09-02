from django.db import models
from django.contrib.auth.models import User
# Create your models here.
class Badge(models.Model):
    
    name = models.CharField(max_length=200)
    lesson = models.ForeignKey('app_lesson.Lesson', on_delete=models.CASCADE, related_name='badges')
    created_at = models.DateTimeField(auto_now_add=True)  
    updated_at = models.DateTimeField(auto_now=True) 
    
    # ManyToMany with Users
    users = models.ManyToManyField(User, through='UserBadge', related_name='badges')
    
    def __str__(self):
        return self.name

class UserBadge(models.Model):
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE)
    completed_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'user_badge'
        
    def __str__(self):
        return str(self.user) 