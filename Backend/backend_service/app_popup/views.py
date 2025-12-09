from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import PopupScenario, PopupTriggerLog
from .serializers import PopupScenarioSerializer, PopupTriggerLogModuleSerializer

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
import datetime
import random

class PopupScenarioViewSet(viewsets.ModelViewSet):

    queryset = PopupScenario.objects.all()
    serializer_class = PopupScenarioSerializer
    
class PopupTriggerLogViewSet(viewsets.ModelViewSet):

    queryset = PopupTriggerLog.objects.all()
    serializer_class = PopupTriggerLogModuleSerializer
    
    @action(detail=False, methods=['get'])
    def get_pending_popups(self, request):
        user = request.user
        pending_logs = PopupTriggerLog.objects.filter(user=user, status="waiting").first()
        if not pending_logs:
            return Response(None)
        serializer = self.get_serializer(pending_logs, many=False)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def mark_popup_as_seen(self, request):
        user = request.user
        status = request.data.get('status')
        scenario_id = request.data.get('scenario_id')
        PopupTriggerLog.objects.filter(user=user, scenario_id=scenario_id, status="waiting").update(status=status)
        return Response({"status": "success", "message": "Popup marked as seen."})
    
    @action(detail=False, methods=['get'])
    def get_popup_log_statistics(self, request):
        user = request.user
        from django.db.models import Q
        logs = PopupTriggerLog.objects.filter(user=user).exclude(status="waiting").order_by('-date_triggered')
        total_clicks = logs.filter(status="clicked").count()
        total_closed = logs.filter(status="closed").count()
        security_score = max(0, min(100, 100 + (total_closed * 10) - (total_clicks * 10)))
        print("SECURITY SCORE:", security_score)
        serializer = self.get_serializer(logs, many=True)
        return Response({"security_score": security_score, "popup_count": logs.count(), "total_clicks": total_clicks, "total_closed": total_closed, "logs": serializer.data})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_today_popup(request):

    user = request.user
    today = datetime.date.today()

    # Check history
    existing_log = PopupTriggerLog.objects.filter(user=user, date_triggered=today).first()

    if existing_log:
        return Response({"show": False, "scenario": None})
    
    scenarios = PopupScenario.objects.all()

    if not scenarios.exists():
        return Response({"show": False, "scenario": None})

    scenario = random.choice(list(scenarios))

    PopupTriggerLog.objects.create(
        user=user,
        scenario=scenario,
        status="waiting"
    )

    return Response({
        "show": True,
        "scenario": PopupScenarioSerializer(scenario).data
    })