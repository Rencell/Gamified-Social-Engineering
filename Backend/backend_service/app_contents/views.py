from rest_framework import serializers, viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .models import Content, ContentItem, ContentImage, ContentQuiz, ContentQuizImage
from .serializers import ContentSerializer, ContentItemSerializer, ContentImageSerializer, ContentQuizSerializer, ContentQuizImageSerializer

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
    