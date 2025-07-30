# Django REST API Backend Plan

This document outlines a structured plan for developing the social engineering gamification backend using Django and Django REST Framework (DRF).

## 1. Project Setup & App Structure

To keep the project organized and scalable, we will follow Django's philosophy of breaking the project into logical applications.

- **Run these commands to create the apps:**
  ```bash
  python manage.py startapp courses
  python manage.py startapp gamification
  python manage.py startapp users
  ```

- **Register the new apps in `backend_service/settings.py`:**

  ```python
  INSTALLED_APPS = [
      # ... other apps
      'rest_framework',
      'courses',
      'gamification',
      'users',
  ]
  ```

## 2. Core Content: Courses & Lessons

This is the foundation of your platform. We'll start by defining the data models.

### Step 2.1: Models (`courses/models.py`)

Define the database structure for courses and lessons.

```python
from django.db import models

class Course(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class Lesson(models.Model):
    course = models.ForeignKey(Course, related_name='lessons', on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    content = models.TextField()
    order = models.PositiveIntegerField(help_text="Order of the lesson within the course")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.course.title} - {self.title}"
```

### Step 2.2: Serializers (`courses/serializers.py`)

Create serializers to convert our model instances into JSON.

```python
from rest_framework import serializers
from .models import Course, Lesson

class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ['id', 'title', 'content', 'order']

class CourseSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'lessons']
```

### Step 2.3: Views (`courses/views.py`)

Create `ViewSets` to handle the API logic (CRUD operations).

```python
from rest_framework import viewsets
from .models import Course, Lesson
from .serializers import CourseSerializer, LessonSerializer

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
```

### Step 2.4: URLs (`backend_service/urls.py` and `courses/urls.py`)

Wire up the URLs to expose the API endpoints.

- **Create `courses/urls.py`:**
  ```python
  from django.urls import path, include
  from rest_framework.routers import DefaultRouter
  from .views import CourseViewSet, LessonViewSet

  router = DefaultRouter()
  router.register(r'courses', CourseViewSet)
  router.register(r'lessons', LessonViewSet)

  urlpatterns = [
      path('', include(router.urls)),
  ]
  ```

- **Include it in the main `backend_service/urls.py`:**
  ```python
  from django.contrib import admin
  from django.urls import path, include

  urlpatterns = [
      path('admin/', admin.site.urls),
      path('api/', include('courses.urls')), # Add this line
  ]
  ```

## 3. Gamification Features

Now, let's model the gamification elements.

### Step 3.1: Models (`gamification/models.py`)

We need models for Badges and a way to track user-specific awards.

```python
from django.db import models
from django.conf import settings

class Badge(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    # You can use an ImageField if you want to store badge icons
    # icon = models.ImageField(upload_to='badges/')

    def __str__(self):
        return self.name

class UserBadge(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE)
    awarded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'badge'] # A user can only get a badge once
```

### Step 3.2: User Profile (`users/models.py`)

To store EXP and Coins, it's best to create a `UserProfile` model that has a one-to-one relationship with Django's built-in `User` model.

```python
from django.db import models
from django.conf import settings

class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    exp = models.PositiveIntegerField(default=0)
    coins = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.user.username
```

*Next steps for gamification would be to create Serializers and ViewSets for these models, following the same pattern as in Step 2.* 

## 4. Implementation & Testing Workflow

1.  **Models First:** Define your models in the respective `models.py` files.
2.  **Migrate:** Run `python manage.py makemigrations` and `python manage.py migrate` to apply the schema to your database.
3.  **Serializers:** Create the corresponding `serializers.py` for each app.
4.  **Views:** Create the `views.py` to handle the logic.
5.  **URLs:** Configure the `urls.py` to expose the API endpoints.
6.  **Test:** Use a tool like Postman or `curl` to interact with your API endpoints (e.g., `GET /api/courses/`, `POST /api/courses/`) to ensure they work as expected.
