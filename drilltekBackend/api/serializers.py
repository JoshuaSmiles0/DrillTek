from rest_framework import serializers
from .models import Drillhole, Users, DrillProgram

# Serializer for user model
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['userid', 'email', 'passwordhash', 'fname', 'lname', 'userrole', 'signedUp']

class UserPasswordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['passwordhash','signedUp']

class drillProgramSerializer(serializers.ModelSerializer):
    class Meta:
        model = DrillProgram
        fields = ['programid','orebody','location','target','totalholes','totalmeters','userid','dateplanned','dateupdated']

class editProgramSerializer(serializers.ModelSerializer):
    class Meta:
        model = DrillProgram
        fields = ['programid','orebody','location','target']

class addDrillholeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Drillhole
        fields = ['xcoord','ycoord','zcoord','dip','azimuth','length','type','programid','userid']

class DrillholeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Drillhole
        fields = ['holeid','xcoord','ycoord','zcoord','dip','azimuth','length','type','programid','userid','dateplanned','dateupdated']        