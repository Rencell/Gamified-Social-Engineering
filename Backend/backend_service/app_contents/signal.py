from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import Content, ContentItem
@receiver(post_save, sender=Content)
def handle_new_remove_section(sender, instance, created, **kwargs):
    
    if created: 
        section = ContentItem.objects.create(
            content=instance,
            parent=None,
            type='LearningSection',
            props={},
        )
        
        ContentItem.objects.create(
            content=instance,
            parent=section,
            type='LearningHeader',
            props={'text': "New Header"},
            item_order=1,
        )
        ContentItem.objects.create(
            content=instance,
            parent=section,
            type='LearningBody',
            props={'text': "**Lorem Ipsum** is simply dummy text of the printing and typesetting industry."},
            item_order=2,
        )
    
        
        