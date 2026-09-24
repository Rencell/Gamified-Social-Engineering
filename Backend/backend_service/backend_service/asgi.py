import os
from pathlib import Path

from dotenv import load_dotenv

# Load Backend/.env explicitly
ENV_PATH = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(ENV_PATH)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend_service.settings")

from django.core.asgi import get_asgi_application
django_asgi_app = get_asgi_application()  # <-- loads apps registry

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter

from app_vishing.routing import websocket_urlpatterns  # <-- import AFTER apps loaded

application = ProtocolTypeRouter(
    {
        "http": django_asgi_app,
        "websocket": AuthMiddlewareStack(URLRouter(websocket_urlpatterns)),
    }
)