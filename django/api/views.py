from django.core.mail import send_mail
from django.http import QueryDict

from rest_framework import generics, filters, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser

import django_filters

from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend
from .models import *
from .serializers import *
from .permissions import *



class ReportViewSet(generics.CreateAPIView):
    serializer_class = ReportSerializer

    def get_queryset(self):
        return []

    # Assign current user as Post owner
    def perform_create(self, serializer):
        #nstance = serializer.save()
        send_mail(
            self.request.data.get("id"),
            self.request.data.get("message"),
            'pcgeeks470@gmail.com',
            ['pcgeeks470@gmail.com'],
            fail_silently=False)



"""
    Posts Views
"""

# Returns a list of all active Posts
class PostPublicListView(generics.ListAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    ordering = 'date_created'

    def get_queryset(self):
        return Post.objects.filter(status='active')


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



"""
    Image Views
"""

# Returns a list of all Images
class ImageListView(generics.ListAPIView):
    queryset = Image.objects.all()
    serializer_class = ImageSerializer
    permission_classes = (IsAdminUser,)


# Returns a list of Images for a given Post
class PostImageListView(generics.ListAPIView):
    serializer_class = ImageSerializer

    def get_queryset(self):
        post = generics.get_object_or_404(Post, id=self.kwargs.get('post_id'))
        return Image.objects.filter(post_id=post)


# Creates a new Image
class ImageCreateView(generics.CreateAPIView):
    queryset = Image.objects.all()
    serializer_class = ImageSerializer
    permission_classes = (IsAuthenticated,)

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        data[u'post_id'] = self.kwargs.get('post_id')

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def get_serializer(self, *args, **kwargs):

        serializer_class = self.get_serializer_class()
        kwargs['context'] = self.get_serializer_context()
        return serializer_class(*args, **kwargs)


# Deletes a user (should be replaced with 'deactivated' status on User)
class ImageDeleteView(generics.DestroyAPIView):
    queryset = Image.objects.all()
    serializer_class = ImageSerializer
    permission_classes = (IsOwnerOrStaff,)


"""
    Users Views
"""

# Returns the details of the given user
class UserDetailsView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,)


# Registers a new user
class UserCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer



"""
    Self Views
"""

# Returns the details of the current user
class SelfUserDetailsView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        return self.request.user


# Updates the current user's information
class SelfUserUpdateView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        return self.request.user


