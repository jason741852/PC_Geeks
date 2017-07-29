from rest_framework import generics, permissions, filters
from .serializers import UserSerializer, PostSerializer, MessagingSerializer, SearchSerializer
from .models import User, Post, Messaging, Search
from .permissions import IsOwner, IsStaffOrTargetUser
from django_filters.rest_framework import DjangoFilterBackend

from rest_framework import viewsets
from rest_framework.permissions import AllowAny
import django_filters



class UserView(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    model = User

    def get_permissions(self):
        # allow non-authenticated user to create via POST
        return (AllowAny() if self.request.method == 'POST'
                else IsStaffOrTargetUser()),


#Filtering
#class PostFilter(django_filters.FilterSet):
#    min_price = django_filters.NumberFilter(name="price", lookup_type='gte')
#    max_price = django_filters.NumberFilter(name="price", lookup_type='lte')
#    class Meta:
#        model = Post
#        fields = ['manufacturer', 'quality', 'min_price', 'max_price']


# Obtains a list of all Posts
class PostPublicListView(generics.ListAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer




    def get_queryset(self):
        # quality may be None
        return self.queryset \
            .filter(quality=self.kwargs.get('quality')) \
            .filter(author=self.request.user)


# Obtains a list of Posts belonging to a user
class PostPrivateListCreateView(generics.ListCreateAPIView):
    serializer_class = PostSerializer
    permission_classes = (permissions.IsAuthenticated, IsOwner)

    
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)
    #search_fields = ('manufacturer', 'quality')
    filter_fields = ('manufacturer', 'quality', 'price')
    ordering_fields = '__all__'

   
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

class CreateViewSearch(generics.ListCreateAPIView):
    """This class defines the create behaviour of our rest api"""
    queryset = Search.objects.all()
    serializer_class = SearchSerializer
    permission_classes = (permissions.IsAuthenticated, IsOwner)

    def perform_create(self, serializer):
        """Save the post data wen creating a new post"""
        serializer.save(owner=self.request.user)


class DetailsViewSearch(generics.RetrieveUpdateDestroyAPIView):
    """This class handles GET, PUT, PATCH and DEL requests."""

    queryset = Search.objects.all()
    serializer_class = SearchSerializer
    permission_classes = (
        permissions.IsAuthenticated,
        IsOwner)
