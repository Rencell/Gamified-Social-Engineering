from django.apps import AppConfig


class AppModulesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'app_modules'
    
    def ready(self):
        # Import signal handlers
        import app_modules.signal
