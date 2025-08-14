from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import ItemViewSet, BackpackItemViewSet, UserCosmeticViewSet

router = DefaultRouter()
router.register(r'item', ItemViewSet, basename='item')
router.register(r'backpack-item', BackpackItemViewSet, basename='backpackitem')
router.register(r'user-cosmetics', UserCosmeticViewSet, basename='usercosmetic')

urlpatterns = router.urls

