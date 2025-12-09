from django.db import models
from django.contrib.auth.models import User
# Create your models here.


class PopupScenario(models.Model):
     
    name = models.CharField(max_length=100) 
    category = models.CharField(max_length=50, default="malvertising") 
    difficulty = models.CharField(max_length=50, default="normal")

    def __str__(self):
        return f"Scenario {self.id}"
    
class PopupTriggerLog(models.Model):
    
    STATUS = [
        ('waiting', 'Waiting'),
        ('clicked', 'Clicked'),
        ('closed', 'Closed'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    scenario = models.ForeignKey(PopupScenario, on_delete=models.CASCADE)
    date_triggered = models.DateField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS, default='waiting')
    reaction_time = models.FloatField(null=True, blank=True)  # seconds
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'scenario', 'date_triggered')  # prevents duplicate popup per day

    def __str__(self):
        return f"{self.user.username} - {self.scenario} on {self.date_triggered}"