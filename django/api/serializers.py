from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from .models import *
from decimal import *


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'
        read_only_fields = (
            'owner_id',
            'buyer_id',
            'date_created',
            'date_modified',
        )

    def validate(self, data):
        price = data.get('price')
        latitude = data.get('latitude')
        longitude = data.get('longitude')

        if price is not None and price < 0:
            raise ValidationError('Price cannot be negative')
        if latitude is not None and (latitude < Decimal(-90) or latitude > Decimal(90)):
            raise ValidationError('Latitude must be between -90 and 90')
        if longitude is not None and (longitude < Decimal(-180) or longitude > Decimal(180)):
            raise ValidationError('Latitude must be between -180 and 180')

        return data
   

class MessagingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Messaging
        fields = ('id', 'body', 'date_created', 'send_userid', 'receive_userid', 'owner')
        read_only_fields = ('date_created',)

    def validate(self, data):
        receiver = data.get('receive_userid')
        sender = data.get('send_userid')

        if not User.objects.filter(id=receiver).exists():
            raise ValidationError('Receiving user (id = ' + receiver + ') does not exist')
        if sender == receiver:
            raise ValidationError("You cannot send a message to yourself")

        return data


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
        write_only_fields = ('password',)
        read_only_fields = (
            'is_staff',
            'is_superuser',
            'is_active',
            'date_joined',
        )

    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            phone_number=validated_data.get('phone_number'),
            is_superuser=validated_data.get('is_superuser', False),
            is_staff=validated_data.get('is_staff', False),
        )

        # hash the password when creating a new User
        user.set_password(validated_data.get('password'))

        user.save()
        return user


class PotentialBuyerSerializer(serializers.ModelSerializer):
    class Meta:
        model = PotentialBuyer
        fields = (
            'user_id',
            'post_id',
            'date_created',
            'date_modified',
        )
        read_only_fields = (
            'date_created',
            'date_modified',
        )

    def validate(self, data):
        post = data.get('post_id')
        post_owner = post.owner_id
        user = data.get('user_id')

        if user == post_owner:
            raise ValidationError("The post owner should not be on the potential buyer list")

        potential_buyer_list = Post.objects.get(id=post.id).potential_buyer.all()

        for p in potential_buyer_list:
            if p.user_id == user:
                raise ValidationError('You are on the list already')

        return data


class BuyerRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = BuyerRating
        fields = '__all__'
        read_only_fields = (
            'date_created',
            'date_modified',
        )

    def validate(self, data):
        buyer_id = data.get('buyer_id').id
        rater_id = data.get('rater_id').id
        rating = data.get('rating')

        if rating < 1 or rating > 5:
            raise ValidationError('You must provide a rating between 1 and 5')

        if buyer_id == rater_id:
            raise ValidationError('You cannot rate yourself')

        return data


class BuyerRatingUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = BuyerRating
        fields = '__all__'
        read_only_fields = (
            'post_id',
            'rater_id',
            'buyer_id',
            'date_created',
            'date_modified',
        )


class SellerRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SellerRating
        fields = '__all__'
        read_only_fields = (
            'date_created',
            'date_modified'
        )

    def validate(self, data):
        seller_id = data.get('seller_id').id
        rater_id = data.get('rater_id').id
        rating = data.get('rating')

        if rating < 1 or rating > 5:
            raise ValidationError('You must provide a rating between 1 and 5')

        if seller_id == rater_id:
            raise ValidationError('You cannot rate yourself')

        return data


class SellerRatingUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = SellerRating
        fields = '__all__'
        read_only_fields = (
            'post_id',
            'rater_id',
            'seller_id',
            'date_created',
            'date_modified',
        )
