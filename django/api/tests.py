from django.test import TestCase
from .models import *
from django.contrib.auth.models import User
from rest_framework.test import APIClient, force_authenticate
from django.core.urlresolvers import reverse
from rest_framework import status
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.contrib import auth


class ModelTestCase(TestCase):

    def setUp(self):
        """Define the test client and other test variables."""
        self.post_name = "MSI GTX 1080"
        user = get_user_model().objects.create(username="Johnny")
        self.post = Post(title="hello world", owner_id=user)

    def test_model_can_create_a_post(self):
        old_count = Post.objects.count()
        self.post.save()
        new_count = Post.objects.count()
        self.assertNotEqual(old_count, new_count)


class ViewTestCase(TestCase):
    """Test for API views."""

    def setUp(self):
        """Define the test client and other test variables."""
        user = get_user_model().objects.create(username="Peter")
        user.set_password('123')
        user.save()

        self.client = APIClient()
        self.client.force_authenticate(user=user)


    def test_api_can_create_a_post(self):
        """Test the api has post creation capability"""
        login = self.client.login(username="Peter", password="123")

        # Assert user is logged in
        self.assertTrue(login)
        self.assertEqual(get_user_model().objects.count(),1)
        post_data = {"item":"GTX1080", "category":"video card", "quality":"good", "manufacturer":"MSI"}


        """Test POST request"""
        self.POSTresponse = self.client.post(
            '/posts/',
            post_data
        )
        post = Post.objects.get()

        # Assert POST request succeed
        self.assertEqual(self.POSTresponse.status_code, status.HTTP_201_CREATED)
        #print(self.POSTresponse.content)


        """Test GET request"""
        self.GETresponse = self.client.get(
            '/posts/1/?format=json'
        )
        #print(self.GETresponse.content)

        # Assert GET request succeed
        self.assertEqual(self.POSTresponse.content, self.GETresponse.content)


        """Test PUT request"""
        change_post = {"item":"GTX1080", "category":"video card", "quality":"poor", "manufacturer":"MSI"}

        self.PUTresponse = self.client.put(
            '/posts/1/?format=json', change_post
        )

        self.assertEqual(self.PUTresponse.status_code, status.HTTP_200_OK)


        """Test Buyer_rating"""
        buyer_rating_data = {"rating":2, "comment":"this item sucks", "buyer_id":1, "post_id":1}
        self.brPOSTresponse = self.client.post(
            '/buyer_ratings/',
            buyer_rating_data
        )
        self.assertEqual(self.brPOSTresponse.status_code, status.HTTP_201_CREATED)

        # Assert related name works
        buyer_rating = Buyer_rating.objects.get(id=1)
        rating_get_from_related_name=Post.objects.get(id=1).buyer_rating.get(id=1)
        self.assertEqual(rating_get_from_related_name.comment, buyer_rating.comment)


        """Test Seller_rating"""
        seller_rating_data = {"rating":1, "comment":"he did not show up on time", "seller_id":1, "post_id":1}
        self.srPOSTresponse = self.client.post(
            '/seller_ratings/',
            seller_rating_data
        )
        self.assertEqual(self.srPOSTresponse.status_code, status.HTTP_201_CREATED)

        # Assert related name works
        seller_rating = Seller_rating.objects.get(id=1)
        rating_get_from_related_name=Post.objects.get(id=1).seller_rating.get(id=1)
        self.assertEqual(rating_get_from_related_name.comment, seller_rating.comment)


        """Test Potential_buyer"""
        # Assert post owner not on potential_buyer list
        potential_buyer_data = {"post_id":1}
        self.pbPOSTresponse = self.client.post(
            '/potential_buyer/',
            potential_buyer_data
        )
        self.assertEqual(self.pbPOSTresponse.status_code, status.HTTP_400_BAD_REQUEST)



        self.client.logout()
        user = get_user_model().objects.create(username="Mary")
        user.set_password('123')
        user.save()

        self.client = APIClient()
        self.client.force_authenticate(user=user)

        login = self.client.login(username="Mary", password="123")

        # Assert user Mary is logged in
        self.assertTrue(login)
        self.assertEqual(get_user_model().objects.count(),2)

        potential_buyer_data = {"post_id":1}
        self.pbPOSTresponse = self.client.post(
            '/potential_buyer/',
            potential_buyer_data
        )
        self.assertEqual(self.pbPOSTresponse.status_code, status.HTTP_201_CREATED)
        potential_buyer = Potential_buyer.objects.get(id=1)
        # print(potential_buyer.post_id.id)
        potential_buyer_list = Post.objects.get(id=potential_buyer.post_id.id).potential_buyer.all()

        potential_buyer_from_related_name=Post.objects.get(id=1).potential_buyer.get(id=1)

        self.assertEqual(potential_buyer_from_related_name.user_id, potential_buyer.user_id)


        """Test GET in potential_buyer"""
        self.pbGETresponse = self.client.get(
            '/potential_buyer/1/?format=json'
        )
        # Assert GET request succeed
        self.assertEqual(self.pbPOSTresponse.content, self.pbGETresponse.content)


        """Test same user cannot POST to potential_buyer on same post more than once"""
        self.pbPOSTresponse = self.client.post(
            '/potential_buyer/',
            potential_buyer_data
        )
        self.assertEqual(self.pbPOSTresponse.status_code, status.HTTP_400_BAD_REQUEST)
