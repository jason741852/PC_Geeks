from django.shortcuts import render
from rest_framework import generics, permissions
from .serializers import PostSerializer
from .models import Post
from .serializers import MessagingSerializer
from .models import Messaging
from .permissions import IsOwner
from .permissions import IsStaffOrTargetUser

from django.contrib.auth.models import User
from rest_framework import viewsets
from rest_framework.permissions import AllowAny
 

# Create your views here.

class UserView(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    model = User
 
    def get_permissions(self):
        # allow non-authenticated user to create via POST
        return (AllowAny() if self.request.method == 'POST'
                else IsStaffOrTargetUser()),


class CreateView(generics.ListCreateAPIView):
    """This class defines the create behaviour of our rest api"""
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = (permissions.IsAuthenticated,IsOwner)

    def perform_create(self, serializer):
        """Save the post data wen creating a new post"""
        serializer.save(owner=self.request.user)

class DetailsView(generics.RetrieveUpdateDestroyAPIView):
    """This class handles GET, PUT, PATCH and DEL requests."""

    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = (
        permissions.IsAuthenticated,
        IsOwner)

class CreateViewMessaging(generics.ListCreateAPIView):
    """This class defines the create behaviour of our rest api"""
    queryset = Messaging.objects.all()
    serializer_class = MessagingSerializer
    permission_classes = (permissions.IsAuthenticated,IsOwner)

    def perform_create(self, serializer):
        """Save the post data wen creating a new post"""
        serializer.save(owner=self.request.user)

class DetailsViewMessaging(generics.RetrieveUpdateDestroyAPIView):
    """This class handles GET, PUT, PATCH and DEL requests."""

    queryset = Messaging.objects.all()
    serializer_class = MessagingSerializer
    permission_classes = (
        permissions.IsAuthenticated,
        IsOwner)
