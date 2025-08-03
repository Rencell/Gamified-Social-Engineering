from django.apps import AppConfig


class AppRewardConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'app_reward'
    
    def ready(self):
        # Import signal handlers
        import app_reward.signals
