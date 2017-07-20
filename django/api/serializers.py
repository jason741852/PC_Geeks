from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Post
from .models import Messaging

class PostSerializer(serializers.ModelSerializer):
    """Serializer to map the Model instance into JSON format."""
    owner = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        """Meta class to map serializer's field with the model fields."""
        model = Post
        fields = ('id', 'post_name', 'owner', 'date_created', 'date_modified')
        read_only_fields = ('date_created', 'date_modified')

class MessagingSerializer(serializers.ModelSerializer):
    """Serializer to map the Model instance into JSON format."""
    owner = serializers.ReadOnlyField(source='owner.username')
    class Meta:
        """Meta class to map serializer's fields with the model fields."""
        model = Messaging
        fields = ('id', 'body', 'date_created', 'send_userid', 'receive_userid', 'owner')
        read_only_fields = ('date_created', 'send_userid', 'receive_userid')

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('password', 'first_name', 'last_name', 'email',)
        write_only_fields = ('password',)
        read_only_fields = ('is_staff', 'is_superuser', 'is_active', 'date_joined',)
 
    def restore_object(self, attrs, instance=None):
        # call set_password on user object. Without this
        # the password will be stored in plain text.
        user = super(UserSerializer, self).restore_object(attrs, instance)
        user.set_password(attrs['password'])
        return user