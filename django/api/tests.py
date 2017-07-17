from django.test import TestCase
from .models import Post
from django.contrib.auth.models import User
# Create your tests here.

class ModelTestCase(TestCase):

    def setUp(self):
        """Define the test client and other test variables."""
        self.post_name = "MSI GTX 1080"
        user = User.objects.create(username="Johnny")
        self.post = Post(post_name=self.post_name, owner=user)

    def test_model_can_create_a_post(self):
        old_count = Post.objects.count()
        self.post.save()
        new_count = Post.objects.count()
        self.assertNotEqual(old_count, new_count)


class ViewTestCase(TestCase):
    """Test for API views."""

    def setUp(self):
        """Define the test client and other test variables."""
        user = User.objects.create(username="John")

        # Initialize client and forece it to use authentication
        self.client = APIClient()
        self.client.force_authenticate(user=user)

        # user model is not serializable, so use the id instead
        self.post_data = {'post_name': 'MSI GTX1080', 'owner':user.id}
        self.response = self.client.post(
            reverse('create'),
            self.post_data,
            format="json")

    def test_api_can_create_a_post(self):
        """Test the api has post creation capability"""
        self.assertEqual(self.response.status_code, status.HTTP_201_CREATED)

    def test_authorization_is_enforced(self):
        """Test teh api has user authorization"""
        new_client = APIClient()
        res = new_client.get('/posts/', kwargs={'pk': 3}, format="json")
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_api_can_get_a_post(self):
        """Teset the api can get a given post"""
        post = Post.objects.get(id=1)
        response = self.client.get(
        '/posts/',
        kwargs={'pk': post.id}, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertContains(response, post)

    def test_api_can_update_post(self):
        """Test the api can update a given post"""
        post = Post.objects.get()
        change_bucketlist = {'name': 'Something'}
        res = self.client.put(
            reverse('details', kwargs={'pk': post.id}), change_post, format="json"
        )
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_api_can_delete_post(self):
        """Test the api can delete a given post"""
        post = Post.objects.get()
        response = self.client.delete(
            reverse('details', kwargs={'pk': post.id}), format="json", follow=True
        )
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)
