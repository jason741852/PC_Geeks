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


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = '__all__'


class PostListSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    item = serializers.CharField(max_length=255)
    category = serializers.CharField(max_length=255)
    quality = serializers.CharField(max_length=255)
    manufacturer = serializers.CharField(max_length=255)
    price = serializers.IntegerField()
    date_created = serializers.DateTimeField()
    image = serializers.URLField()
   

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
