from django.db.models.signals import post_save
from django.dispatch import receiver
from app_modules.models import ModuleTest
from app_contents.models import ContentItem, ContentQuiz, Content

@receiver(post_save, sender=ModuleTest)
def handle_new_module(sender, instance, created, **kwargs):
    
    if created: 
        
        if not instance.final:
            Content.objects.create(
                modules=instance,
            )
            
            ContentQuiz.objects.create(
                module=instance,
                type='ModuleReward',
                props={},
            )
        else:
            ContentQuiz.objects.create(
                module=instance,
                type='FinalTest',
                pass_rate=75,
                props=[{
                    "type": "multiple-choice",
                    "image": "",
                    "question": "Your question here",
                    "options": [
                        { "id": "a", "text": "" },
                        { "id": "b", "text": "" },
                    ],
                    "correctAnswer": "",
                    "explanation": "",  
                }],
            )