from rest_framework import serializers
from .models import MiniGame

class MiniGameSerializer(serializers.ModelSerializer):
    thumbnail_url = serializers.SerializerMethodField()

    class Meta:
        model = MiniGame
        fields = '__all__'
        read_only_fields = ['id', 'created_at']

    def get_thumbnail_url(self, obj):
        request = self.context.get('request')
        if obj.thumbnail and hasattr(obj.thumbnail, 'url'):
            if request:
                return request.build_absolute_uri(obj.thumbnail.url)
            return obj.thumbnail.url
        return None

    def update(self, instance, validated_data):
        # Preserve current thumbnail when client sends null/empty or omits the field
        thumbnail = validated_data.get('thumbnail', serializers.empty)
        if thumbnail is serializers.empty or thumbnail in (None, ''):
            validated_data.pop('thumbnail', None)
        return super().update(instance, validated_data)