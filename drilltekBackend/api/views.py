from django.shortcuts import render
from rest_framework import generics
from .models import Users
from .serializers import UserSerializer
# Create your views here.

class UserList(generics.ListAPIView):
    queryset = Users.objects.all()
    serializer_class = UserSerializer

