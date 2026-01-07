from django.db import models
from django.core.validators import FileExtensionValidator
from django.contrib.auth.models import User
from django.utils.text import slugify
# Create your models here.
class Badge(models.Model):
    name = models.CharField(max_length=200)
    code = models.SlugField(max_length=80, unique=True, blank=True)
    description = models.TextField()
    image = models.FileField(upload_to='badges/', null=True, blank=True, validators=[FileExtensionValidator(allowed_extensions=['svg', 'png', 'jpg', 'jpeg', 'webp'])])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # ManyToMany with Users
    users = models.ManyToManyField(User, through='UserBadge', related_name='badges')

    def save(self, *args, **kwargs):
        base = slugify(self.name or "")
        if not base:
            base = "badge"
        # Regenerate code if empty or name changed relative to current code prefix
        if not self.code or not self.code.startswith(base):
            candidate = base
            i = 2
            qs = Badge.objects.exclude(pk=self.pk)
            while qs.filter(code=candidate).exists():
                candidate = f"{base}-{i}"
                i += 1
            self.code = candidate
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({self.code})"

class UserBadge(models.Model):
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE)
    completed_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'user_badge'
        
    def __str__(self):
        return str(self.user) 