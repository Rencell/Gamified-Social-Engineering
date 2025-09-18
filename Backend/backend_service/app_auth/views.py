from django.shortcuts import render
from allauth.socialaccount.providers.facebook.views import FacebookOAuth2Adapter
from dj_rest_auth.registration.views import SocialLoginView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.views.decorators.csrf import ensure_csrf_cookie

class FacebookLogin(SocialLoginView):
    adapter_class = FacebookOAuth2Adapter


from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client

class GoogleLogin(SocialLoginView): # if you want to use Authorization Code Grant, use this
    adapter_class = GoogleOAuth2Adapter
    # callback_url = "http://https://gamified-social-engineering.onrender.com/accounts/google/login/callback/"
    callback_url = "http://localhost:8000/accounts/google/login/callback/"
    client_class = OAuth2Client

class GoogleLogin(SocialLoginView): # if you want to use Implicit Grant, use this
    adapter_class = GoogleOAuth2Adapter