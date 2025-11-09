from django.db import models

# Create your models here.
class Assessment(models.Model):
    
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True, null=True)
    description = models.TextField()
    image = models.ImageField(upload_to='assessment/images/', null=True, blank=True)
    bg = models.CharField(max_length=7)  # Assuming hex color codes
    duration = models.PositiveIntegerField(help_text="Duration in minutes")
    question_count = models.PositiveIntegerField()
    exp_points = models.PositiveIntegerField(default=0)
    coin_points = models.PositiveIntegerField(default=0)
    difficulty_level = models.CharField(max_length=50)
    instructions = models.JSONField(default=list)
    
    class Meta:
        db_table = 'assessment'
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if self._state.adding and not self.slug:
            self.slug = self.name.lower().replace(' ', '-')
            
        super().save(*args, **kwargs)

class Question(models.Model):
    
    QUESTION_TYPES = [
        ('multiple_choice', 'Multiple Choice'),
        ('image_choice', 'Image Choice'),
    ]
    assessment = models.ForeignKey(Assessment, related_name='questions', on_delete=models.CASCADE)
    question_type = models.CharField(max_length=20, choices=QUESTION_TYPES)
    text = models.TextField()
    image = models.ImageField(upload_to='questions/images/', null=True, blank=True)
    order = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.text or f"{self.question_type} (#{self.order})"
    
    class Meta:
        db_table = 'question'
        
        
class Option(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='options')
    text = models.CharField(max_length=255, blank=True, null=True)
    image = models.ImageField(upload_to='options/images/', null=True, blank=True)
    is_correct = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.text or f"Option #{self.order}"    
    

import secrets
from django.utils import timezone

def generate_session_id():
    # Generates short, URL-safe token like "G3OMTIH1"
    return secrets.token_urlsafe(6).upper()


class AssessmentSession(models.Model):
    
    STATUS = [
        ('not_started', 'Not Started'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),]
    
    assessment = models.ForeignKey(Assessment, on_delete=models.CASCADE)
    session_id = models.CharField(max_length=12, unique=True, default=generate_session_id)
    status = models.CharField(max_length=20, choices=STATUS, default='not_started')
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    score = models.FloatField(default=0.0)
    
    current_question_index = models.PositiveIntegerField(default=0)
    completed_questions = models.JSONField(default=list)

    class Meta:
        db_table = 'assessment_session'
    
    def __str__(self):
        return f"Session for {self.user.username} - {self.assessment.name}"
    
    
     # --- Helper methods ---
    def start(self):
        if self.status == 'not_started':
            self.status = 'in_progress'
            self.started_at = timezone.now()
            self.save()


class AssessmentAnswer(models.Model):
    session = models.ForeignKey(AssessmentSession, on_delete=models.CASCADE, related_name='answers')
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    selected_option = models.ForeignKey(Option, on_delete=models.SET_NULL, null=True)
    is_correct = models.BooleanField(default=False)
    answered_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'assessment_answer'
        unique_together = ('session', 'question')