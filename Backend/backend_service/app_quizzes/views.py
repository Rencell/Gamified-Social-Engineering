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

        obj = QuizProgress.objects.filter(user_id=user, module_id=module).first()
        if obj:
            if int(score) > obj.score:
                obj.score = score
                obj.total_questions = total_questions
                obj.save()
                created = False
            else:
                created = False
        else:
            obj = QuizProgress.objects.create(user_id=user, module_id=module, score=score, total_questions=total_questions)
            created = True

        serializer = self.get_serializer(obj)

        if created:
            return Response(serializer.data, status=201)
        else:
            return Response(serializer.data, status=202)


    @action(detail=False, methods=['get'], url_path='module')
    def quiz_progress(self, request):
        user = request.query_params.get('user')
        module_id = request.query_params.get('module_id')
        if not user or not module_id:
            return Response({'detail': 'user and module_id are required.'}, status=status.HTTP_400_BAD_REQUEST)
        obj = QuizProgress.objects.filter(user_id=user, module_id=module_id).first()
        if obj:
            serializer = self.get_serializer(obj)
            return Response(serializer.data)
        return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND) 