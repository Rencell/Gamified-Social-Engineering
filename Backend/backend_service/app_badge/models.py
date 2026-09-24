from django.db import models
from django.core.validators import FileExtensionValidator
from django.contrib.auth.models import User
from django.utils.text import slugify

# Create your models here.
class Badge(models.Model):
    name = models.CharField(max_length=200)
    code = models.SlugField(max_length=80, unique=True, blank=True)
    description = models.TextField()

    # Use as the badge icon asset.
    
    image = models.FileField(
        upload_to='badges/',
        null=True,
        blank=True,
        validators=[FileExtensionValidator(allowed_extensions=['svg', 'png', 'jpg', 'jpeg', 'webp'])],
    )

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    users = models.ManyToManyField(User, through='UserBadge', related_name='badges')

    @property
    def icon(self):
        # Convenience alias to align with 'icon' naming in your prompt.
        return self.image

    @property
    def rule(self):
        # Convenience for single-rule badges. If you later support multiple rules,
        # switch this to `rules.all()` in serializers.
        return getattr(self, "badge_rule", None)

    def save(self, *args, **kwargs):
        base = slugify(self.name or "")
        if not base:
            base = "badge"
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


class BadgeRule(models.Model):
    class BadgeType(models.TextChoices):
        STREAK = "streak", "Streak"
        COMPLETION = "completion", "Completion"
        COUNT = "count", "Count"

    class TargetEntity(models.TextChoices):
        LOGIN = "login", "Login"
        LESSON = "lesson", "Lesson"
        MODULE = "module", "Module"
        QUIZ = "quiz", "Quiz"

    badge = models.OneToOneField(
        Badge,
        on_delete=models.CASCADE,
        related_name="badge_rule",
    )

    type = models.CharField(max_length=20, choices=BadgeType.choices, default=BadgeType.COUNT)
    target_value = models.PositiveIntegerField(default=1)
    target_entity = models.CharField(max_length=50, choices=TargetEntity.choices)
    target_entity_id = models.PositiveIntegerField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Rule for {self.badge.code}: {self.type} {self.target_entity} -> {self.target_value}"


class UserBadge(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE)
    completed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'user_badge'
        constraints = [
            models.UniqueConstraint(fields=['user', 'badge'], name='uniq_user_badge'),
        ]

    def __str__(self):
        return str(self.user)