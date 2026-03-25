from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CartViewSet, AddressViewSet, CouponViewSet, OrderViewSet

router = DefaultRouter()
router.register(r'cart', CartViewSet, basename='cart')
router.register(r'addresses', AddressViewSet, basename='address')
router.register(r'coupons', CouponViewSet, basename='coupon')
router.register(r'orders', OrderViewSet, basename='order')

app_name = 'orders'

urlpatterns = [
    path('', include(router.urls)),
]
