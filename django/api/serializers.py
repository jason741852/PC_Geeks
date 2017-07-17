from rest_framework import serializers
from .models import Post

class PostSerializer(serializers.ModelSerializer):
    """Serializer to map the Model instance into JSON format."""
    owner = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        """Meta class to map serializer's field with the model fields."""
        model = Post
        fields = ('id', 'post_name', 'owner', 'date_created', 'date_modified')
        read_only_fields = ('date_created', 'date_modified')
