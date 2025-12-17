from rest_framework.routers import DefaultRouter
from .views import ModuleViewSet, UserModuleProgressViewSet, UserModuleTestProgressViewSet, ModuleTestViewSet, ModuleSourceViewSet

router = DefaultRouter()
router.register(r'module', ModuleViewSet, basename='module')
router.register(r'user-module-progress', UserModuleProgressViewSet, basename='usermoduleprogress')
router.register(r'module-test', ModuleTestViewSet, basename='moduletest')
router.register(r'user-module-test-progress', UserModuleTestProgressViewSet, basename='usermoduletestprogress')
router.register(r'module-source', ModuleSourceViewSet, basename='modulesource')
urlpatterns = router.urls