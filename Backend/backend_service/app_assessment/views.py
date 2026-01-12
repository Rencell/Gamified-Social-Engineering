from django.utils import timezone
from django.http import JsonResponse
from django.shortcuts import render
from .serializers import AssessmentSerializer, QuestionSerializer, OptionSerializer, AssessmentSessionSerializer, AssessmentAnswerSerializer, AssessmentCompleteSerializer
from rest_framework import viewsets, status
from .models import Assessment, Question, Option, AssessmentSession, AssessmentAnswer, AssessmentComplete
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
        
        if assessment_id and assessment_id.isdigit():
            queryset = queryset.filter(assessment_id=assessment_id)
        elif assessment_id:
            assessment_id = Assessment.objects.filter(slug=assessment_id).first().id
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
    def has_completed(self, request):
        assessment_id = request.data.get('assessment_id')
        try:
            assessment = Assessment.objects.get(id=assessment_id)
            session = AssessmentSession.objects.filter(
                user=request.user, 
                assessment=assessment, 
                status='completed'
            ).last()
            if session:
                serializer = self.get_serializer(session)
                return Response(serializer.data)
            else:
                return Response(None)
            
        except Assessment.DoesNotExist:
            return Response({'error': 'Assessment not found'}, status=404)
    
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
          
    @action(detail=False, methods=['post'])
    def continute_session(self, request):
        assessment_id = request.data.get('assessment_id')
        try:
            assessment = Assessment.objects.get(id=assessment_id)
            session = AssessmentSession.objects.filter(
                user=request.user, 
                assessment=assessment, 
                status='in_progress'
            ).first()
            if session:
                serializer = self.get_serializer(session)
                return Response(serializer.data)
            else:
                return Response(None)
        except Assessment.DoesNotExist:
            return Response({'error': 'Assessment not found'}, status=404)  
    
    @action(detail=False, methods=['post'])
    def timeout_session(self, request):
        session_id = request.data.get('session_id')
        try:
            session = AssessmentSession.objects.filter(session_id=session_id).first() 
            if not session:
                raise AssessmentSession.DoesNotExist
            session.status = 'timeout'
            session.save()
            serializer = self.get_serializer(session)
            return Response(serializer.data)
        except AssessmentSession.DoesNotExist:
            return Response({'error': 'Session not found'}, status=404)  
        
    @action(detail=False, methods=['post'])
    def get_report_assessments(self, request):
        assessment = request.data.get('assessment_id')
        sessions = AssessmentSession.objects.filter(
            assessment__slug=assessment,
            status='completed'
        )
        serializer = self.get_serializer(sessions, many=True)
        return Response(serializer.data)
        
        
        
