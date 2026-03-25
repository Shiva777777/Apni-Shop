from rest_framework import permissions


class IsAdmin(permissions.BasePermission):
    """
    Permission class for admin users only
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_admin


class IsUser(permissions.BasePermission):
    """
    Permission class for regular users only
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_regular_user


class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Permission class for object owner or admin
    """
    def has_object_permission(self, request, view, obj):
        if request.user.is_admin:
            return True
        return obj.user == request.user
