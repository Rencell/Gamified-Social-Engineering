from django.db import models
from django.contrib.auth.models import User

class GophishEvent(models.Model):
    # raw event
    received_at = models.DateTimeField(auto_now_add=True)
    gophish_time = models.DateTimeField()      
    message = models.CharField(max_length=100) 
    details = models.JSONField(default=dict, blank=True)              
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)  

    class Meta:
        indexes = [
            models.Index(fields=['user', 'message']),  # updated index to include user
            models.Index(fields=['gophish_time']),
        ]
        
class GophishUserScore(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    emails_sent = models.PositiveIntegerField(default=0)
    links_clicked = models.PositiveIntegerField(default=0)
    data_submitted = models.PositiveIntegerField(default=0)

    security_score = models.IntegerField(default=100)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - Score: {self.security_score}"
    
class GophishUserScoreSms(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    number_sent = models.PositiveIntegerField(default=0)
    links_clicked = models.PositiveIntegerField(default=0)
    data_submitted = models.PositiveIntegerField(default=0)

    security_score = models.IntegerField(default=100)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - Score: {self.security_score}"

    
class GophishConsent(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    email_consent = models.BooleanField(default=False)
    phone_consent = models.BooleanField(default=False)
    given_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.username} consent (email={self.email_consent}, phone={self.phone_consent})"
        
import random

class UserPhoneNumber(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    phone = models.CharField(max_length=20)
    dummy_number = models.CharField(max_length=20, blank=True, null=True)
    verified = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.user.username} - {self.phone} ({'verified' if self.verified else 'unverified'})"

    def generate_dummy_us_number(self):
        while True:
            number = f"+1650{random.randint(1000000, 9999999)}"

            # Check uniqueness
            if not UserPhoneNumber.objects.filter(dummy_number=number).exists():
                return number

    def save(self, *args, **kwargs):
        if not self.dummy_number:
            self.dummy_number = self.generate_dummy_us_number()

        super().save(*args, **kwargs)