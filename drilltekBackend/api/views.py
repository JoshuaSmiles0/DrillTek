from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from .models import Users, DrillProgram
from .serializers import UserSerializer, UserPasswordSerializer, addDrillholeSerializer, drillProgramSerializer, editProgramSerializer
from django.contrib.auth.hashers import make_password, check_password
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from django.contrib.auth import get_user_model

# Note to developers, axios does not like 204 status codes so these have been
# Replaced here

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
                return Response({"message":"Proceed to password change"}, status=status.HTTP_200_OK)
        except:
            return Response({"message":"An Error Has Occured, Please try again"}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=["patch"])
    # Could probably refactor this later on - very convoluted
    # Need to look at catching all other errors - all handled
    # Now hashes password with pbkdf2-sha256 before storage in database so not plaintext
    # Now sets signedUp to true representing initial password change
    # Added old password check also before committing password change else unauthorised. 
    def setPassword(self, request):
          body = request.data
          userEmail = body["email"]
          password = body["password"]
          oldPassword = body["oldPassword"]
          if password:
            hashedPassword = make_password(password=password)
            wrappedPassword = {"passwordhash":hashedPassword, "signedUp":True}
            try:
                user = Users.objects.get(email = userEmail)
                if user.passwordhash == oldPassword:
                  serializer=UserPasswordSerializer(user, wrappedPassword, partial=True)
                  if serializer.is_valid():
                      serializer.save()
                      return Response({"message":"success"},status=status.HTTP_200_OK)
                  else: 
                      return Response({"message":"something went wrong, please try again"},serializer.errors,status=status.HTTP_404_NOT_FOUND)
                else:
                    return Response({"message":"something went wrong, please try again later"}, status=status.HTTP_401_UNAUTHORIZED)
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
                # Gets Django User model to retrieve api service user and register tokens to that user
                User = get_user_model()
                u = User.objects.get(username='api-service-user')
                print(f"{u.username}")
                accessToken = AccessToken().for_user(u)
                accessToken['email']=user.email
                accessToken['role']=user.userrole
                refreshToken = RefreshToken().for_user(u)
                refreshToken['email']=user.email
                refreshToken['role']=user.userrole
                return Response({"message":"success!", "access":str(accessToken), "refresh":str(refreshToken), "userid": user.userid}, status=status.HTTP_200_OK)
            else:
                return Response({"message":"unsuccessful"}, status=status.HTTP_401_UNAUTHORIZED)
        except:
            return Response({"message":"something went wrong"}, status=status.HTTP_404_NOT_FOUND)

class DrillProgramViewSet(viewsets.ModelViewSet):
    permission_classes=[IsAuthenticated]

    # Returns all programs serialized. 
    @action(detail=False,methods=["get"])
    def getPrograms(self, request):
        try:
            drillPrograms = DrillProgram.objects.all()
            serializer = drillProgramSerializer(drillPrograms, many=True)
            return Response({"message":"success", "data":serializer.data}, status=status.HTTP_200_OK)
        except:
            return Response({"message":"something went wrong"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    # Adds drill program if no issue
    @action(detail=False, methods=["post"])
    def createProgram(self, request):
        try:
            serializer = drillProgramSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response({"message":"program added"}, status=status.HTTP_201_CREATED)
            else:
                return Response({"message":"Error creating program, please try again"}, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response({"message":"something went wrong, please try again"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)    
    
    @action(detail=False, methods=["get"])
    def getProgramById(self, request):
        id = request.query_params.get('programid')
        try: 
            program = DrillProgram.objects.get(programid = id)
            serializer = drillProgramSerializer(program)
            return Response({"message":"program successfully retrieved", "data":serializer.data}, status=status.HTTP_200_OK)
        except:
            return Response({"message":"unable to retrieve program"}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['patch'])
    def editProgram(self,request):
        body = request.data
        id = body['originalid']
        try:
            program = DrillProgram.objects.get(programid = id)
            serializer = drillProgramSerializer(program,data=request.data['program'],partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({"message":"Program Updated Successfully"}, status=status.HTTP_200_OK)
            else:
                print(serializer.errors)
                return Response({"message":"something went wrong"},status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response({"message":"could not carry out request"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class DrillholeViewSet(viewsets.ModelViewSet):
    permission_classes=[IsAuthenticated]

    @action(detail=False, methods=["post"])
    def addDrillhole(self,request):
        try:
            serializer = addDrillholeSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response({"message":"drillhole added successfully"},status=status.HTTP_201_CREATED)
            else:
                print(serializer.errors)
                return Response({"message":"error creating drillhole"}, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response({"message":"something went wrong"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


        

    



