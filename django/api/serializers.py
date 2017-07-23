from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework.exceptions import ValidationError
from .models import Post, Messaging
from decimal import *


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = (
            'id',
            'item',
            'category',
            'quality',
            'manufacturer',
            'body',
            'price',
            'location',
            'latitude',
            'longitude',
            'owner_id',
            'buyer_id',
            'date_created',
            'date_modified',
        )
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

class MessagingSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    class Meta:
        model = Messaging
        fields = ('id', 'body', 'date_created', 'send_userid', 'receive_userid', 'owner')
        read_only_fields = ('date_created', 'send_userid', 'receive_userid')

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('password', 'first_name', 'last_name', 'email',)
        write_only_fields = ('password',)
        read_only_fields = ('is_staff', 'is_superuser', 'is_active', 'date_joined',)
 
    def restore_object(self, attrs, instance=None):
        # call set_password on user object. Without this
        # the password will be stored in plain text.
        user = super(UserSerializer, self).restore_object(attrs, instance)
        user.set_password(attrs['password'])
        return user