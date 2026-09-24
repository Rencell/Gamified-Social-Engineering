from django.db import models
from django.contrib.auth.models import User
# Create your models here.
class VishingScenario(models.Model):
    
    STATUS = [
        ('GAVE_INFORMATION', 'GAVE_INFORMATION'),
        ('REFUSED', 'REFUSED'),
        ('UNAUDIBLE', 'UNAUDIBLE'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS, default='waiting')
    created_at = models.DateTimeField(auto_now_add=True)
    