from django.http import JsonResponse
from django.shortcuts import render
from .serializers import BadgeSerializer, UserBadgeSerializer, BadgeRuleSerializer
from rest_framework import viewsets
from .models import Badge, UserBadge, BadgeRule
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status
from rest_framework.exceptions import ValidationError


class BadgeViewSet(viewsets.ModelViewSet):
    queryset = Badge.objects.all()
    serializer_class = BadgeSerializer

    @action(detail=True, methods=['get'], url_path='rule')
    def rule(self, request, pk=None):
        badge = self.get_object()
        rule = getattr(badge, 'badge_rule', None)
        if not rule:
            return Response(None, status=status.HTTP_200_OK)

        serializer = BadgeRuleSerializer(rule, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class BadgeRuleViewSet(viewsets.ModelViewSet):
    queryset = BadgeRule.objects.all()
    serializer_class = BadgeRuleSerializer


class UserBadgeViewSet(viewsets.ModelViewSet):
    queryset = UserBadge.objects.all()
    serializer_class = UserBadgeSerializer

    def _is_eligible(self, *, user, badge: Badge) -> bool:
        """Return True if user can claim the badge, based on BadgeRule."""
        rule = getattr(badge, "badge_rule", None)
        if not rule:
            # No rule means the badge is NOT claimable.
            return False

        # Import here to avoid circular imports.
        if rule.target_entity == BadgeRule.TargetEntity.MODULE:
            from app_modules.models import UserModuleTestProgress

            if rule.target_entity_id:
                return UserModuleTestProgress.objects.filter(
                    user=user,
                    module_id=rule.target_entity_id,
                ).exists()

            # If no specific module is set, fallback behavior: any completed module.
            return UserModuleTestProgress.objects.filter(user=user).exists()

        if rule.target_entity == BadgeRule.TargetEntity.LESSON:
            # Eligible if ALL modules under the specified Lesson are completed.
            from app_modules.models import ModuleTest, UserModuleTestProgress

            lesson_id = rule.target_entity_id
            if not lesson_id:
                return False

            module_ids = list(ModuleTest.objects.filter(lesson_id=lesson_id).values_list("id", flat=True))
            if not module_ids:
                # No modules configured for the lesson; treat as not eligible.
                return False

            completed_count = UserModuleTestProgress.objects.filter(
                user=user,
                module_test_id__in=module_ids,
            ).values("module_test_id").distinct().count()

            return completed_count == len(module_ids) 

        if rule.target_entity == BadgeRule.TargetEntity.QUIZ:
            # If you have quiz completion tracking, wire it here.
            return False

        if rule.target_entity == BadgeRule.TargetEntity.LOGIN:
            # If you have login streak tracking, wire it here.
            return False

        return False

    def create(self, request, *args, **kwargs):
        user = request.user
        if not user or not user.is_authenticated:
            raise ValidationError({"detail": "Authentication required."})

        badge_id = request.data.get('badge_id')
        if not badge_id:
            raise ValidationError({"badge_id": "This field is required."})

        try:
            badge = Badge.objects.get(id=badge_id)
        except Badge.DoesNotExist:
            raise ValidationError({"badge_id": "Invalid badge_id."})

        if not badge.is_active:
            raise ValidationError({"badge_id": "Badge is not active."})

        # Claim-based: only award if eligible at claim time.
        if not self._is_eligible(user=user, badge=badge):
            raise ValidationError({"detail": "Not eligible to claim this badge yet."})

        obj, created = UserBadge.objects.get_or_create(
            user=user,
            badge=badge,
        )

        serializer = self.get_serializer(obj)
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='unlocked')
    def unlocked(self, request):
        user_badges = UserBadge.objects.filter(user=request.user)
        serializer = self.get_serializer(user_badges, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='claimable')
    def claimable(self, request):
        """Badges the user is eligible to claim but hasn't claimed yet."""
        user = request.user
        if not user or not user.is_authenticated:
            raise ValidationError({"detail": "Authentication required."})

        claimed_ids = UserBadge.objects.filter(user=user).values_list("badge_id", flat=True)
        badges = Badge.objects.filter(is_active=True).exclude(id__in=claimed_ids)

        claimable = [b for b in badges if self._is_eligible(user=user, badge=b)]
        return Response(BadgeSerializer(claimable, many=True, context={"request": request}).data)