from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework.fields import SkipField
from rest_framework.relations import PKOnlyObject
from .models import *
from collections import OrderedDict
from decimal import *
import re

class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = '__all__'

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

    def validate_price(self, value):
        if value < 0:
            raise ValidationError('The price cannot be negative')
        return value

    def validate_latitude(self, value):
        if value < Decimal(-90) or value > Decimal(90):
            raise ValidationError('Latitude must be between -90 and 90')
        return value

    def validate_longitude(self, value):
        if value < Decimal(-180) or value > Decimal(180):
            raise ValidationError('Latitude must be between -180 and 180')
        return value

    def to_representation(self, instance):
        ret = OrderedDict()
        fields = self._readable_fields

        for field in fields:
            try:
                attribute = field.get_attribute(instance)
            except SkipField:
                continue
            check_for_none = attribute.pk if isinstance(attribute, PKOnlyObject) else attribute
            if check_for_none is None:
                ret[field.field_name] = None
            else:
                ret[field.field_name] = field.to_representation(attribute)

        images = Image.objects.filter(post_id=instance.id)
        image_objs = ImageSerializer(images, many=True).data
        images = []
        for i in image_objs:
            images.append(i['url'])
        ret['images'] = images

        seller_ratings = SellerRating.objects.filter(seller_id=instance.owner_id)
        if seller_ratings.exists():
            seller_ratings = SellerRatingSerializer(seller_ratings, many=True).data
            total = 0.0
            for i in seller_ratings:
                total += i['rating']
            total /= len(seller_ratings)
            ret['seller_rating'] = OrderedDict()
            ret['seller_rating']['rating'] = total
            ret['seller_rating']['number_of_raters'] = len(seller_ratings)
        else:
            ret['seller_rating'] = None

        return ret

class PostSellSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'
        read_only_fields = (
            'owner_id',
            'date_created',
            'date_modified',
        )

    def validate_buyer_id(self, value):
        if value is None:
            raise ValidationError('A buyer must be specified')
        return value

    def validate(self, data):
        if data.get('buyer_id') == self.context['request'].user:
            raise ValidationError('You cannot add yourself as a buyer')
        return data


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = '__all__'


class PrivatePostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = (
            'id',
            'title',
            'body',
            'item',
            'category',
            'quality',
            'manufacturer',
            'price',
            'location',
            'latitude',
            'longitude',
            'buyer_id',
            'date_created',
            'date_modified',
        )

    def to_representation(self, instance):
        potential_buyers = PotentialBuyerSerializer(PotentialBuyer.objects.filter(post_id=instance.id), many=True).data

        buyer, buyer_rating, seller_rating = None, None, None
        if instance.buyer_id is not None:
            try:
                buyer_rating = BuyerRating.objects.get(buyer_id=instance.buyer_id.id, post_id=instance.id)
                buyer_rating = BuyerRatingSerializer(instance=buyer_rating).data
            except BuyerRating.DoesNotExist:
                pass
            try:
                seller_rating = SellerRating.objects.get(seller_id=instance.owner_id, post_id=instance.id)
                seller_rating = BuyerRatingSerializer(instance=seller_rating).data
            except SellerRating.DoesNotExist:
                pass

            # filter out information of the buyer
            buyer = UserSerializer(instance=instance.buyer_id).data
            for key in ('phone_number', 'is_active', 'email', 'is_superuser', 'is_staff', 'last_login', 'groups',
                        'user_permissions', 'password', 'date_joined', 'id'):
                del buyer[key]

        ret = OrderedDict()
        ret['id'] = instance.id
        ret['title'] = instance.title
        ret['body'] = instance.body
        ret['item'] = instance.item
        ret['category'] = instance.category
        ret['quality'] = instance.quality
        ret['manufacturer'] = instance.manufacturer
        ret['price'] = instance.price
        ret['location'] = instance.location
        ret['latitude'] = instance.latitude
        ret['longitude'] = instance.longitude
        ret['buyer'] = buyer
        ret['date_created'] = instance.date_created
        ret['date_modified'] = instance.date_modified
        ret['buyer_rating'] = buyer_rating
        ret['seller_rating'] = seller_rating
        ret['potential_buyers'] = potential_buyers

        return ret


class MessagingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Messaging
        fields = '__all__'
        read_only_fields = (
        'owner',
        'date_created'
        )



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

    def validate_password(self, value):
        if len(value) < 6:
            raise ValidationError('Your password must be at least 6 characters long')
        return value

    def validate_phone_number(self, value):
        if re.search('[a-zA-Z]', value):
            raise ValidationError('Your phone number should not contain any of the characters from the alphabet')
        return value

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

    def to_representation(self, instance):
        ret = OrderedDict()
        ret['id'] = instance.id
        ret['username'] = instance.username
        ret['first_name'] = instance.first_name
        ret['last_name'] = instance.last_name
        ret['email'] = instance.email
        ret['phone_number'] = instance.phone_number

        buyer_ratings = BuyerRating.objects.filter(buyer_id=instance.id)
        buyer_ratings = BuyerRatingSerializer(buyer_ratings, many=True).data
        ret['buyer_ratings'] = buyer_ratings

        seller_ratings = SellerRating.objects.filter(seller_id=instance.id)
        seller_ratings = SellerRatingSerializer(seller_ratings, many=True).data
        ret['seller_ratings'] = seller_ratings

        return ret


class PotentialBuyerSerializer(serializers.ModelSerializer):
    class Meta:
        model = PotentialBuyer
        fields = '__all__'
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
                raise ValidationError('You are already interested in this listing')

        return data


class PrivatePotentialBuyerSerializer(serializers.ModelSerializer):
    class Meta:
        model = PotentialBuyer
        fields = ('post_id',)

    def to_representation(self, instance):
        post = PostSerializer(instance=instance.post_id).data
        for key in ('body', 'latitude', 'longitude', 'date_created', 'date_modified', 'owner_id', 'buyer_id'):
            del post[key]
        return post


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


class StaffUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
