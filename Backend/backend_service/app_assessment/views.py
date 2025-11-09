from django.http import JsonResponse
from django.shortcuts import render
from .serializers import AssessmentSerializer, QuestionSerializer, OptionSerializer, AssessmentSessionSerializer, AssessmentAnswerSerializer
from rest_framework import viewsets
from .models import Assessment, Question, Option, AssessmentSession, AssessmentAnswer
from rest_framework.response import Response
from rest_framework.decorators import action


class AssessmentViewSet(viewsets.ModelViewSet):
    queryset = Assessment.objects.all()
    serializer_class = AssessmentSerializer
    lookup_field = 'slug'
    
    def get_object(self):
        lookup_value = self.kwargs.get('slug')
        if lookup_value.isdigit():
            return self.queryset.get(pk=lookup_value)
        return self.queryset.get(slug=lookup_value)
    
class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    
    def get_queryset(self):
        queryset = Question.objects.all()
        assessment_id = self.request.query_params.get('assessment')
        if assessment_id:
            queryset = queryset.filter(assessment_id=assessment_id)
        return queryset
            
class OptionViewSet(viewsets.ModelViewSet):
    queryset = Option.objects.all()
    serializer_class = OptionSerializer    
    
class AssessmentSessionViewSet(viewsets.ModelViewSet):
    queryset = AssessmentSession.objects.all()
    serializer_class = AssessmentSessionSerializer
    
    @action(detail=False, methods=['get'])
    def get_session(self, request):
        session_id = request.query_params.get('session_id')
        try:
            session = AssessmentSession.objects.filter(session_id=session_id).first()
            if not session:
                raise AssessmentSession.DoesNotExist
            serializer = self.get_serializer(session)
            return Response(serializer.data)
        except AssessmentSession.DoesNotExist:
            return Response({'error': 'Session not found'}, status=404)
        
    @action(detail=False, methods=['post'])
    def start_session(self, request):
        assessment_id = request.data.get('assessment_id')
        try:
            assessment = Assessment.objects.get(id=assessment_id)
            session, _ = AssessmentSession.objects.get_or_create(
                user=request.user, 
                assessment=assessment, 
                status='in_progress'
            )
            serializer = self.get_serializer(session)
            return Response(serializer.data)
        except Assessment.DoesNotExist:
            return Response({'error': 'Assessment not found'}, status=404)    
        
        
class AssessmentAnswerViewSet(viewsets.ModelViewSet):
    queryset = AssessmentAnswer.objects.all()
    serializer_class = AssessmentAnswerSerializer