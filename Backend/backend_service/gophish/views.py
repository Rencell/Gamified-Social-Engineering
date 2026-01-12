# views.py
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from .serializers import GophishEventSerializer, GophishUserScoreSerializer, GophishConsentSerializer, UserPhoneNumberSerializer, GophishUserScoreSmsSerializer
from .models import GophishEvent, GophishUserScore, GophishUserScoreSms, GophishConsent, UserPhoneNumber
from django.contrib.auth.models import User
from rest_framework import status
from django.conf import settings
from .utils import send_sms
from rest_framework.decorators import api_view
import requests
import json
from django.db.models import Sum, Max

# popup app model used for overall defence score aggregation
from app_popup.models import PopupTriggerLog

class GoPhishWebhookViewSet(viewsets.ViewSet):
    # POST /api/gophish/
    def create(self, request):
        data = request.data
        raw_identifier = data.get('email')
        message = data.get('message')
        details = data.get('details', {})
        gophish_time = data.get('time')
        
        body = data.get('body')
        to = data.get('to')
        print("Debug: data:", data)
        if body and to:
            phone_number = UserPhoneNumber.objects.filter(dummy_number=to).first()
            if phone_number:
                send_sms(phone_number.phone, body)
            
        if not raw_identifier:
            return Response(
                {"status": "error", "message": "Missing identifier (email/phone)."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Decide channel
        is_email = '@' in raw_identifier
        channel = 'email' if is_email else 'phone'
        
        if message == 'Campaign Created' or message == '':
            return Response(
                {"status": "ok", "message": "Campaign Created event ignored."},
                status=status.HTTP_204_NO_CONTENT
            )
        
        if channel == 'email':
            user = User.objects.filter(email=raw_identifier).first()
        else:
            phone_entry = UserPhoneNumber.objects.filter(dummy_number=raw_identifier).first()
            user = phone_entry.user if phone_entry else None
            
        if not user:
            return Response(
                {"status": "error", "message": "User with the provided email does not exist."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Create the GophishEvent instance
        gophish_event = GophishEvent.objects.create(
            gophish_time=gophish_time,
            type=channel,
            message=message,
            details=details,
            user=user
        )

        if channel == 'email':
            user_score, _ = GophishUserScore.objects.get_or_create(user=user)
        else:
            user_score, _ = GophishUserScoreSms.objects.get_or_create(user=user)
        # Increment based on the event type
        if message == "Email/SMS Sent":
            if channel == 'email':
                user_score.emails_sent += 1
            else:
                user_score.number_sent += 1
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
    
    @action(detail=False, methods=['get'])
    def overall_defence(self, request):
        """Return a single overall defence score for the authenticated user.

        Combines:
        - GoPhish email score (GophishUserScore.security_score)
        - GoPhish SMS score (GophishUserScoreSms.security_score)
        - Popup safe-browsing score (same rule as app_popup.get_popup_log_statistics)
        """

        user = request.user

        email_score_obj = GophishUserScore.objects.filter(user=user).first()
        sms_score_obj = GophishUserScoreSms.objects.filter(user=user).first()

        email_score = int(email_score_obj.security_score) if email_score_obj else 100
        sms_score = int(sms_score_obj.security_score) if sms_score_obj else 100

        popup_logs = PopupTriggerLog.objects.filter(user=user).exclude(status="waiting")
        popup_clicks = popup_logs.filter(status="clicked").count()
        popup_closed = popup_logs.filter(status="closed").count()
        popup_score = max(0, min(100, 100 + (popup_closed * 30) - (popup_clicks * 10)))

        # weights can be tuned later
        weights = {
            "email": 0.4,
            "sms": 0.3,
            "popup": 0.3,
        }

        overall = round(
            (email_score * weights["email"]) + (sms_score * weights["sms"]) + (popup_score * weights["popup"]),
            1,
        )

        return Response({
            "overall_score": overall,
            "weights": weights,
            "components": {
                "gophish_email": {
                    "security_score": email_score,
                    "emails_sent": email_score_obj.emails_sent if email_score_obj else 0,
                    "links_clicked": email_score_obj.links_clicked if email_score_obj else 0,
                    "data_submitted": email_score_obj.data_submitted if email_score_obj else 0,
                },
                "gophish_sms": {
                    "security_score": sms_score,
                    "number_sent": sms_score_obj.number_sent if sms_score_obj else 0,
                    "links_clicked": sms_score_obj.links_clicked if sms_score_obj else 0,
                    "data_submitted": sms_score_obj.data_submitted if sms_score_obj else 0,
                },
                "popup": {
                    "security_score": popup_score,
                    "total_clicks": popup_clicks,
                    "total_closed": popup_closed,
                    "popup_count": popup_logs.count(),
                },
            },
        })

    @action(detail=False, methods=['get'])
    def total_score(self, request):
        agg = GophishUserScore.objects.aggregate(
            total_emails_sent=Sum('emails_sent'),
            total_links_clicked=Sum('links_clicked'),
            total_data_submitted=Sum('data_submitted'),
            max_emails_sent=Max('emails_sent'),
            max_links_clicked=Max('links_clicked'),
            max_data_submitted=Max('data_submitted'),
        )
        emails_sent = agg['total_emails_sent'] or 0
        links_clicked = agg['total_links_clicked'] or 0
        data_submitted = agg['total_data_submitted'] or 0

        avg_click_rate = round((links_clicked / emails_sent) * 100, 2) if emails_sent else 0
        avg_submission_rate = round((data_submitted / emails_sent) * 100, 2) if emails_sent else 0

        return Response({
            "total_emails_sent": emails_sent,
            "total_links_clicked": links_clicked,
            "total_data_submitted": data_submitted,
            "avg_click_rate": avg_click_rate,
            "avg_submission_rate": avg_submission_rate,
            "max_emails_sent": agg['max_emails_sent'] or 0,
            "max_links_clicked": agg['max_links_clicked'] or 0,
            "max_data_submitted": agg['max_data_submitted'] or 0,
        })    
        
    @action(detail=False, methods=['get'])
    def total_score_sms(self, request):
        agg = GophishUserScoreSms.objects.aggregate(
            total_sms_sent=Sum('number_sent'),
            total_links_clicked=Sum('links_clicked'),
            total_data_submitted=Sum('data_submitted'),
            max_sms_sent=Max('number_sent'),
            max_links_clicked=Max('links_clicked'),
            max_data_submitted=Max('data_submitted'),
        )
        sms_sent = agg['total_sms_sent'] or 0
        links_clicked = agg['total_links_clicked'] or 0
        data_submitted = agg['total_data_submitted'] or 0

        avg_click_rate = round((links_clicked / sms_sent) * 100, 2) if sms_sent else 0
        avg_submission_rate = round((data_submitted / sms_sent) * 100, 2) if sms_sent else 0

        return Response({
            "total_sms_sent": sms_sent,
            "total_links_clicked": links_clicked,
            "total_data_submitted": data_submitted,
            "avg_click_rate": avg_click_rate,
            "avg_submission_rate": avg_submission_rate,
            "max_sms_sent": agg['max_sms_sent'] or 0,
            "max_links_clicked": agg['max_links_clicked'] or 0,
            "max_data_submitted": agg['max_data_submitted'] or 0,
        })
    
class GophishUserScoreSmsViewSet(viewsets.ModelViewSet):

    queryset = GophishUserScoreSms.objects.all()
    serializer_class = GophishUserScoreSmsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # staff can see all
        if user.is_staff:
            return GophishUserScoreSms.objects.all()
        # students see only their own
        return GophishUserScoreSms.objects.filter(user=user)


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
    
    def _add_target_to_gophish(self, user, email, group_id=1):
        try:
            # Prepare target data
            target_data = {
                "email": email,
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
        GophishUserScore.objects.get_or_create(user=user)
        email_consent = request.data.get('email_consent')
        
        if email_consent is not None:
            consent.email_consent = email_consent
            
            if email_consent:
                group_id = getattr(settings, 'GOPHISH_DEFAULT_GROUP_ID', 1)
                success = self._add_target_to_gophish(user, user.email, group_id)
                
                if not success:
                    print(f"Warning: Failed to add {user.email} to GoPhish, but consent was still saved")
            
            consent.save()
            
            return Response({
                "email_consent": consent.email_consent,
                "message": "Email consent updated successfully."
            }, status=status.HTTP_200_OK)
            
        return Response({"error": "Missing email_consent field."}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def phone(self, request):
        user = request.user
        consent, created = GophishConsent.objects.get_or_create(user=user)
        GophishUserScoreSms.objects.get_or_create(user=user)
        phone_number = request.data.get('phone_number')
        
        if phone_number.startswith('09'):
            phone_number = '639' + phone_number[2:]
        
        existing = UserPhoneNumber.objects.filter(user=user).first()
        if phone_number is not None and existing is None:
            user_phone, created = UserPhoneNumber.objects.get_or_create(user=user, phone=phone_number)
            
            consent.phone_consent = True
            
            if consent.phone_consent:
                group_id = getattr(settings, 'GOPHISH_DEFAULT_GROUP_ID', 2)
                success = self._add_target_to_gophish(user, user_phone.dummy_number, group_id)
                
                if not success:
                    print(f"Warning: Failed to add {user.email} to GoPhish, but consent was still saved")
                    
            consent.save()
            
            return Response({
                "message": "Phone number updated successfully."
            }, status=status.HTTP_200_OK)
            
        return Response({"error": "Missing phone_number field or already exists."}, status=status.HTTP_400_BAD_REQUEST)
    
class UserPhoneNumberViewSet(viewsets.ModelViewSet):

    queryset = UserPhoneNumber.objects.all()
    serializer_class = UserPhoneNumberSerializer



@api_view(['GET'])
def gophish_campaigns(request):
    url = f"{settings.GOPHISH_URL}/api/campaigns"
    headers = {
        "Authorization": settings.GOPHISH_API_KEY
    }
    res = requests.get(url, headers=headers, verify=settings.GOPHISH_VERIFY_SSL, timeout=10)
    return Response(res.json())


# api/groups/1