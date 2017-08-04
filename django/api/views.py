from rest_framework import generics, permissions
from .serializers import *
from .models import *
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
