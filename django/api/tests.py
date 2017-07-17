from django.test import TestCase
from .models import Post
# Create your tests here.

class ModelTestCase(TestCase):

    def setUp(self):
        """Define the test client and other test variables."""
        self.post_name = "hi"
        self.post = Post(post_name=self.post_name)

    def test_model_can_create_a_post(self):
        old_count = Post.objects.count()
        self.post.save()
        new_count = Post.objects.count()
        self.assertNotEqual(old_count, new_count)


class ViewTestCase(TestCase):
    """Test for API views."""

    def setUp(self):
        """Define the test client and other test variables."""
        self.client = APIClient()
        self.post_data = {'post_name': 'MSI GTX1080'}
        self.response = self.client.post(
            reverse('create'),
            self.post_data,
            format="json")

    def test_api_can_create_a_post(self):
        """Test the api has post creation capability"""
        self.assertEqual(self.response.status_code, status.HTTP_201_CREATED)
