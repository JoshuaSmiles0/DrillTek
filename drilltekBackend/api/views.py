from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from .models import Users
from .serializers import UserSerializer, UserPasswordSerializer
from django.contrib.auth.hashers import make_password, check_password
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
# Create your views here.

# Replaced with view sets for different tables for reasons of efficiency 
class UserViewSet(viewsets.ModelViewSet):
   

    @action(detail=False, methods=["post"])
    # Checks if user exists in the database. To redirect user depending on existance
    # Now checks if user signup is true or not indicating if first password change has 
    # taken place. Sends different success responses depending. 
    def checkUser(self, request):
        body = request.data
        userEmail = body["email"]
        try:
            exists = Users.objects.get(email = userEmail)
            if exists.signedUp:
                return Response({"message":"Proceed to login"}, status=status.HTTP_200_OK)
            else:
                return Response({"message":"Proceed to password change"}, status=status.HTTP_204_NO_CONTENT)
        except:
            return Response({"message":"An Error Has Occured, Please try again"}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=["patch"])
    # Could probably refactor this later on - very convoluted
    # Need to look at catching all other errors - all handled
    # Now hashes password with pbkdf2-sha256 before storage in database so not plaintext
    # Now sets signedUp to true representing initial password change
    def setPassword(self, request):
          body = request.data
          userEmail = body["email"]
          password = body["password"]
          if password:
            hashedPassword = make_password(password=password)
            wrappedPassword = {"passwordhash":hashedPassword, "signedUp":True}
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
    
    #Attempts to find user and checks password against hash in DB
    #If unsuccessful, sends appropriate error response
    #If successful vends Short lived access token and long lived refresh token. 
    @action(detail=False,methods=["post"])
    def login(self,request):
        body = request.data
        userEmail = body["email"]
        userPassword = body["password"]
        try:
            user = Users.objects.get(email = userEmail)
            if check_password(userPassword,user.passwordhash):
                accessToken = AccessToken()
                accessToken['email']=user.email
                accessToken['role']=user.userrole
                refreshToken = RefreshToken()
                refreshToken['email']=user.email
                refreshToken['role']=user.userrole
                return Response({"message":"success!", "access":str(accessToken), "refresh":str(refreshToken)}, status=status.HTTP_200_OK)
            else:
                return Response({"message":"unsuccessful"}, status=status.HTTP_401_UNAUTHORIZED)
        except:
            return Response({"message":"something went wrong"}, status=status.HTTP_404_NOT_FOUND)



        

    



