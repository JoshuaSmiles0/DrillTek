from rest_framework import serializers
from .models import Users

# Serializer for user model
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['userid', 'email', 'passwordhash', 'fname', 'lname', 'userrole', 'signedUp']

class UserPasswordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['passwordhash','signedUp']
