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
    
    
class GophishConsent(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    email_consent = models.BooleanField(default=False)
    phone_consent = models.BooleanField(default=False)
    given_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.username} consent (email={self.email_consent}, phone={self.phone_consent})"
        
class UserPhoneNumber(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    phone = models.CharField(max_length=20)
    verified = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.user.username} - {self.phone} ({'verified' if self.verified else 'unverified'})"