class AssessmentAnswerViewSet(viewsets.ModelViewSet):
    queryset = AssessmentAnswer.objects.all()
    serializer_class = AssessmentAnswerSerializer

    def create(self, request, *args, **kwargs):
        session_id = request.data.get('session_id')
        question_id = request.data.get('question_id')
        option_id = request.data.get('option_id')

        # Validate data
        try:
            session = AssessmentSession.objects.get(session_id=session_id)
            question = Question.objects.get(id=question_id)
            option = Option.objects.get(id=option_id)
        except (AssessmentSession.DoesNotExist, Question.DoesNotExist, Option.DoesNotExist):
            return Response({'error': 'Invalid session, question, or option'}, status=400)

        # Create the answer
        answer, created = AssessmentAnswer.objects.get_or_create(
            session=session,
            question=question,
            defaults={'selected_option': option, 'is_correct': option.is_correct}
        )

        if not created:
            answer.selected_option = option
            answer.is_correct = option.is_correct
            answer.save()

        # Update session progress
        if question.id not in session.completed_questions:
            session.completed_questions.append(question.id)

        session.current_question_index = len(session.completed_questions)

        # Auto mark as completed if all answered
        total = session.assessment.questions.count()
        if session.current_question_index >= total:
            session.status = "completed"
            session.score = (AssessmentAnswer.objects.filter(session=session, is_correct=True).count() / total) * 100
            
            session.completed_at = timezone.now()
            if session.score >= session.assessment.passing_rate:
                AssessmentComplete.objects.get_or_create(user=session.user, assessment=session.assessment)
                
        session.save()

        return Response({
            'message': 'Answer recorded successfully',
            'is_correct': answer.is_correct,
            'current_question_index': session.current_question_index,
            'status': session.status
        }, status=status.HTTP_201_CREATED)
        
    @action(detail=False, methods=['get'])
    def get_answers_for_session(self, request):
        session_id = request.query_params.get('session_id')
        try:
            session = AssessmentSession.objects.get(session_id=session_id)
            answers = AssessmentAnswer.objects.filter(session=session)
            serializer = self.get_serializer(answers, many=True)
            return Response(serializer.data)
        except AssessmentSession.DoesNotExist:
            return Response({'error': 'Session not found'}, status=404)
        
    @action(detail=False, methods=['get'], url_path='recommended-modules')
    def recommended_modules(self, request):
       
        session_id = request.query_params.get('session_id')
        if not session_id:
            return Response({'error': 'session_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        session = AssessmentSession.objects.filter(session_id=session_id).first()
        if not session:
            return Response({'error': 'Session not found'}, status=status.HTTP_404_NOT_FOUND)

        answers = (
            AssessmentAnswer.objects
            .filter(session=session, is_correct=False, recommended_module__isnull=False)
            .select_related('recommended_module__lesson')
        )

        # De-dupe modules, then group by lesson
        lesson_to_modules = {}
        lesson_obj_by_id = {}
        for ans in answers:
            mod = ans.recommended_module
            if not mod or not getattr(mod, 'lesson_id', None):
                continue

            lesson_id = mod.lesson_id
            lesson_obj_by_id.setdefault(lesson_id, mod.lesson)
            lesson_to_modules.setdefault(lesson_id, {})[mod.id] = mod

        # Serialize grouped modules + lesson object
        from app_modules.serializers import ModuleTestSerializer
        from app_lesson.serializers import LessonTestSerializer

        lessons_payload = []
        for lesson_id, module_map in lesson_to_modules.items():
            lesson_obj = lesson_obj_by_id.get(lesson_id)
            lesson_ser = LessonTestSerializer(lesson_obj, context={'request': request}).data if lesson_obj else None

            modules = list(module_map.values())
            modules_ser = ModuleTestSerializer(modules, many=True, context={'request': request}).data

            lessons_payload.append({'lesson': lesson_ser, 'modules': modules_ser})

        # Sort by lesson_order when possible, otherwise keep stable by id
        def _sort_key(item):
            lesson = item.get('lesson') or {}
            return (lesson.get('lesson_order') is None, lesson.get('lesson_order') or 0, lesson.get('id') or 0)

        lessons_payload.sort(key=_sort_key)
        return Response(lessons_payload, status=status.HTTP_200_OK)
        
        
        
class AssessmentCompleteViewSet(viewsets.ModelViewSet):
    queryset = AssessmentComplete.objects.all()
    serializer_class = AssessmentCompleteSerializer
    
    @action(detail=False, methods=['get'])
    def get_assessment(self, request):
        assessment_id = request.query_params.get('assessment_id')
        if not assessment_id:
            return Response({'error': 'Assessment ID is required'}, status=400)
        
        assessments = self.queryset.filter(assessment__id=assessment_id, user=request.user).first()
        
        if not assessments:
            return Response({'error': 'Assessment not found'}, status=404)
        serializer = self.get_serializer(assessments, many=False)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def reward_claimed(self, request):
        assessment_id = request.query_params.get('assessment_id')
        if not assessment_id:
            return Response({'error': 'Assessment ID is required'}, status=400)
        
        assessments = self.queryset.filter(assessment__id=assessment_id, user=request.user).first()
        assessments.rewarded = True
        assessments.rewarded_at = timezone.now()
        assessments.save()
        serializer = self.get_serializer(assessments, many=False)
        return Response(serializer.data)



