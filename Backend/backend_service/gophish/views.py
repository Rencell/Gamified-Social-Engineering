# views.py
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from .serializers import GophishEventSerializer, GophishUserScoreSerializer, GophishConsentSerializer
from .models import GophishEvent, GophishUserScore, GophishConsent
from django.contrib.auth.models import User
from rest_framework import status
from django.conf import settings
import requests
import json
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
        if message == "Email/SMS Sent":
            user_score.emails_sent += 1
            user_score.security_score = min(user_score.security_score + 20, 100)
        elif message == "Clicked Link":
            user_score.links_clicked += 1
            user_score.security_score = max(user_score.security_score - 20, 0)
        elif message in ["Submitted Data", "Submitted Credentials"]:
            user_score.data_submitted += 1
            user_score.security_score = max(user_score.security_score - 20, 0)

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

class GophishConsentViewSet(viewsets.ModelViewSet):

    queryset = GophishConsent.objects.all()
    serializer_class = GophishConsentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # staff can see all
        if user.is_staff:
            return GophishConsent.objects.all()
        # students see only their own
        return GophishConsent.objects.filter(user=user)
    
    def _add_target_to_gophish(self, user, group_id=1):
        try:
            # Prepare target data
            target_data = {
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "position": "student"  # You might want to get this from user profile
            }
            
            gophish_url = f"{settings.GOPHISH_URL}/api/groups/{group_id}"
            headers = {"Authorization": settings.GOPHISH_API_KEY, "Content-Type": "application/json"}
            
            # GET group
            r = requests.get(gophish_url, headers=headers, verify=settings.GOPHISH_VERIFY_SSL, timeout=10)
            if r.status_code == 200:
                group = r.json()
                targets = group.get("targets", [])
                
                # Check if user is not already in the group
                if not any(t.get("email") == target_data.get("email") for t in targets):
                    targets.append(target_data)
                    group["targets"] = targets
                    
                    # PUT updated group
                    put = requests.put(gophish_url, json=group, headers=headers, verify=settings.GOPHISH_VERIFY_SSL, timeout=10)
                    if put.status_code in (200, 201):
                        print(f"Successfully added {user.email} to GoPhish group {group_id}")
                        return True
                    else:
                        print(f"Failed to add target to GoPhish: {put.text}")
                        return False
                else:
                    print(f"User {user.email} already exists in GoPhish group {group_id}")
                    return True  # User already exists, consider it successful
            else:
                print(f"Failed to fetch GoPhish group: {r.text}")
                return False
                
        except requests.RequestException as e:
            print(f"Request to GoPhish failed: {str(e)}")
            return False
        except Exception as e:
            print(f"Error adding target to GoPhish: {str(e)}")
            return False
    
    @action(detail=False, methods=['post'])
    def email(self, request):
        user = request.user
        consent, created = GophishConsent.objects.get_or_create(user=user)
        
        email_consent = request.data.get('email_consent')
        
        if email_consent is not None:
            consent.email_consent = email_consent
            
            # If user is consenting (email_consent is True), add them to GoPhish
            if email_consent:
                group_id = getattr(settings, 'GOPHISH_DEFAULT_GROUP_ID', 1)
                success = self._add_target_to_gophish(user, group_id)
                
                if not success:
                    print(f"Warning: Failed to add {user.email} to GoPhish, but consent was still saved")
            
            # Save the consent regardless of GoPhish operation result
            consent.save()
            
            return Response({
                "email_consent": consent.email_consent,
                "message": "Email consent updated successfully."
            }, status=status.HTTP_200_OK)
            
        return Response({"error": "Missing email_consent field."}, status=status.HTTP_400_BAD_REQUEST)