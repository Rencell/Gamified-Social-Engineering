from django.db import models
from django.core.validators import FileExtensionValidator

class MiniGame(models.Model):

    name = models.CharField(max_length=100)
    required_level = models.IntegerField(default=1)
    route_path = models.CharField(max_length=255)   # e.g., "/games/matching"
    thumbnail = models.FileField(
        upload_to='minigames/',
        blank=True,
        null=True,
        validators=[FileExtensionValidator(allowed_extensions=['svg', 'png', 'jpg', 'jpeg', 'webp'])]
    )
    card_color = models.CharField(max_length=7, default='#FFFFFF')
    is_daily = models.BooleanField(default=False) 
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

