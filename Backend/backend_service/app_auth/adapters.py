from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from django.contrib.auth import get_user_model

class CustomSocialAccountAdapter(DefaultSocialAccountAdapter):
    def pre_social_login(self, request, sociallogin):
        # If this social account is already linked, it's not new
        if sociallogin.is_existing:
            setattr(request, "is_new_user", False)
            return

        email = sociallogin.user.email
        # If provider didn't return an email, a new user will be created
        if not email:
            setattr(request, "is_new_user", True)
            return

        User = get_user_model()
        try:
            existing_user = User.objects.get(email=email)
            # Link this social account to an existing user -> not new
            setattr(request, "is_new_user", False)
            sociallogin.connect(request, existing_user)
        except User.DoesNotExist:
            # No user with this email -> a new user will be created
            setattr(request, "is_new_user", True)
            return
