from django.db import models

# Create your models here.
class Section(models.Model):
    
    lesson = models.ForeignKey('app_lesson.Lesson', on_delete=models.CASCADE, related_name='sections')
    name=models.CharField(max_length=200)
    description=models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)  
    updated_at = models.DateTimeField(auto_now=True)
    