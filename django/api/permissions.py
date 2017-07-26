from rest_framework.permissions import BasePermission
from .models import Post, Messaging

class IsStaffOrTargetUser(BasePermission):
    # allow user to list all users if logged in user is staff
    def has_permission(self, request, view):
        return view.action == 'retrieve' or request.user.is_staff

    # allow logged in user to view own details, allows staff to view all records
    def has_object_permission(self, request, view, obj):
        return request.user.is_staff or obj == request.user

# Custom permission class to allow only post owners to edit them
class IsOwner(BasePermission):
    # Return True if permission is granted to the post owner.
    def has_object_permission(self, request, view, obj):
        if isinstance(obj, Post):
            return obj.owner_id == request.user
        if isinstance(obj, Messaging):
            return obj.owner == request.user
        return obj.owner == request.user
