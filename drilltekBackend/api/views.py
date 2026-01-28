from django.shortcuts import render
from rest_framework import generics
from .models import Users
from .serializers import UserSerializer
# Create your views here.

# list user api endpoint - will be removed. Is just here as a test
class UserList(generics.ListAPIView):
    queryset = Users.objects.all()
    serializer_class = UserSerializer



