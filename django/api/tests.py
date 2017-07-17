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
