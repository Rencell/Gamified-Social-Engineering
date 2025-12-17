from django.db import models
from django.contrib.auth.models import User
from app_section.models import Section
from app_lesson.models import Lesson, LessonTest
from django.utils.text import slugify

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
    

class ModuleTest(models.Model):
    lesson = models.ForeignKey(LessonTest, on_delete=models.CASCADE, related_name='module_tests')
    section = models.ForeignKey(Section, on_delete=models.CASCADE, related_name='modules')
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True, null=True)
    module_order = models.IntegerField(blank=True, null=True)
    unlocks_lesson = models.ForeignKey(LessonTest, on_delete=models.SET_NULL, null=True, blank=True, related_name='unlocks_module_tests')
    final = models.BooleanField(default=False)
    users = models.ManyToManyField(User, through="UserModuleTestProgress", related_name='modules_test')
    
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        if self._state.adding and not self.slug:
            base_slug = slugify(self.title)
            candidate = base_slug
            if ModuleTest.objects.filter(slug=candidate).exists():
                counter = 2
                candidate = f"{base_slug}{counter}"
                while ModuleTest.objects.filter(slug=candidate).exists():
                    counter += 1
                    candidate = f"{base_slug}{counter}"
            self.slug = candidate
            
        if self._state.adding and not self.module_order:
            last_order = ModuleTest.objects.filter(lesson=self.lesson).aggregate(
                models.Max("module_order")
                )["module_order__max"]
            self.module_order = (last_order or 0) + 1
            
        if self._state.adding and not self.unlocks_lesson:
            isFinal = self.final == True
            if isFinal:
                next_lesson = LessonTest.objects.filter(
                    lesson_order__gt=self.lesson.lesson_order  # strictly greater
                ).order_by("lesson_order").first()
                if next_lesson:
                    self.unlocks_lesson = next_lesson
            else:
                self.unlocks_lesson = self.lesson

        super().save(*args, **kwargs)

class ModuleSource(models.Model):
    module = models.ForeignKey(ModuleTest, on_delete=models.CASCADE, related_name="sources")
    title = models.CharField(max_length=255)
    url = models.URLField()
    
    def __str__(self):
        return self.title

class UserModuleTestProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    module_test = models.ForeignKey(ModuleTest, on_delete=models.CASCADE)
    completed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'user_module_test_progress'

    def __str__(self):
        return str(self.module_test)