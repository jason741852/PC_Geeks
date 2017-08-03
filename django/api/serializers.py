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
    owner = serializers.ReadOnlyField(source='owner.username')
    class Meta:
        model = Messaging
        fields = ('id', 'body', 'date_created', 'send_userid', 'receive_userid', 'owner')
        read_only_fields = ('date_created', 'send_userid', 'receive_userid')


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


class PotentialbuyerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Potential_buyer
        fields = '__all__'
        read_only_fields = (
            'user_id',
            'post_id',
            'date_created',
            'date_modified',
        )

    def validate(self, data):
        user_id = data.get('user_id')
        post_id = data.get('post_id')

        potential_buyer_list = Potential_buyer.objects.filter(post_id = post_id)

        for p in potential_buyer_list:
            if p.user_id == user_id:
                raise ValidationError('You are on the list already')

        return data


class BuyerratingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Buyer_rating
        fields = '__all__'
        read_only_fields = (
            'rater_id',
            'buyer_id',
            'post_id',
            'date_created',
            'date_modified'
        )


class SellerratingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seller_rating
        fields = '__all__'
        read_only_fields = (
            'rater_id',
            'seller_id',
            'post_id',
            'date_created',
            'date_modified'
        )
