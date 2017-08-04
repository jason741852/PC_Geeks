from django.contrib.auth import get_user_model
from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator



def get_deleted_user():
    return get_user_model().objects.get_or_create(username='deleted')[0]


class User(AbstractUser):
    phone_number = models.CharField(max_length=16, blank=True, null=True)
    rating = models.FloatField(default=0)


class Post(models.Model):
    title = models.TextField(blank=False,default='title')
    body = models.TextField(blank=True, null=True)
    item = models.CharField(max_length=255)
    category = models.CharField(max_length=255)
    quality = models.CharField(max_length=255)
    manufacturer = models.CharField(max_length=255)
    price = models.IntegerField(default=0)
    location = models.CharField(max_length=255, blank=True)
    latitude = models.DecimalField(null=True, max_digits=9, decimal_places=6)
    longitude = models.DecimalField(null=True, max_digits=9, decimal_places=6)
    owner_id = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='posts',
        on_delete=models.SET(get_deleted_user)
    )
    buyer_id = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        related_name='items_bought',
        on_delete=models.SET(get_deleted_user)
    )
    date_created = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "Item:" + self.item
        #return "Owner: " + self.owner_id.id +\
        #       " Title: " + self.title


class Messaging(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL,
        related_name='messaging',
        on_delete=models.CASCADE)
    body = models.TextField(blank=False, unique=True)
    date_created = models.DateTimeField(auto_now_add=True)
    send_userid = models.IntegerField(default=0)
    receive_userid = models.IntegerField(default=0)

    # Return a human readable representation of the model instance.
    def __str__(self):
        return "{}".format(self.post_name)


class Potential_buyer(models.Model):
    user_id = models.ForeignKey(settings.AUTH_USER_MODEL,
        related_name='post_interested_in',
        on_delete=models.CASCADE)
    post_id = models.ForeignKey('Post',
        related_name = 'potential_buyer',
        on_delete=models.CASCADE)
    date_created = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)


class Buyer_rating(models.Model):
    rater_id = models.ForeignKey(settings.AUTH_USER_MODEL,
        related_name='submitted_buyer_rating',
        on_delete=models.CASCADE)
    buyer_id = models.ForeignKey(settings.AUTH_USER_MODEL,
        related_name='rating_as_a_buyer',
        on_delete=models.CASCADE)
    post_id = models.ForeignKey('Post',
        related_name = 'buyer_rating',
        on_delete=models.CASCADE)
    rating = models.IntegerField(
        blank=False,
        validators=[
            MaxValueValidator(5),
            MinValueValidator(1)
        ])
    comment = models.TextField(blank=False,max_length=1000)
    date_created = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)


class Seller_rating(models.Model):
    rater_id = models.ForeignKey(settings.AUTH_USER_MODEL,
        related_name='submitted_seller_rating',
        on_delete=models.CASCADE)
    seller_id = models.ForeignKey(settings.AUTH_USER_MODEL,
        related_name='rating_as_a_seller',
        on_delete=models.CASCADE)
    post_id = models.ForeignKey('Post',
        related_name = 'seller_rating',
        on_delete=models.CASCADE)
    rating = models.IntegerField(
        blank=False,
        validators=[
            MaxValueValidator(5),
            MinValueValidator(1)
        ])
    comment = models.TextField(blank=False,max_length=1000)
    date_created = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)
