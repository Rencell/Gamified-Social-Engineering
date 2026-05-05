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
        if self.ordering == 0 and not self.pk: 
            # Auto-increment for new items
            latest = simulationGuide.objects.all().order_by('-ordering').first()
            self.ordering = (latest.ordering + 1) if latest else 1
        elif self.pk:
            # Item is being updated - check for ordering conflicts
            old_item = simulationGuide.objects.get(pk=self.pk)
            old_ordering = old_item.ordering
            
            # If ordering changed, check if new ordering is already taken
            if self.ordering != old_ordering:
                existing_with_same_order = simulationGuide.objects.filter(ordering=self.ordering).exclude(pk=self.pk).first()
                if existing_with_same_order:
                    # Swap orderings: give the other item the old ordering using update() to avoid recursion
                    simulationGuide.objects.filter(pk=existing_with_same_order.pk).update(ordering=old_ordering)
        
        super().save(*args, **kwargs)