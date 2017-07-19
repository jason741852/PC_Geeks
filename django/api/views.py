from django.shortcuts import render
from rest_framework import generics, permissions
from .serializers import PostSerializer
from .models import Post
from .permissions import IsOwner
# Create your views here.

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
