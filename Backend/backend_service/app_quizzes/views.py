from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import viewsets
from .models import QuizProgress
from .serializers import QuizProgressSerializer
# Create your views here.
class QuizProgressViewSet(viewsets.ModelViewSet):

    queryset = QuizProgress.objects.all()
    serializer_class = QuizProgressSerializer
    
    def create(self, request, *args, **kwargs):
        user = request.data.get('user')
        module = request.data.get('module')
        score = int(request.data.get('score'))

        # Get the current max score for this user and module
        existing = QuizProgress.objects.filter(user_id=user, module_id=module).order_by('-score').first()

        # If the new score is not higher, just return the existing highest score
        if existing and score <= existing.score:
            serializer = self.get_serializer(existing)
            return Response(serializer.data, status=200)
        else:
            obj = QuizProgress.objects.create(user_id=user, module_id=module, score=score)
            serializer = self.get_serializer(obj)
            return Response(serializer.data, status=201)
