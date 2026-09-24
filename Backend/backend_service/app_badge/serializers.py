from rest_framework import serializers
from .models import Badge, UserBadge, BadgeRule


class BadgeRuleSerializer(serializers.ModelSerializer):
    # Allow associating the rule to a specific badge when creating/updating BadgeRule directly.
    badge_id = serializers.PrimaryKeyRelatedField(
        source='badge',
        queryset=Badge.objects.all(),
        write_only=True,
        required=True,
    )

    class Meta:
        model = BadgeRule
        fields = [
            'badge_id',
            'type',
            'target_value',
            'target_entity',
            'target_entity_id',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at']


class BadgeSerializer(serializers.ModelSerializer):
    rule = BadgeRuleSerializer(source='badge_rule', required=False)
    has_rule = serializers.SerializerMethodField()

    class Meta:
        model = Badge
        fields = [
            'id',
            'name',
            'code',
            'description',
            'image',
            'is_active',
            'created_at',
            'updated_at',
            'rule',
            'has_rule',
        ]
        read_only_fields = ['created_at', 'updated_at']

    def get_has_rule(self, obj: Badge) -> bool:
        # Use the reverse one-to-one relation (related_name='badge_rule')
        return hasattr(obj, 'badge_rule') and obj.badge_rule is not None

    def create(self, validated_data):
        rule_data = validated_data.pop('badge_rule', None)
        badge = Badge.objects.create(**validated_data)
        if rule_data:
            # Nested create path: associate with the badge automatically.
            rule_data.pop('badge', None)
            BadgeRule.objects.create(badge=badge, **rule_data)
        return badge

    def update(self, instance, validated_data):
        rule_data = validated_data.pop('badge_rule', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if rule_data is not None:
            # Nested update path: badge is implied by the parent.
            rule_data.pop('badge', None)
            BadgeRule.objects.update_or_create(badge=instance, defaults=rule_data)

        return instance


class UserBadgeSerializer(serializers.ModelSerializer):
    badge = BadgeSerializer(read_only=True)
    badge_id = serializers.PrimaryKeyRelatedField(
        source='badge',
        queryset=Badge.objects.all(),
        write_only=True,
    )

    class Meta:
        model = UserBadge
        fields = ['user', 'badge', 'badge_id', 'completed_at']
        read_only_fields = ['completed_at']