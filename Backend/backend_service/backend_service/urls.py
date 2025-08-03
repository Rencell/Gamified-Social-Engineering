
from django.contrib import admin
from django.urls import path,include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls')),
    path('auth0/', include('app_auth.urls')),
    path('api/lessons/', include('app_lesson.urls')),
    path('api/modules/', include('app_modules.urls')),
    path('api/quizzes/', include('app_quizzes.urls')),
    path('api/rewards/', include('app_reward.urls')),
]
