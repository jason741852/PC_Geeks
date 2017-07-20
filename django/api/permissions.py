from rest_framework.permissions import BasePermission
from .models import Post
from .models import Messaging
from rest_framework import permissions

class IsStaffOrTargetUser(permissions.BasePermission):
    def has_permission(self, request, view):
        # allow user to list all users if logged in user is staff
        return view.action == 'retrieve' or request.user.is_staff
 
    def has_object_permission(self, request, view, obj):
        # allow logged in user to view own details, allows staff to view all records
        return request.user.is_staff or obj == request.user

class IsOwner(BasePermission):
        """Custom permission class to allow only post owners to edit them"""

        def has_object_permission(self, request, view, obj):
            """Return True if permission is granted to the post owner."""
            if isinstance(obj, Post):
                    return obj.owner == request.user
            if isinstance(obj, Messaging):
                    return obj.owner == request.user
            return obj.owner == request.user
