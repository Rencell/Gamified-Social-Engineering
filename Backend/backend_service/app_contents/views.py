from rest_framework import serializers, viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.routers import DefaultRouter
from django.conf import settings
from django.urls import path, include
from .models import Content, ContentItem, ContentImage, ContentQuiz, ContentQuizImage
from .serializers import ContentSerializer, ContentItemSerializer, ContentImageSerializer, ContentQuizSerializer, ContentQuizImageSerializer
from openai import OpenAI
from .ai.quiz_utils import QuizPropsSchema, QuizPropsRules, QUIZ_GENERATION_RULES, is_supported_quiz_type
from .ai.ai_studio_code import generate_quiz_json
from app_modules.models import ModuleTest
import json

# Create your views here.
class ContentViewSet(viewsets.ModelViewSet):
    queryset = Content.objects.all()
    serializer_class = ContentSerializer
    
    @action(detail=True, methods=['get'], url_path='list-content-items', url_name='list-content-items')
    def list_contents_items_on_parent(self, request, pk=None):
        try:
            content = self.get_object()
        except Content.DoesNotExist:
            return Response(status=404)

        unlocked_contents = ContentItem.objects.filter(content=content)    
        
        serializer = ContentItemSerializer(unlocked_contents, many=True)
        return Response(serializer.data, status=200)
    
class ContentItemViewSet(viewsets.ModelViewSet):
    queryset = ContentItem.objects.all()
    serializer_class = ContentItemSerializer
    
    @action(detail=False, methods=['delete'], url_path='batch-delete')
    def batch_delete(self, request):
        ids = request.data.get('ids', [])
        if not isinstance(ids, list) or not all(isinstance(i, int) for i in ids):
            return Response({"detail": "Invalid IDs"}, status=status.HTTP_400_BAD_REQUEST)

        deleted_count, _ = ContentItem.objects.filter(id__in=ids).delete()
        return Response({"deleted": deleted_count}, status=status.HTTP_200_OK)
    
    # client = OpenAI(api_key=settings.OPENAI_API_KEY)
    
    @action(detail=False, methods=['post'])
    def generate_quiz_items(self, request):
        allowed_types = [
            "LearningHeader",
            "LearningBody",
            "LearningListItem",
            "LearningListItemNumbered",
            "FlippingCard",
            "DescriptionList",
            "LearningQuote"
        ]
        
        QUIZ_CHOICES = [
            'DoDont',
            'MultipleChoice',
            'MatchingType',
            'DragPair',
            'PhishingTactics',
            'ScenarioTraining',
            'FinalTest',
        ]
        
        # Prefer JSON payload for POST; fall back to query params for backward compatibility.
        module_id = request.data.get('moduleId')
        quiz = request.data.get('quiz')
        total = request.data.get('total', 1)
        withInstruction = request.data.get('generate', 1)
        QUIZ_NUMBER_RULES = f""". Generate {total} quiz items inside one prop key."""
        
        if not module_id:
            return Response({"detail": "moduleId is required"}, status=status.HTTP_400_BAD_REQUEST)

        if not quiz:
            return Response({"detail": "quiz is required"}, status=status.HTTP_400_BAD_REQUEST)

        if quiz not in QUIZ_CHOICES:
            return Response({"detail": f"quiz must be one of {', '.join(QUIZ_CHOICES)}"}, status=status.HTTP_400_BAD_REQUEST)

        items = ContentItem.objects.filter(
            content__modules_id=module_id,
            type__in=allowed_types
        ).order_by("item_order")

        headlines = []
        facts = []
        for item in items:
            if item.type == "FlippingCard":
                for card in item.props.get("data", []):
                    facts.append(f"{card.get('front', '')}: {card.get('back', '')}")
            elif item.type == "LearningHeader":
                headlines.append(item.props.get("text"))
            else:
                facts.append(item.props.get("text"))
        prompt_payload = {
            "rules": QUIZ_NUMBER_RULES +  QUIZ_GENERATION_RULES + QuizPropsRules(quiz) ,
            "quiz_props": QuizPropsSchema(quiz),
            "context": {
                "headlines": [h for h in headlines if h],
                "facts": [f for f in facts if f],
                "OptionalInstructions": withInstruction if withInstruction else ""
            }
        }
        
        prompt = json.dumps(prompt_payload, ensure_ascii=False)

        try:
            output_text = generate_quiz_json(prompt)
        except Exception as e:
            return Response(
                {"detail": "AI generation failed", "error": str(e)},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        return Response(
            {
                "prompt": prompt_payload,
                "output_text": output_text,
            },
            status=status.HTTP_200_OK,
        )
    
class ContentImageViewSet(viewsets.ModelViewSet):
    queryset = ContentImage.objects.all()
    serializer_class = ContentImageSerializer
    
class ContentQuizViewSet(viewsets.ModelViewSet):
    queryset = ContentQuiz.objects.all()
    serializer_class = ContentQuizSerializer
    
    
    @action(detail=False, methods=['get'], url_path='by-module')
    def get_quizzes_by_module(self, request):
        module_id = request.query_params.get('moduleId')
        if not module_id:
            return Response({"detail": "moduleId is required"}, status=status.HTTP_400_BAD_REQUEST)

        quizzes = ContentQuiz.objects.filter(module_id=module_id).first()
        serializer = self.get_serializer(quizzes)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class ContentQuizImageViewSet(viewsets.ModelViewSet):
    queryset = ContentQuizImage.objects.all()
    serializer_class = ContentQuizImageSerializer
