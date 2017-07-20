from rest_framework.permissions import BasePermission
from .models import Post
from .models import Messaging

class IsOwner(BasePermission):
        """Custom permission class to allow only post owners to edit them"""

        def has_object_permission(self, request, view, obj):
            """Return True if permission is granted to the post owner."""
            if isinstance(obj, Post):
                    return obj.owner == request.user
            if isinstance(obj, Messaging):
                    return obj.owner == request.user
            return obj.owner == request.user
