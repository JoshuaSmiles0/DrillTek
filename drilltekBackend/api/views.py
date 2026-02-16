from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from .models import Users
from .serializers import UserSerializer, UserPasswordSerializer
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
    # Retrieves the user by email - then patches the password originally set
    # Will need to change this to a hash with some logic, possibly tomorrow - storing hash
    # Will need to check the hash on login - will need the login next 
    def setPassword(self, request):
          body = request.data
          userEmail = body["email"]
          passwordhash = body["passwordhash"]
          wrappedPassword = {"passwordhash":passwordhash}
          try:
              user = Users.objects.get(email = userEmail)
              serializer=UserPasswordSerializer(user, wrappedPassword, partial=True)
              if serializer.is_valid():
                  serializer.save()
                  return Response(status=status.HTTP_204_NO_CONTENT)
              else: 
                  return Response(serializer.errors,status=status.HTTP_404_NOT_FOUND)
          except:
              return Response(status=status.HTTP_400_BAD_REQUEST)



        

    



