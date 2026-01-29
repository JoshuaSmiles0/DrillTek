from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from .models import Users
from .serializers import UserSerializer
# Create your views here.

# Replaced with view sets for different tables for reasons of efficiency 
class UserViewSet(viewsets.ModelViewSet):

    @action(detail=False, methods=["post"])

    def registerUser(self, request):
        

    



