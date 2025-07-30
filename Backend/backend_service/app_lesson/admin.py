from django.contrib import admin

# Register your models here.
from .models import UserLessonProgress, Lesson

admin.site.register(UserLessonProgress)
admin.site.register(Lesson)