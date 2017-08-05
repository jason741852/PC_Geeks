from rest_framework import generics, filters
from .serializers import UserSerializer, PostSerializer, MessagingSerializer
from .models import *
from .permissions import *
from django_filters.rest_framework import DjangoFilterBackend

from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.exceptions import ValidationError
import django_filters



"""
    Posts Views
"""
# Returns a list of all Posts
class PostPublicListView(generics.ListAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    ordering = 'date_created'


# Returns the details of a single Post
class PostDetailsView(generics.RetrieveAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer


# Creates a new Post
class PostCreateView(generics.CreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = (IsAuthenticated,)

    def perform_create(self, serializer):
        serializer.save(owner_id=self.request.user)


# Deletes a post
class PostDeleteView(generics.DestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = (IsAuthenticated, IsOwnerOrStaff,)


# Obtains a list of Posts belonging to a user
class PostPrivateListView(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = (IsAuthenticated, IsOwner)

    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)
    filter_fields = ('manufacturer', 'quality', 'price')

    ordering_fields = '__all__'
    ordering = 'date_created'

    def get_queryset(self):
        user = generics.get_object_or_404(User, id=self.kwargs.get('pk'))
        return Post.objects.filter(owner_id=user)



"""
    Users Views
"""

# Returns a list of all the users (should only be used by admins)
class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated, IsAdminUser,)


# Returns the details of the given user
class UserDetailsView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permissions_classes = (IsAuthenticated,)


# Returns the details of the current user
class UserSelfView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        queryset = self.get_queryset()
        user = queryset.get(id=self.request.user.id)
        self.check_object_permissions(self.request, user)
        return user


# Registers a new user
class UserCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


# Deletes a user (should be replaced with 'deactivated' status on User)
class UserDeleteView(generics.DestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (IsStaffOrTargetUser,)



"""
    Message Views
"""

# Returns all of the current user's messages
class MessageListView(generics.ListAPIView):
    serializer_class = MessagingSerializer
    permission_classes = (IsAuthenticated,)
    ordering = 'date_created'

    def get_queryset(self):
        return Messaging.objects.filter(owner=self.request.user)


class MessageCreateView(generics.CreateAPIView):
    queryset = Messaging.objects.all()
    serializer_class = MessagingSerializer
    permission_classes = (IsAuthenticated,)

    def get_serializer(self, *args, **kwargs):
        self.request.data[u'owner'] = str(self.request.user.id)
        self.request.data[u'send_userid'] = str(self.request.user.id)

        serializer_class = self.get_serializer_class()
        kwargs['context'] = self.get_serializer_context()
        return serializer_class(*args, **kwargs)


# Returns a message
class MessageDetailsView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Messaging.objects.all()
    serializer_class = MessagingSerializer
    permission_classes = (IsAuthenticated, IsOwnerOrStaff,)

