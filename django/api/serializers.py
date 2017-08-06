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

    def update(self, instance, validated_data):
        instance.username = validated_data.get('username', instance.username)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.email = validated_data.get('email', instance.email)
        instance.phone_number = validated_data.get('phone_number', instance.phone_number)

        pw = validated_data.get('password')
        if pw is not None:
            instance.set_password(pw)
            
        instance.save()

        return instance



class PotentialbuyerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Potential_buyer
        fields = ('user_id','post_id','date_created','date_modified')
        read_only_fields = (
            'user_id',
            'date_created',
            'date_modified',
        )

    def validate(self, data):
        post_id = (data.get('post_id').id)
        post_owner_id = (data.get('post_id').owner_id.id)
        user_id = self.context['request'].user.id

        if user_id == post_owner_id:
            raise ValidationError("Post owner should not be on the potential buyer list")

        potential_buyer_list = Post.objects.get(id=post_id).potential_buyer.all()

        for p in potential_buyer_list:
            if p.user_id.id == user_id:
                raise ValidationError('You are on the list already')

        return data


class BuyerratingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Buyer_rating
        fields = '__all__'
        read_only_fields = (
            'rater_id',
            'date_created',
            'date_modified'
        )

    def validate(self, data):
        buyer_id = data.get('buyer_id').id
        rater_id = self.context['request'].user.id #rater_id
        # print("buyer_id: {}".format(buyer_id))
        # print("rater_id: {}".format(rater_id))

        if buyer_id == rater_id:
            raise ValidationError('Cannot rate yourself')

        return data



class SellerratingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seller_rating
        fields = '__all__'
        read_only_fields = (
            'rater_id',
            'date_created',
            'date_modified'
        )

    def validate(self, data):
        seller_id = data.get('seller_id').id
        rater_id = self.context['request'].user.id #rater_id
        # print("buyer_id: {}".format(seller_id))
        # print("rater_id: {}".format(rater_id))

        if seller_id == rater_id:
            raise ValidationError('Cannot rate yourself')

        return data
