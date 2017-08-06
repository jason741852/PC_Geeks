from rest_framework.permissions import BasePermission
from rest_framework.exceptions import APIException
from .models import *



class IsStaffOrTargetUser(BasePermission):
    # Allow logged in user to view own details, allows staff to view all records
    def has_object_permission(self, request, view, obj):
        return request.user.is_staff or obj == request.user


# Custom permission class to allow only post owners to edit them
class IsOwner(BasePermission):
    # Return True if permission is granted to the post owner.
    def has_object_permission(self, request, view, obj):
        if isinstance(obj, PotentialBuyer):
            return obj.user_id == request.user
        if isinstance(obj, BuyerRating):
            return obj.rater_id == request.user
        if isinstance(obj, SellerRating):
            return obj.rater_id == request.user
        if isinstance(obj, Post):
            return obj.owner_id == request.user
        if isinstance(obj, Messaging):
            return obj.owner == request.user
        return obj.owner == request.user


class IsOwnerOrStaff(BasePermission):
    def has_object_permission(self, request, view, obj):
        if isinstance(obj, Post):
            return obj.owner_id == request.user or request.user.is_staff
        elif isinstance(obj, Messaging):
            return obj.send_userid == request.user or obj.receive_userid == request.user or request.user.is_staff
        elif isinstance(obj, Image):
            return obj.post_id.owner_id == request.user or request.user.is_staff
        else:
            raise APIException("IsOwnerOrStaff received an object that it cannot handle.")


# TODO: should return True if the current user is the buyer of the current listing (Post)
class IsBuyer(BasePermission):
    def has_object_permission(self, request, view, obj):
        return True


# TODO: should return True if the current user is the seller of the current listing (Post)
class IsSeller(BasePermission):
    def has_object_permission(self, request, view, obj):
        return True
