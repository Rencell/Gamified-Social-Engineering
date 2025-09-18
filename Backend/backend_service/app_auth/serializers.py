from dj_rest_auth.serializers import LoginSerializer, UserDetailsSerializer
from rest_framework import serializers
from django.contrib.auth import authenticate

class CustomLoginSerializer(LoginSerializer):
    username = None
    email = serializers.EmailField(required=True)
    password = serializers.CharField(style={'input_type': 'password'}, required=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            user = authenticate(request=self.context.get('request'), email=email, password=password)

            if not user:
                raise serializers.ValidationError("Invalid email or password")
        else:
            raise serializers.ValidationError("Must include 'email' and 'password'")

        attrs['user'] = user
        return attrs
    
class CustomUserDetailsSerializer(UserDetailsSerializer):
    is_admin = serializers.BooleanField(source='is_staff', read_only=True)
    
    class Meta(UserDetailsSerializer.Meta):
        fields = UserDetailsSerializer.Meta.fields + ('is_admin',)