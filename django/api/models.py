from django.db import models

# Create your models here.
class Post(models.Model):
    post_name = models.CharField(max_length=255, blank=False, unique=False)
    owner = models.ForeignKey('auth.User',
    related_name='posts',
    on_delete=models.CASCADE)
    date_created = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        """Return a human readable representation of the model instance."""
        return "{}".format(self.post_name)
