# views.py
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from .serializers import GophishEventSerializer, GophishUserScoreSerializer
from .models import GophishEvent, GophishUserScore
from django.contrib.auth.models import User
from rest_framework import status

class GoPhishWebhookViewSet(viewsets.ViewSet):
    # POST /api/gophish/
    def create(self, request):
        data = request.data
        email = data.get('email')
        message = data.get('message')
        details = data.get('details', {})
        gophish_time = data.get('time')
        
        print(data)
        
        if message == 'Campaign Created' or message == '':
            return Response(
                {"status": "ok", "message": "Campaign Created event ignored."},
                status=status.HTTP_204_NO_CONTENT
            )
        
        user = User.objects.filter(email=email).first()
        if not user:
            return Response(
                {"status": "error", "message": "User with the provided email does not exist."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Create the GophishEvent instance
        gophish_event = GophishEvent.objects.create(
            gophish_time=gophish_time,
            message=message,
            details=details,
            user=user
        )

        user_score, _ = GophishUserScore.objects.get_or_create(user=user)

        # Increment based on the event type
        if message == "Email Sent":
            user_score.emails_sent += 1
            user_score.security_score = min(user_score.security_score + 20, 100)
        elif message == "Clicked Link":
            user_score.links_clicked += 1
            user_score.security_score = max(user_score.security_score - 30, 0)
        elif message in ["Submitted Data", "Submitted Credentials"]:
            user_score.data_submitted += 1
            user_score.security_score = max(user_score.security_score - 50, 0)

        # Save updated KPI
        user_score.save()
        
        return Response(
            {"status": "ok", "event_id": gophish_event.id, "message": "Gophish event created successfully."},
            status=status.HTTP_201_CREATED
        )

class GophishEventViewSet(viewsets.ModelViewSet):

    queryset = GophishEvent.objects.all()
    serializer_class = GophishEventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # staff can see all
        if user.is_staff:
            return GophishEvent.objects.all()
        # students see only their own
        return GophishEvent.objects.filter(user=user)
    
    
class GophishUserScoreViewSet(viewsets.ModelViewSet):

    queryset = GophishUserScore.objects.all()
    serializer_class = GophishUserScoreSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # staff can see all
        if user.is_staff:
            return GophishUserScore.objects.all()
        # students see only their own
        return GophishUserScore.objects.filter(user=user)
    
    