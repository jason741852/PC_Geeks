from django_filters.rest_framework import DjangoFilterBackend
from .serializers import *
from .models import *
from .permissions import *

from rest_framework import generics, filters, status
from rest_framework.response import Response
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



"""
    Users Views
"""

# Returns the details of the given user
class UserDetailsView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permissions_classes = (IsAuthenticated,)


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
    Self Views
"""

# Returns the details of the current user
class SelfUserDetailsView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        queryset = self.get_queryset()
        user = queryset.get(id=self.request.user.id)
        self.check_object_permissions(self.request, user)
        return user


# Obtains a list of Posts belonging to a user
class SelfPostListView(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = (IsAuthenticated, IsOwner)

    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)
    filter_fields = ('manufacturer', 'quality', 'price')

    ordering_fields = '__all__'
    ordering = 'date_created'

    def get_queryset(self):
        return Post.objects.filter(owner_id=self.request.user)


# Obtains the details of a user's Post
class SelfPostDetailsView(generics.RetrieveAPIView):
    queryset = Post.objects.all()
    serializer_class = PrivatePostSerializer
    permission_classes = (IsAuthenticated, IsOwner,)


# Returns a list of Posts the current user is interested in
class SelfPotentialBuyerListView(generics.ListAPIView):
    serializer_class = PrivatePotentialBuyerSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return PotentialBuyer.objects.filter(user_id=self.request.user)



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


# Creates a new message
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
    permission_classes = (IsAuthenticated, IsOwner,)



"""
    Potential Buyer Views
"""

# Returns a list of PotentialBuyers for a Post
class PostPotentialBuyerListView(generics.ListAPIView):
    serializer_class = PotentialBuyerSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        post = generics.get_object_or_404(Post, id=self.kwargs.get('post_id'))
        return PotentialBuyer.objects.filter(post_id=post)


# Assigns a User as a PotentialBuyer for a Post
class PotentialBuyerCreateView(generics.CreateAPIView):
    queryset = PotentialBuyer.objects.all()
    serializer_class = PotentialBuyerSerializer
    permission_classes = (IsAuthenticated,)

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        data[u'post_id'] = str(kwargs.get('post_id'))
        data[u'user_id'] = str(self.request.user.id)

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


# Removes a User as a PotentialBuyer for a Post
class PotentialBuyerDeleteView(generics.DestroyAPIView):
    queryset = PotentialBuyer.objects.all()
    serializer_class = PotentialBuyerSerializer
    permission_classes = (IsAuthenticated, IsOwner,)

    def get_object(self):
        post = generics.get_object_or_404(Post, id=self.kwargs.get('post_id'))
        potential_buyer = generics.get_object_or_404(PotentialBuyer, user_id=self.request.user, post_id=post)
        return potential_buyer



"""
    Buyer Rating Views
"""

# Assigns a rating to the Buyer of a Post
class BuyerRatingCreateView(generics.CreateAPIView):
    queryset = BuyerRating.objects.all()
    serializer_class = BuyerRatingSerializer
    permission_classes = (IsAuthenticated, IsSeller,)

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        post_id = kwargs.get('post_id')
        data[u'post_id'] = post_id
        data[u'rater_id'] = self.request.user.id
        # uncomment below when buying is implemented
        # post = get_object_or_404(Post, id=post_id)
        # if post.buyer_id == None:
        #     return Response({'error': 'This post has not ended yet.'}, status=status.HTTP_400_BAD_REQUEST)
        # data[u'buyer_id'] = post.buyer_id.id

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


# Updates the rating of the Buyer of a Post
class BuyerRatingUpdateView(generics.UpdateAPIView):
    queryset = BuyerRating.objects.all()
    serializer_class = BuyerRatingUpdateSerializer
    permission_classes = (IsAuthenticated, IsOwner,)

    def get_object(self):
        post = generics.get_object_or_404(Post, id=self.kwargs.get('post_id'))
        buyer_rating = generics.get_object_or_404(BuyerRating, rater_id=self.request.user, post_id=post)
        self.check_object_permissions(self.request, buyer_rating)
        return buyer_rating



"""
    Seller Rating Views
"""

# Assigns a rating to the Seller of a Post
class SellerRatingCreateView(generics.CreateAPIView):
    queryset = SellerRating.objects.all()
    serializer_class = serializer_class = SellerRatingSerializer

    permission_classes = (IsAuthenticated, IsBuyer,)

    def get_serializer(self, *args, **kwargs):
        self.request.data[u'post_id'] = str(self.kwargs.get('post_id'))
        self.request.data[u'rater_id'] = str(self.request.user.id)
        # uncomment below when buying is implemented
        # post = get_object_or_404(Post, id=post_id)
        # if post.buyer_id == None:
        #     return Response({'error': 'This post has not ended yet.'}, status=status.HTTP_400_BAD_REQUEST)
        # data[u'seller_id'] = post.owner_id.id

        serializer_class = self.get_serializer_class()
        kwargs['context'] = self.get_serializer_context()
        return serializer_class(*args, **kwargs)


# Updates the rating of the Seller of a Post
class SellerRatingUpdateView(generics.UpdateAPIView):
    queryset = SellerRating.objects.all()
    serializer_class = SellerRatingUpdateSerializer
    permission_classes = (IsAuthenticated, IsOwner,)

    def get_object(self):
        post = generics.get_object_or_404(Post, id=self.kwargs.get('post_id'))
        seller_rating = generics.get_object_or_404(SellerRating, rater_id=self.request.user, post_id=post)
        self.check_object_permissions(self.request, seller_rating)
        return seller_rating



"""
    Staff Views
"""

# Returns a list of all the users (should only be used by admins)
class StaffUserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = StaffUserSerializer
    permission_classes = (IsAuthenticated, IsAdminUser,)


# Returns a list of all Messages
class StaffMessageListView(generics.ListAPIView):
    queryset = Messaging.objects.all()
    serializer_class = MessagingSerializer
    permission_classes = (IsAuthenticated, IsAdminUser,)


# Returns a list of all BuyerRatings
class StaffBuyerRatingListView(generics.ListAPIView):
    queryset = BuyerRating.objects.all()
    serializer_class = BuyerRatingSerializer
    permission_classes = (IsAuthenticated, IsAdminUser,)


# Returns a list of all SellerRatings
class StaffSellerRatingListView(generics.ListAPIView):
    queryset = SellerRating.objects.all()
    serializer_class = SellerRatingSerializer
    permission_classes = (IsAuthenticated, IsAdminUser,)


# Returns a list of all PotentialBuyers
class StaffPotentialBuyerListView(generics.ListAPIView):
    queryset = PotentialBuyer.objects.all()
    serializer_class = PotentialBuyerSerializer
    permission_classes = (IsAuthenticated, IsAdminUser,)
