from rest_framework import serializers
from .models import AlterationLog, Drillhole, LithLog, MineralLog, StructureLog, Users, DrillProgram

# User viewset serializers
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['userid', 'email', 'passwordhash', 'fname', 'lname', 'userrole', 'signedUp']

class UserPasswordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['passwordhash','signedUp']

# Drillprogram viewset serializers
class drillProgramSerializer(serializers.ModelSerializer):
    class Meta:
        model = DrillProgram
        fields = ['programid','orebody','location','target','totalholes','totalmeters','userid','dateplanned','dateupdated']

class editProgramSerializer(serializers.ModelSerializer):
    class Meta:
        model = DrillProgram
        fields = ['programid','orebody','location','target']

# Drillhole viewset serializers
class addDrillholeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Drillhole
        fields = ['xcoord','ycoord','zcoord','dip','azimuth','length','type','programid','userid']

class DrillholeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Drillhole
        fields = ['holeid','xcoord','ycoord','zcoord','dip','azimuth','length','type','programid','userid','dateplanned','dateupdated']

# Lithlog viewset serializers
class LithlogSerializer(serializers.ModelSerializer):
    class Meta:
        model = LithLog
        fields = ['index','start','end','lithcode','comment','lithology','holeid','userid','dateLogged']

class AddLithlogSerializer(serializers.ModelSerializer):
    class Meta:
        model = LithLog
        fields = ['start','end','lithcode','comment','lithology','holeid','userid']

# Alteration log viewset serializers
class AlterationlogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlterationLog
        fields = ['index','start','end','alterationcode','comment','alterationtype','holeid','userid','dateLogged']

class AddAlterationlogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlterationLog
        fields = ['start','end','alterationcode','comment','alterationtype','holeid','userid']

# Structurelog viewset serializers
class StructurelogSerializer(serializers.ModelSerializer):
    class Meta:
        model = StructureLog
        fields = ['index','start','end','structurecode','comment','structuretype','dip','holeid','userid','dateLogged']

class AddStructurelogSerializer(serializers.ModelSerializer):
    class Meta:
        model = StructureLog
        fields = ['start','end','structurecode','comment','structuretype','dip','holeid','userid']

# Minerallog viewset serializers
class MinerallogSerializer(serializers.ModelSerializer):
    class Meta:
        model = MineralLog
        fields = ['sampleid','start','end','estimate','zn','pb','fe','ag','comment','sampletype','texture','holeid','userid','dateLogged','assaysUploaded']

class AddMinerallogSerializer(serializers.ModelSerializer):
    class Meta:
        model = MineralLog
        fields = ['sampleid','start','end','estimate','comment','sampletype','texture','holeid','userid']