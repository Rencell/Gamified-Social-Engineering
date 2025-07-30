from rest_framework.routers import DefaultRouter
from .views import ModuleViewSet, UserModuleProgressViewSet

router = DefaultRouter()
router.register(r'module', ModuleViewSet, basename='module')
router.register(r'user-module-progress', UserModuleProgressViewSet, basename='usermoduleprogress')

urlpatterns = router.urls