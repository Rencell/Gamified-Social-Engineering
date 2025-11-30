from django.shortcuts import render
from allauth.socialaccount.providers.facebook.views import FacebookOAuth2Adapter
from dj_rest_auth.registration.views import SocialLoginView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.views.decorators.csrf import ensure_csrf_cookie

class FacebookLogin(SocialLoginView):
    adapter_class = FacebookOAuth2Adapter

from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
# Implicit/token flow: frontend sends access_token directly
class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    # No callback_url needed for token login