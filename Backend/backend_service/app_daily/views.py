import datetime
from rest_framework import generics, viewsets
from .models import UserStreak, Activity
from .serializers import UserStreakSerializer, ActivitySerializer
from rest_framework.decorators import action
from rest_framework import status
from rest_framework.response import Response


class UserStreakViewSet(viewsets.ModelViewSet):
    queryset = UserStreak.objects.all()
    serializer_class = UserStreakSerializer
    
    @action(detail=False, methods=['get'])
    def view_streak(self, request):
        user = request.user
        streak = UserStreak.objects.filter(user_id=user).first()
        if streak:
            serializer = self.get_serializer(streak)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({"detail": "No streak found"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['post'])
    def get_streak(self, request):
        user  = request.user
        today = datetime.date.today()
        streak, created = UserStreak.objects.get_or_create(
            user_id=user,
            defaults={
                'current_streak': 1,
                'longest_streak': 1,
                'last_activity_date': today,
                'streak_start_date': today
            }
            
        )
        
        if created:
            streak.current_streak = 1
            streak.longest_streak = 1
            streak.last_activity_date = today
            streak.streak_start_date = today
            streak.save()
            serializer = self.get_serializer(streak)
            Activity.objects.get_or_create(user=user, date=today)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            if streak.last_activity_date == today:
                serializer = self.get_serializer(streak)
                return Response(serializer.data, status=status.HTTP_200_OK)
            elif streak.last_activity_date == today - datetime.timedelta(days=1):
                streak.current_streak += 1
                streak.last_activity_date = today
                if streak.current_streak > streak.longest_streak:
                    streak.longest_streak = streak.current_streak
                streak.save()
                serializer = self.get_serializer(streak)
                Activity.objects.get_or_create(user=user, date=today)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                streak.current_streak = 1
                streak.last_activity_date = today
                streak.streak_start_date = today
                streak.save()
                serializer = self.get_serializer(streak)
                Activity.objects.get_or_create(user=user, date=today)
                return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'])
    def check_streak(self, request):
        today = datetime.date.today()
        
        try:
            streak = UserStreak.objects.get(user_id=request.user)
            is_streak_today = streak.last_activity_date == today
        except UserStreak.DoesNotExist:
            is_streak_today = False
        
        return Response({'is_streak_today': is_streak_today}, status=status.HTTP_200_OK)
        
    
class ActivityViewSet(viewsets.ModelViewSet):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
    
    @action(detail=False, methods=['get'])
    def active_days(self, request):
        user = request.user
        today = datetime.date.today()
        start_of_week = today - datetime.timedelta(days=today.weekday() + 1)  # Sunday
        end_of_week = start_of_week + datetime.timedelta(days=6)

        activities = Activity.objects.filter(
            user=user,
            date__range=[start_of_week, end_of_week]
        ).values_list("date", flat=True)

        return Response({
            "active_days": [d.strftime("%Y-%m-%d") for d in activities]
        })