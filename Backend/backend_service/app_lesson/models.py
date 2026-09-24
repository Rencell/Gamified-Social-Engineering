from django.db import models
from django.contrib.auth.models import User

class Lesson(models.Model):
    name = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)  
    updated_at = models.DateTimeField(auto_now=True) 

    users = models.ManyToManyField(User, through="UserLessonProgress", related_name='lesson')
    
    def __str__(self):
        return self.name


class UserLessonProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    completed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'user_lesson_progress'

    def __str__(self):
        return str(self.lesson)
class LessonTest(models.Model):
    
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True, null=True)
    image = models.ImageField(upload_to='lesson_tests/images/', null=True, blank=True)
    bg = models.CharField(max_length=7, default='#5a2653')  # Assuming hex color codes
    lesson_order = models.PositiveIntegerField(blank=True, null=True)
    objective = models.JSONField(default=list)
    description = models.TextField()
    

    class Meta:
        db_table = 'lesson_test'

    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        if self._state.adding and not self.slug:
            self.slug = self.title.lower().replace(' ', '-')
        if self._state.adding and not self.lesson_order:
            last_order = LessonTest.objects.aggregate(models.Max("lesson_order"))["lesson_order__max"]
            self.lesson_order = (last_order or 0) + 1
            
        super().save(*args, **kwargs)
    
class UserLessonTestProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    lesson_test = models.ForeignKey(LessonTest, on_delete=models.CASCADE)
    completed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'user_lesson_test_progress'

    def __str__(self):
        return str(self.lesson_test)