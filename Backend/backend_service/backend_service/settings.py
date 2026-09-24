from dotenv import load_dotenv
from pathlib import Path
import os
import dj_database_url
# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

ENVIRONMENT = "PROD"

if ENVIRONMENT == "LOCAL":
    load_dotenv()
    
# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv('SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.getenv('DEBUG','False').lower() == 'true'

ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS').split(' ')


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    "corsheaders",
    'app_auth',
    'app_lesson',
    'app_modules',
    'app_quizzes',
    'app_reward',
    'app_level',
    'app_badge',
    'app_cosmetic',
    'app_daily',
    'app_contents',
    'app_section',
    'app_assessment',
    'app_popup',
    'app_minigame',
    'gophish',
    'rest_framework',
    'rest_framework.authtoken',
    
    'dj_rest_auth',
    
    'django.contrib.sites',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'dj_rest_auth.registration',
    # bucket
    'storages',
    
    'allauth.socialaccount.providers.facebook',
    'allauth.socialaccount.providers.google',
]

MIDDLEWARE = [
    
     "corsheaders.middleware.CorsMiddleware",
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'allauth.account.middleware.AccountMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend_service.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend_service.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.2/ref/settings/#databases

DATABASE_URL = os.getenv('DATABASE_URL')

# DATABASES = {
#         'default': dj_database_url.config(default=DATABASE_URL)
#     }
if ENVIRONMENT == "PROD":
    DATABASES = {
        'default': dj_database_url.config(default=DATABASE_URL)
    }
else:
    DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# Password validation
# https://docs.djangoproject.com/en/5.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

AUTHENTICATION_BACKENDS = [
    "allauth.account.auth_backends.AuthenticationBackend",
    "django.contrib.auth.backends.ModelBackend",  # ✅ This is needed
]

REST_AUTH = {
    'USER_DETAILS_SERIALIZER': 'app_auth.serializers.CustomUserDetailsSerializer',
    "REGISTER_SERIALIZER": "dj_rest_auth.registration.serializers.RegisterSerializer",
    "USE_JWT": False, 
}


# Internationalization
# https://docs.djangoproject.com/en/5.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = "Asia/Manila"

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.2/howto/static-files/

STATIC_URL = 'static/'



# Default primary key field type
# https://docs.djangoproject.com/en/5.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


REST_FRAMEWORK = {
     'DEFAULT_AUTHENTICATION_CLASSES': (
       'app_auth.authentication.CsrfExemptSessionAuthentication',
       'rest_framework.authentication.TokenAuthentication',
   ),
}

EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD')
DEFAULT_FROM_EMAIL = os.getenv('EMAIL_HOST_USER')
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'

SITE_ID = 1
ACCOUNT_AUTHENTICATION_METHOD = 'email'
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_UNIQUE_EMAIL = True
ACCOUNT_USERNAME_REQUIRED = False
ACCOUNT_EMAIL_CONFIRMATION_TEMPLATE = 'account/email/email_confirmation_message.txt'
ACCOUNT_SIGNUP_FIELDS = []  # Remove password requirements for social auto signup
ACCOUNT_EMAIL_VERIFICATION = "none"
ACCOUNT_LOGIN_METHOD = 'email'

LOGIN_REDIRECT_URL = "http://localhost:5173/home"
LOGOUT_REDIRECT_URL = "http://localhost:5173/"


ALLOWED_HOSTS += [
    'gamified-se.vercel.app',
    'tectonically-unsailed-jacquline.ngrok-free.dev',
]

CORS_ALLOWED_ORIGINS = [
    'https://gamified-frontend-caps.onrender.com',
    'http://localhost:5173',
    'https://gamified-social-engineering-git-gh-page-rencells-projects.vercel.app',
    'https://gamified-se.vercel.app',
    'https://tectonically-unsailed-jacquline.ngrok-free.dev',
]
CORS_ALLOW_CREDENTIALS = True

CSRF_COOKIE_DOMAIN = ['127.0.0.1:8000', 'localhost:8000', 'dev.org']

CSRF_TRUSTED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    "https://gamified-frontend-caps.onrender.com",
    "https://gamified-social-engineering-git-gh-page-rencells-projects.vercel.app",
    "https://gamified-se.vercel.app",
    "https://tectonically-unsailed-jacquline.ngrok-free.dev",
]

CSRF_COOKIE_DOMAIN = None
CSRF_COOKIE_SECURE = False  # Set to True in production if using HTTPS
CSRF_COOKIE_HTTPONLY = False
CSRF_COOKIE_SAMESITE = 'Lax'  # Use 'Strict' or 'None' based on your requirements

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'


# STORAGES = {
#     "default": {
#         "BACKEND": "storages.backends.s3.S3Storage",
#     },
#     "staticfiles": {
#         "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
#     },
# }

if(ENVIRONMENT == "PROD"):
    STORAGES = {
        "default": {
            "BACKEND": "storages.backends.s3.S3Storage",
        },
        "staticfiles": {
            "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
        },
    }
else:
    MEDIA_URL = '/media/'
    MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
AWS_STORAGE_BUCKET_NAME = os.getenv('AWS_STORAGE_BUCKET_NAME')
AWS_S3_SIGNATURE_NAME = 's3v4'
AWS_S3_REGION_NAME = 'ap-southeast-2'
AWS_S3_FILE_OVERWRITE = False
AWS_DEFAULT_ACL =  None
AWS_S3_VERIFY = True


SOCIALACCOUNT_AUTO_SIGNUP = True
SOCIALACCOUNT_PROVIDERS = {
    'google': {
        'SCOPE': [
            'profile',
            'email',
        ],
        'AUTH_PARAMS': {
            'access_type': 'online',
        },
        'OAUTH_PKCE_ENABLED': True,
    }
}

SOCIALACCOUNT_PROVIDERS['google']['APP'] = {
    'client_id': os.getenv('GOOGLE_CLIENT_ID'),
    'secret': os.getenv('GOOGLE_CLIENT_SECRET'),
    'key': ''
}

# Use custom adapter to link existing user accounts by email instead of raising duplicate error
SOCIALACCOUNT_ADAPTER = 'app_auth.adapters.CustomSocialAccountAdapter'

GOPHISH_URL = os.getenv("GOPHISH_URL", "https://127.0.0.1:3333")
GOPHISH_API_KEY = os.getenv("GOPHISH_API_KEY", "")
GOPHISH_VERIFY_SSL = os.getenv("GOPHISH_VERIFY_SSL", "true").lower() in ("1","true","yes")


IPROG_SMS_API_TOKEN = os.getenv("IPROG_SMS_API_TOKEN", "1231asd1")
IPROG_SMS_BASE_URL = os.getenv("IPROG_SMS_BASE_URL", "https://www.iprogsms.com/api/v1/sms_messages")
