from rest_framework import generics, permissions
from .serializers import UserSerializer, PostSerializer, MessagingSerializer
from .models import User, Post, Messaging
from .permissions import IsOwner, IsStaffOrTargetUser

from rest_framework import viewsets
from rest_framework.permissions import AllowAny


class UserView(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    model = User

    def get_permissions(self):
        # allow non-authenticated user to create via POST
        return (AllowAny() if self.request.method == 'POST'
                else IsStaffOrTargetUser()),


# Obtains a list of all Posts
class PostPublicListView(generics.ListAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer


# Obtains a list of Posts belonging to a user
class PostPrivateListCreateView(generics.ListCreateAPIView):
    serializer_class = PostSerializer
    permission_classes = (permissions.IsAuthenticated, IsOwner)

    def get_queryset(self):
        return Post.objects.filter(owner_id=self.request.user)

    # Assign current user as Post owner
    def perform_create(self, serializer):
        serializer.save(owner_id=self.request.user)


# Retrieves, modifies, and deletes Post instances
class PostInstanceView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PostSerializer
    permission_classes = (permissions.IsAuthenticated, IsOwner)

    def get_queryset(self):
        return Post.objects.filter(owner_id=self.request.user)


class CreateViewMessaging(generics.ListCreateAPIView):
    """This class defines the create behaviour of our rest api"""
    queryset = Messaging.objects.all()
    serializer_class = MessagingSerializer
    permission_classes = (permissions.IsAuthenticated, IsOwner)

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
