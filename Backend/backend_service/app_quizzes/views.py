from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import viewsets
from .models import QuizProgress
from .serializers import QuizProgressSerializer
from rest_framework.decorators import action
from rest_framework import status
# Create your views here.
class QuizProgressViewSet(viewsets.ModelViewSet):

    queryset = QuizProgress.objects.all()
    serializer_class = QuizProgressSerializer

    def create(self, request, *args, **kwargs):
        user = request.data.get('user')
        module = request.data.get('module')
        score = request.data.get('score')
        total_questions = request.data.get('total_questions')
        time_spent = request.data.get('time_spent')
        attempt_number = request.data.get('attempt_number')
        accuracy = request.data.get('accuracy')
        
        obj = QuizProgress.objects.filter(user_id=user, module_id=module).first()
        if obj:
            if int(score) > obj.score:
                obj.score = score
                obj.total_questions = total_questions
                obj.time_spent = time_spent
                obj.attempt_number = attempt_number
                obj.accuracy = accuracy
                obj.save()
                created = False
            else:
                created = False
        else:
            obj, created = QuizProgress.objects.get_or_create(user_id=user, module_id=module, defaults={'score': score, 'total_questions': total_questions, 'time_spent': time_spent, 'attempt_number': attempt_number, 'accuracy': accuracy})

        serializer = self.get_serializer(obj)

        if created:
            return Response(serializer.data, status=201)
        else:
            return Response(serializer.data, status=202)


    @action(detail=False, methods=['get'], url_path='module')
    def quiz_progress(self, request):
        user = self.request.user.id
        module_id = request.query_params.get('module_id')
        if not user or not module_id:
            return Response({'detail': 'user and module_id are required.'}, status=status.HTTP_400_BAD_REQUEST)
        obj = QuizProgress.objects.filter(user_id=user, module_id=module_id).first()
        if obj:
            serializer = self.get_serializer(obj)
            return Response(serializer.data)
        return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND) 
    
    
    @action(detail=False, methods=['post'], url_path='process-ids')
    def process_ids(self, request):
        user = request.user
        ids = request.data.get('ids')
        if not isinstance(ids, list) or not all(isinstance(i, int) for i in ids):
            return Response(
                {'detail': 'A list of integer IDs must be provided.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Example processing: filter objects by these ids
        objs = QuizProgress.objects.filter(user=user, module__in=ids)
        
       
        # Calculate percentage for each object
        data = []
        for obj in objs:
            percentage = (obj.score / obj.total_questions) * 100 if obj.total_questions > 0 else 0
            serialized_obj = QuizProgressSerializer(obj).data
            serialized_obj['percentage'] = percentage
            data.append(serialized_obj)
        
        return Response(data, status=status.HTTP_200_OK)