from django.db import models

# Create your models here.
class AgreementSection(models.Model):
    title = models.CharField(max_length=200)
    type = models.CharField(max_length=50)  # e.g., 'privacy_policy', 'terms_of_service'
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
    
class Agreement(models.Model):
    agreement_section = models.ForeignKey(AgreementSection, on_delete=models.CASCADE, related_name='agreements')
    title = models.CharField(max_length=200)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.title
    
    
    
class simulationGuide(models.Model):
    
    TYPE_CHOICES = [
        ('safeBrowsing', 'Safe Browsing'),
        ('phishing', 'Phishing'),
        ('smishing', 'Smishing'),
        ('vishing', 'Vishing'),
    ]
    title = models.CharField(max_length=200)
    description = models.TextField()
    type = models.CharField(max_length=50, choices=TYPE_CHOICES) 
    image = models.ImageField(upload_to='simulation/guides/', blank=True, null=True)
    image_alt_text = models.CharField(max_length=255, blank=True)
    ordering = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        # Operate ordering within the same `type` group so each type has its own sequence.
        if self.ordering == 0 and not self.pk:
            # Auto-increment for new items within this type
            latest = simulationGuide.objects.filter(type=self.type).order_by('-ordering').first()
            self.ordering = (latest.ordering + 1) if latest else 1
        elif self.pk:
            # Item is being updated - check for ordering conflicts within types
            old_item = simulationGuide.objects.get(pk=self.pk)
            old_ordering = old_item.ordering
            old_type = old_item.type

            # If ordering changed or the type changed, resolve conflicts per-type
            if self.ordering != old_ordering or self.type != old_type:
                # If new ordering conflicts within the new type, adjust other items
                existing_with_same_order = simulationGuide.objects.filter(type=self.type, ordering=self.ordering).exclude(pk=self.pk).first()
                if existing_with_same_order:
                    # If staying in the same type, swap orderings
                    if self.type == old_type:
                        simulationGuide.objects.filter(pk=existing_with_same_order.pk).update(ordering=old_ordering)
                    else:
                        # Moving to a different type: shift down existing items at/after this ordering
                        simulationGuide.objects.filter(type=self.type, ordering__gte=self.ordering).exclude(pk=self.pk).update(ordering=models.F('ordering') + 1)

                # If we moved out of the old type, close the gap there
                if self.type != old_type:
                    simulationGuide.objects.filter(type=old_type, ordering__gt=old_ordering).exclude(pk=self.pk).update(ordering=models.F('ordering') - 1)

        super().save(*args, **kwargs)