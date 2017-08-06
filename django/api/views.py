from .permissions import *
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, permissions, filters
from .serializers import *
from .models import *


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


# Updates a Post
class PostUpdateView(generics.UpdateAPIView):
    serializer_class = PostSerializer
    permission_classes = (IsAuthenticated, IsOwner,)

    def get_queryset(self):
        return Post.objects.filter(owner_id=self.request.user)


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

# Obtain a list of potential buyers belonging to a post
class PotentialBuyerListView(generics.ListAPIView):
    serializer_class = PotentialbuyerSerializer
    permission_classes = (IsAuthenticated, IsOwner)

    def get_queryset(self):
        post = generics.get_object_or_404(Post, id=self.kwargs.get('pk'))
        return Potential_buyer.objects.filter(post_id=post)



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


# Updates a User's information
class UserUpdateView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated, IsStaffOrTargetUser)


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


class MessageCreateView(generics.ListCreateAPIView):
    queryset = Messaging.objects.all()
    serializer_class = MessagingSerializer
    permission_classes = (IsAuthenticated,)

    def perform_create(self, serializer):
        if self.request.data.get('parent_message', 0):
            print("hi")
            serializer.save(
                owner = self.request.user,
                receiver_id = User.objects.get(id=self.request.data.get('receiver_id', 0)),
                post_id=Post.objects.get(id=self.request.data.get('post_id', 0)),
                parent_message=Messaging.objects.get(id=self.request.data.get('parent_message', 0)),
                body = self.request.data.get('body')
            )
        else:
            print("bye")
            serializer.save(
                owner = self.request.user,
                receiver_id = User.objects.get(id=self.request.data.get('receiver_id', 0)),
                post_id=Post.objects.get(id=self.request.data.get('post_id', 0)),
                #parent_message=Post.objects.get(id=self.request.data.get('parent_message', 0)),
                body = self.request.data.get('body')
            )

# Returns a conversation specifically to a Post and a Buyer
class MessageDetailsView(generics.ListAPIView):
    serializer_class = MessagingSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return Messaging.objects.filter(post_id=self.kwargs.get('pid')).filter(owner=self.kwargs.get('bid')).prefetch_related('next_message').all()

class CreatePotentialBuyerView(generics.ListCreateAPIView):
    serializer_class = PotentialbuyerSerializer
    permission_classes = (permissions.IsAuthenticated, IsOwner)

    def get_queryset(self):
        return Potential_buyer.objects.all()

    def perform_create(self, serializer):
        serializer.save(
            user_id=self.request.user,
            post_id=Post.objects.get(id=self.request.data.get('post_id', 0))
        )

class PotentialBuyerInstanceView(generics.RetrieveDestroyAPIView):
    serializer_class = PotentialbuyerSerializer
    permission_classes = (permissions.IsAuthenticated, IsOwner)

    def get_queryset(self):
        return Potential_buyer.objects.filter(user_id=self.request.user)


class  CreateBuyerRatingView(generics.ListCreateAPIView):
    serializer_class = BuyerratingSerializer
    permission_classes = (permissions.IsAuthenticated, IsOwner)

    def get_queryset(self):
        return Buyer_rating.objects.filter(rater_id=self.request.user)

    # Assign current user as Post owner
    def perform_create(self, serializer):
        serializer.save(
            rater_id=self.request.user,
            buyer_id=User.objects.get(id=self.request.data.get('buyer_id', 0)),
            post_id=Post.objects.get(id=self.request.data.get('post_id', 0)),
            comment=self.request.data.get('comment'),
            rating=self.request.data.get('rating')
        )

# Retrieves, modifies, and deletes Buyer_rating instances
class BuyerRatingInstanceView(generics.RetrieveAPIView):
    serializer_class = BuyerratingSerializer
    # Don't need permission to GET

    def get_queryset(self):
        return Buyer_rating.objects.filter(rater_id=self.request.user)

class  CreateSellerRatingView(generics.ListCreateAPIView):
    serializer_class = SellerratingSerializer
    permission_classes = (permissions.IsAuthenticated, IsOwner)

    def get_queryset(self):
        return Seller_rating.objects.filter(rater_id=self.request.user)

    # Assign current user as Post owner
    def perform_create(self, serializer):
        serializer.save(
            rater_id=self.request.user,
            seller_id=User.objects.get(id=self.request.data.get('seller_id', 0)),
            post_id=Post.objects.get(id=self.request.data.get('post_id', 0)),
            comment=self.request.data.get('comment'),
            rating=self.request.data.get('rating')
        )

class SellerRatingInstanceView(generics.RetrieveAPIView):
    serializer_class = SellerratingSerializer
    # Don't need permission to GET

    def get_queryset(self):
        return Seller_rating.objects.filter(rater_id=self.request.user)
