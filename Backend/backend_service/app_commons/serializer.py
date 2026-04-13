from rest_framework import serializers
from .models import AgreementSection, Agreement

        
class AgreementSerializer(serializers.ModelSerializer):
    # sections = AgreementSectionSerializer(rea=True)
    
    class Meta:
        model = Agreement
        fields = '__all__'

class AgreementSectionSerializer(serializers.ModelSerializer):
    agreements = AgreementSerializer(many=True, read_only=True)
    
    class Meta:
        model = AgreementSection
        fields = ['id', 'title', 'type', 'content', 'created_at', 'agreements']