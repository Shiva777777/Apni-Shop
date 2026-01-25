from django.urls import path
from .views import (
    UserRegistrationView,
    UserLoginView,
    AdminLoginView,
    UserProfileView,
    PasswordResetRequestView,
    PasswordResetConfirmView,
    EmailVerificationView,
    UserListView,
    AdminCreateView,
    AdminListView,
    AdminUpdateView,
    AdminDeleteView
)
from rest_framework_simplejwt.views import TokenRefreshView

app_name = 'accounts'

urlpatterns = [
    # Authentication
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('admin/login/', AdminLoginView.as_view(), name='admin-login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    
    # Profile
    path('profile/', UserProfileView.as_view(), name='profile'),
    
    # Password Reset
    path('password-reset/', PasswordResetRequestView.as_view(), name='password-reset'),
    path('password-reset/confirm/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
    
    # Email Verification
    path('verify-email/', EmailVerificationView.as_view(), name='verify-email'),
    
    # User Management (Admin)
    path('users/', UserListView.as_view(), name='admin-users'),
    
    # Admin Management
    path('admins/', AdminListView.as_view(), name='admin-list'),
    path('admins/create/', AdminCreateView.as_view(), name='admin-create'),
    path('admins/<int:pk>/update/', AdminUpdateView.as_view(), name='admin-update'),
    path('admins/<int:pk>/delete/', AdminDeleteView.as_view(), name='admin-delete'),
]
