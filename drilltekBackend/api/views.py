from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from .models import Users
from .serializers import UserSerializer, UserPasswordSerializer
from django.contrib.auth.hashers import make_password, check_password
# Create your views here.

# Replaced with view sets for different tables for reasons of efficiency 
class UserViewSet(viewsets.ModelViewSet):
   

    @action(detail=False, methods=["post"])
    # Checks if user exists in the database. To redirect user depending on existance
    def checkUser(self, request):
        body = request.data
        userEmail = body["email"]
        try:
            exists = Users.objects.get(email = userEmail)
            return Response({"message":"success"}, status=status.HTTP_200_OK)
        except:
            return Response({"message":"An Error Has Occured, Please try again"}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=["patch"])
    # Could probably refactor this later on - very convoluted
    # Need to look at catching all other errors - all handled
    # Now hashes password with pbkdf2-sha256 before storage in database so not plaintext
    def setPassword(self, request):
          body = request.data
          userEmail = body["email"]
          password = body["password"]
          if password:
            hashedPassword = make_password(password=password)
            wrappedPassword = {"passwordhash":hashedPassword}
            try:
                user = Users.objects.get(email = userEmail)
                serializer=UserPasswordSerializer(user, wrappedPassword, partial=True)
                if serializer.is_valid():
                    serializer.save()
                    return Response({"message":"success"},status=status.HTTP_204_NO_CONTENT)
                else: 
                    return Response({"message":"something went wrong, please try again"},serializer.errors,status=status.HTTP_404_NOT_FOUND)
            except:
                return Response({"message":"incorrect email, please try again"},status=status.HTTP_400_BAD_REQUEST)
          else:
              return Response({"message":"please enter a valid password"},status=status.HTTP_400_BAD_REQUEST)



        

    



