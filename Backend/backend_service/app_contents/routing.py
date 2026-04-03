from django.urls import re_path

from .consumers import GeminiAudioConsumer

websocket_urlpatterns = [
    re_path(r"^ws/gemini/audio/$", GeminiAudioConsumer.as_asgi()),
]
