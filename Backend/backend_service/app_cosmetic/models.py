from django.db import models
from django.conf import settings


class Item(models.Model):
    ITEM_TYPE_CHOICES = [
        ('avatar', 'Avatar'),
        ('background', 'Background'),
    ]
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=20, choices=ITEM_TYPE_CHOICES)
    image = models.ImageField(upload_to='items/')
    price = models.PositiveIntegerField(default=0)
    rive_code = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name


class BackpackItem(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    acquired_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'item')

    def __str__(self):
        return f"{self.user.username} owns {self.item.name}"
    
    
class UserCosmetics(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    equipped_avatar = models.ForeignKey(BackpackItem, on_delete=models.SET_NULL, null=True, blank=True, related_name='equipped_avatar')
    equipped_background = models.ForeignKey(BackpackItem, on_delete=models.SET_NULL, null=True, blank=True, related_name='equipped_background')
    
    def __str__(self):
        return f"{self.user.username}'s Cosmetics"
