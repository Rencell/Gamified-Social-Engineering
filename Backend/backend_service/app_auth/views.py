from django.shortcuts import render
from allauth.socialaccount.providers.facebook.views import FacebookOAuth2Adapter
from dj_rest_auth.registration.views import SocialLoginView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.authtoken.models import Token
from rest_framework import status

class FacebookLogin(SocialLoginView):
    adapter_class = FacebookOAuth2Adapter

from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
# Implicit/token flow: frontend sends access_token directly
class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter

    def get_response(self):
        # Create or get auth token
        token, _ = Token.objects.get_or_create(user=self.user)

        # Newness is determined earlier in the pipeline (pre_social_login)
        is_new = bool(getattr(self.request, "is_new_user", False))

        # Return only key and is_new
        return Response(
            {
                "key": token.key,
                "is_new": is_new
            },
            status=status.HTTP_200_OK
        )


