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