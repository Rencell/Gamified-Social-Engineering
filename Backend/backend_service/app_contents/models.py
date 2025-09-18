
from django.db import models
from app_modules.models import Modules, ModuleTest
# Model
class Content(models.Model):
    modules = models.ForeignKey(ModuleTest, on_delete=models.CASCADE , related_name='contents')
    content_order = models.IntegerField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)    

    def __str__(self):
        return f"{self.modules}"
    
    def save(self, *args, **kwargs):
        if self._state.adding and not self.content_order:
            # Get the max order inside the same module
            last_order = Content.objects.filter(modules=self.modules).aggregate(
                models.Max("content_order")
            )["content_order__max"]

            self.content_order = (last_order or 0) + 1
        super().save(*args, **kwargs)
    
class ContentItem(models.Model):
    content = models.ForeignKey(Content, on_delete=models.CASCADE , related_name='content_items')
    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE, related_name='children')
    TYPE_CHOICES = [
        ('LearningSection', 'Learning Section'),
        ('LearningHeader', 'Learning Header'),
        ('LearningBody', 'Learning Body'),
        ('LearningList', 'Learning List'),
        ('LearningListItem', 'Learning List Item'),
        ('LearningListItemNumbered', 'Learning List Item Numbered'),
        ('LearningQuote', 'Learning Quote'),
        ('InteractiveMCQ', 'Interactive MCQ'),
        ('LearningImage2', 'Learning Image2'),
        ('FlippingCard', 'Flipping Card'),
        ('DescriptionList', 'Description List'),
    ]

    type = models.CharField(max_length=50, choices=TYPE_CHOICES)
    props = models.JSONField(default=dict, blank=True)
    item_order = models.IntegerField(default=1)
    
class ContentImage(models.Model):
    content_item = models.ForeignKey(ContentItem, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='content_images/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for {self.content_item.type} - {self.content_item.id}"   
    
    
class ContentQuiz(models.Model):
    module = models.ForeignKey(ModuleTest, on_delete=models.CASCADE , related_name='content_quiz')
    TYPE_CHOICES = [
        ('DoDont', 'Do and Dont'),
        ('MultipleChoice', 'Multiple Choice'),
        ('MatchingType', 'Matching Type'),
        ('DragPair', 'Drag Pair'),
        ('ModuleReward', 'Module Reward'),
        ('ScenarioTraining', 'Scenario Training'),
        ('FinalTest', 'Final Test'),
    ]
    pass_rate = models.IntegerField(default=1)
    quiz_limit = models.IntegerField(default=1)
    type = models.CharField(max_length=50, choices=TYPE_CHOICES)
    props = models.JSONField(default=dict, blank=True)
    
    
class ContentQuizImage(models.Model):
    content_quiz = models.ForeignKey(ContentQuiz, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='content_quiz/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for {self.content_quiz.type} - {self.content_quiz.id}"
   