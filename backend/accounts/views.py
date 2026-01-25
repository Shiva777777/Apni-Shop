from rest_framework import status, generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from .serializers import (
    UserRegistrationSerializer,
    UserLoginSerializer,
    AdminLoginSerializer,
    UserProfileSerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer,
    EmailVerificationSerializer
)
from .models import PasswordResetToken, EmailVerificationToken
from utils.email import send_password_reset_email, send_welcome_email
import uuid
from datetime import timedelta
from django.utils import timezone

User = get_user_model()


def get_tokens_for_user(user):
    """Generate JWT tokens for user"""
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


class UserRegistrationView(APIView):
    """
    User registration endpoint
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            send_welcome_email(user)
            
            return Response({
                'message': 'Registration successful. Please check your email to verify your account.',
                'user': UserProfileSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLoginView(APIView):
    """
    User login endpoint
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            tokens = get_tokens_for_user(user)
            
            return Response({
                'message': 'Login successful',
                'tokens': tokens,
                'user': UserProfileSerializer(user).data
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminLoginView(APIView):
    """
    Admin login endpoint
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = AdminLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            tokens = get_tokens_for_user(user)
            
            return Response({
                'message': 'Admin login successful',
                'tokens': tokens,
                'user': UserProfileSerializer(user).data
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    Get and update user profile
    """
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user


class PasswordResetRequestView(APIView):
    """
    Request password reset
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            user = User.objects.get(email=email)
            
            # Create password reset token
            token = uuid.uuid4().hex
            PasswordResetToken.objects.create(
                user=user,
                token=token,
                expires_at=timezone.now() + timedelta(hours=1)
            )
            
            # Send password reset email
            send_password_reset_email(user, token)
            
            return Response({
                'message': 'Password reset link has been sent to your email.'
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PasswordResetConfirmView(APIView):
    """
    Confirm password reset
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        if serializer.is_valid():
            reset_token = serializer.validated_data['reset_token']
            password = serializer.validated_data['password']
            
            # Update password
            user = reset_token.user
            user.set_password(password)
            user.save()
            
            # Mark token as used
            reset_token.is_used = True
            reset_token.save()
            
            return Response({
                'message': 'Password has been reset successfully.'
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EmailVerificationView(APIView):
    """
    Verify email address
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = EmailVerificationSerializer(data=request.data)
        if serializer.is_valid():
            verification_token = serializer.validated_data['token']
            
            # Mark email as verified
            user = verification_token.user
            user.is_email_verified = True
            user.save()
            
            # Mark token as used
            verification_token.is_used = True
            verification_token.save()
            
            return Response({
                'message': 'Email verified successfully.'
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserListView(generics.ListAPIView):
    """
    List all users for admin
    """
    queryset = User.objects.all().order_by('-created_at')
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Additional check to ensure only admins can see the list
        if not self.request.user.is_admin:
            return User.objects.none()
        return super().get_queryset()


class AdminCreateView(APIView):
    """
    Create new admin user (only accessible by existing admins)
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        # Check if user is admin
        if not request.user.is_admin:
            return Response({
                'error': 'Only admins can create admin users.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        from .serializers import AdminCreateSerializer
        serializer = AdminCreateSerializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.save()
            
            # Return created admin details with generated password
            password = request.data.get('password', 'admin@123')
            
            from .serializers import UserProfileSerializer
            return Response({
                'message': 'Admin user created successfully',
                'admin': UserProfileSerializer(user).data,
                'generated_password': password,
                'note': 'Please change this password after first login'
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminListView(generics.ListAPIView):
    """
    List all admin users
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        # Check if user is admin
        if not request.user.is_admin:
            return Response({
                'error': 'Only admins can view admin list.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        from .serializers import UserProfileSerializer
        admins = User.objects.filter(is_admin=True).order_by('-created_at')
        serializer = UserProfileSerializer(admins, many=True)
        
        return Response({
            'count': admins.count(),
            'admins': serializer.data
        }, status=status.HTTP_200_OK)


class AdminUpdateView(APIView):
    """
    Update admin user details
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def patch(self, request, pk):
        # Check if user is admin
        if not request.user.is_admin:
            return Response({
                'error': 'Only admins can update admin users.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({
                'error': 'User not found.'
            }, status=status.HTTP_404_NOT_FOUND)
        
        from .serializers import AdminUpdateSerializer
        serializer = AdminUpdateSerializer(user, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Admin user updated successfully',
                'admin': serializer.data
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminDeleteView(APIView):
    """
    Delete/Deactivate admin user
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def delete(self, request, pk):
        # Check if user is admin
        if not request.user.is_admin:
            return Response({
                'error': 'Only admins can delete admin users.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Prevent deleting self
        if request.user.id == pk:
            return Response({
                'error': 'You cannot delete your own admin account.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({
                'error': 'User not found.'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Deactivate instead of delete (soft delete)
        user.is_active = False
        user.save()
        
        return Response({
            'message': 'Admin user deactivated successfully'
        }, status=status.HTTP_200_OK)
