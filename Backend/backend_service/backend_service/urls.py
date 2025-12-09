from django.contrib import admin
from django.urls import path,include
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls')),
    path('auth0/', include('app_auth.urls')),
    path('api/lessons/', include('app_lesson.urls')),
    path('api/modules/', include('app_modules.urls')),
    path('api/quizzes/', include('app_quizzes.urls')),
    path('api/rewards/', include('app_reward.urls')),
    path('api/levels/', include('app_level.urls')),
    path('api/cosmetics/', include('app_cosmetic.urls')),
    path('api/badges/', include('app_badge.urls')),
    path('api/streak/', include('app_daily.urls')),
    path('api/contents/', include('app_contents.urls')),
    path('api/sections/', include('app_section.urls')),
    path('api/assessment/', include('app_assessment.urls')),
    path('api/gophish/', include('gophish.urls')),
    path('api/popup/', include('app_popup.urls')),
    path('api/minigames/', include('app_minigame.urls')),
    path("accounts/", include("allauth.urls")),
]+ static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)