# Deletes the current user
# TODO: should be replaced with 'deactivated' status on User
class SelfUserDeleteView(generics.DestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        return self.request.user


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


# Updates a Post
class SelfPostUpdateView(generics.UpdateAPIView):
    serializer_class = PostSerializer
    permission_classes = (IsAuthenticated, IsOwner, IsActivePost,)

    def get_queryset(self):
        return Post.objects.filter(owner_id=self.request.user)

    # prevent user from changing the status of the post
    def update(self, request, *args, **kwargs):
        data = request.data.copy()
        data.pop('status')

        instance = self.get_object()
        serializer = self.get_serializer(instance, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)


# Marks a post as 'deleted'
class SelfPostDeleteView(generics.UpdateAPIView):
    serializer_class = PostSerializer
    permission_classes = (IsAuthenticated, IsOwnerOrStaff, IsActivePost,)

    def get_queryset(self):
        return Post.objects.filter(owner_id=self.request.user)

    def update(self, request, *args, **kwargs):
        data = QueryDict('status=deleted')

        instance = self.get_object()
        serializer = self.get_serializer(instance, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)


# Marks a post as 'sold'
class SelfPostSellView(generics.UpdateAPIView):
    serializer_class = PostSellSerializer
    permission_classes = (IsAuthenticated, IsOwnerOrStaff, IsActivePost,)

    def get_queryset(self):
        return Post.objects.filter(owner_id=self.request.user)

    def update(self, request, *args, **kwargs):
        data = QueryDict('status=sold', mutable=True)
        data['buyer_id'] = request.data.get('buyer_id')

        instance = self.get_object()
        serializer = self.get_serializer(instance, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)



"""
    Message Views
"""

# Returns all of the current user's messages
class MessageListView(generics.ListAPIView):
    serializer_class = MessagingSerializer
    permission_classes = (IsAuthenticated,)
    ordering = '-date_created'

    def get_queryset(self):
        return Messaging.objects.filter(Q(owner=self.request.user) | Q(receiver_id=self.request.user))

class MessageHeadView(generics.ListAPIView):
    serializer_class = MessagingSerializer
    permission_classes = (IsAuthenticated,)
    ordering = '-date_created'

    def get_queryset(self):
        return Messaging.objects.filter(Q(owner=self.request.user) | Q(receiver_id=self.request.user)).filter(parent_message=None)


# class MessageCreateView(generics.ListCreateAPIView):
#     queryset = Messaging.objects.all()
#     serializer_class = MessagingSerializer
#     permission_classes = (IsAuthenticated,)
#
#     def create(self, request, *args, **kwargs):
#         data = request.data.copy()
#         data[u'owner'] = str(self.request.user.id)
#
#         serializer = self.get_serializer(data=data)
#         serializer.is_valid(raise_exception=True)
#         self.perform_create(serializer)
#         headers = self.get_success_headers(serializer.data)
#         return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)




# Returns a message
class MessageCreateView(generics.ListCreateAPIView):
    queryset = Messaging.objects.all()
    serializer_class = MessagingSerializer
    permission_classes = (IsAuthenticated, IsOwner,)
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
class MessageConversationView(generics.ListAPIView):
    serializer_class = MessagingSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        #return Messaging.objects.filter(post_id=self.kwargs.get('pid')).filter(owner=self.kwargs.get('bid')).filter(Q(owner=self.request.user) | Q(receiver_id=self.request.user)).filter(parent_message=None).("next_message").all()
        return Messaging.objects.filter(post_id=self.kwargs.get('pid')).filter(Q(owner=self.request.user) | Q(receiver_id=self.request.user)).filter(Q(owner=self.kwargs.get('bid')) | Q(receiver_id=self.kwargs.get('bid')))
        #return Messaging.objects.filter(post_id=self.kwargs.get('pid')).filter(owner=self.kwargs.get('bid')).prefetch_related('next_message').all()



"""
    Potential_buyer Views
"""



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
    permission_classes = (IsAuthenticated, IsActivePost,)

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        data[u'post_id'] = kwargs.get('post_id')
        data[u'user_id'] = self.request.user.id

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
        post = generics.get_object_or_404(Post, id=post_id)
        if post.buyer_id == None:
            return Response({'error': 'This post has not ended yet.'}, status=status.HTTP_400_BAD_REQUEST)
        data[u'buyer_id'] = post.buyer_id.id

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

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        post_id = kwargs.get('post_id')
        data[u'post_id'] = post_id
        data[u'rater_id'] = self.request.user.id
        post = generics.get_object_or_404(Post, id=post_id)
        if post.buyer_id is None:
            return Response({'error': 'This post has not ended yet.'}, status=status.HTTP_400_BAD_REQUEST)
        data[u'seller_id'] = post.owner_id.id

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


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


# Updates a User's information
class StaffUserUpdateView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated, IsAdminUser,)

    def get_object(self):
        queryset = self.get_queryset()
        user = queryset.get(id=self.request.user.id)
        return user


# Deletes a User
# TODO: should be replaced with 'deactivated' status on User
class StaffUserDeleteView(generics.DestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated, IsAdminUser,)

    def get_object(self):
        return self.request.user


# Returns a list of all Posts (regardless of status)
class StaffPostListView(generics.ListAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = (IsAuthenticated, IsAdminUser,)
    ordering = 'date_created'

    def get_queryset(self):
        return Post.objects.filter(status='active')


# Updates a Post
class StaffPostUpdateView(generics.UpdateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = (IsAuthenticated, IsAdminUser,)



# Marks a post as 'removed'
class StaffPostDeleteView(generics.UpdateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = (IsAuthenticated, IsAdminUser,)

    def update(self, request, *args, **kwargs):
        data = QueryDict('status=removed')

        instance = self.get_object()
        serializer = self.get_serializer(instance, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)


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
