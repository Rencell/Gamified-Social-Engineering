from django.db import models


class Rank(models.Model):
    name = models.CharField(max_length=100, unique=True)
    min_level = models.PositiveIntegerField(default=1)
    
    class Meta:
        ordering = ['min_level']

    def __str__(self):
        return self.name

class Level(models.Model):
    number = models.PositiveIntegerField(unique=True)
    name = models.CharField(max_length=100)
    xp_required = models.PositiveIntegerField(default=0)
    rank = models.ForeignKey(Rank, on_delete=models.CASCADE, related_name='levels')
    
    class Meta:
        ordering = ['xp_required']

    def __str__(self):
        return self.name