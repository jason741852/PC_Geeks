from django.shortcuts import render
from rest_framework import generics
from .serializers import PostSerializer
from .models import Post
# Create your views here.

class CreateView(generics.ListCreateAPIView):
    """This class defines the create behaviour of our rest api"""
    queryset = Post.objects.all()
    serializer_class = PostSerializer

    def perform_create(self, serializer):
        """Save the post data wen creating a new post"""
        serializer.save()
