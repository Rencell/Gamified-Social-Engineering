from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from django.contrib.auth import get_user_model

class CustomSocialAccountAdapter(DefaultSocialAccountAdapter):
    def pre_social_login(self, request, sociallogin):
        # If this social account is already linked, do nothing
        if sociallogin.is_existing:
            print("yeah existing")
            return
        email = sociallogin.user.email
        
        print("Pre social login email:", email)
        if not email:
            return
        User = get_user_model()
        try:
            existing_user = User.objects.get(email=email)
            print("Existing user found with email:", email)
        except User.DoesNotExist:
            return
        # Link the social account to the existing user to avoid duplicate email error
        sociallogin.connect(request, existing_user)
