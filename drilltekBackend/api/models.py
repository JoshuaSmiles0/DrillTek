from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator

# User model for db
class Users(models.Model):
    #User types for enum
    user_types = (
        (1,"geologist"),
        (2,"logger"),
    )
    userid = models.AutoField(primary_key=True)
    email = models.CharField(unique=True, max_length=50)
    #Appropriate length for pbkdf2_sha256 hash default for Django
    passwordhash = models.CharField(max_length=128)
    fname = models.CharField(max_length=35)
    lname = models.CharField(max_length=35)
    userrole = models.CharField(choices=user_types, default=1)
    #Added to check if user has initiated first sign in. Will decide if allowed to
    #Proceed to login or must do first time password change
    signedUp = models.BooleanField(default=False)

    def __str__(self):
        return self.name

#Drill Program model for db
class DrillProgram(models.Model):
    # Primary key specified by user
    programid = models.CharField(primary_key=True,max_length=30)
    orebody = models.CharField(max_length=10)
    location = models.CharField(max_length=10)
    target = models.CharField(max_length=10)
    # Designed to be updated as linked drillholes added
    totalholes = models.IntegerField(default=0)
    # Designed to be updated with total meterage of holes added to program
    totalmeters = models.DecimalField(decimal_places=2,default=0.00, max_digits=8)
    # Links to user created. PK in user never updated, only deleted, should not delete records when deleted
    userid = models.ForeignKey(Users, on_delete=models.SET_NULL, null=True)
    # Designed to be added only on creation
    dateplanned = models.DateField(auto_now_add=True)
    # Changes when updates are made to program
    dateupdated = models.DateField(auto_now=True)

    def __str__(self):
        return self.name
    
class Drillhole(models.Model):
    hole_types = (
        (1,"Exploration"),
        (2,"Infill"),
    )
    holeid = models.AutoField(primary_key=True)
    xcoord = models.DecimalField(decimal_places=2, max_digits=8)
    ycoord = models.DecimalField(decimal_places=2, max_digits=8)
    zcoord = models.DecimalField(decimal_places=2, max_digits=8)
    dip = models.DecimalField(decimal_places=2, max_digits=4, 
                              validators=[
                                  MinValueValidator(-90.00),
                                  MaxValueValidator(90.00)
                              ])
    azimuth = models.DecimalField(decimal_places=2, max_digits=5,
                                  validators=[
                                      MinValueValidator(0.01),
                                      MaxValueValidator(360.00)
                                  ])
    length = models.DecimalField(decimal_places=2, max_digits=8, 
                                 validators=[
                                     MinValueValidator(1.00),
                                     MaxValueValidator(100000.00)
                                 ])
    type = models.CharField(choices=hole_types, default=2)
    programid = models.ForeignKey(DrillProgram,on_delete=models.CASCADE)
    userid = models.ForeignKey(Users, on_delete=models.SET_NULL, null=True)
    dateplanned = models.DateField(auto_now_add=True)
    dateupdated = models.DateField(auto_now=True)

class LithLog(models.Model):
    lithcodes = (
        ("W_Bm", "waulsortian biomicrite"),
        ("W_Dol", "Dolomitised Reef"),
        ("W_WL", "Wavy Laminated Facies"),
        ("W_LTU", "Lower Transition Unit"),
        ("W_Lll", "Lower Limestone Lens"),
        ("ABL_Nm","Nodular Micrite Unit"),
        ("ABL_En", "ABL Encrinite"),
        ("ABL", "Undifferentiated ABL"),
        ("ABL_Uppr", "Upper ABL"),
        ("ABL_Lwr", "ABL Lower"),
        ("OOL", "Lisduff oolite undiff"),
        ("OOL_Uppr", "Upper Lisduff Ool" ),
        ("OOL_Mid", "Middle Lisduff Ool" ),
        ("OOL_Lwr", "Lower Lisduff Ool"),
        ("SLT", "Undifferentiated Siltite"),
        ("MU", "Undifferenciated Micrite"),
        ("ARG", "Undifferenciated Argillite"),
        ("GSTN", "Undifferenciated Grainstone"),
        ("DOL", "Undifferenciated Dolomite"),
        ("BDOL", "Undifferenciated Black Dolomite"),
        ("LST", "Undifferenciated Limestone"),
    )
    index = models.AutoField(primary_key=True)
    start = models.DecimalField(decimal_places=2, max_digits=8,
                                validators=[
                                    MaxValueValidator(100000.00)
                                ])
    end = models.DecimalField(decimal_places=2, max_digits=8,
                                validators=[
                                    MaxValueValidator(100000.00)
                                ])
    lithcode = models.CharField(choices=lithcodes)
    comment = models.CharField(max_length=500)
    lithology = models.CharField(max_length=35)
    holeid = models.ForeignKey(Drillhole, on_delete=models.CASCADE)
    userid = models.ForeignKey(Users, on_delete=models.SET_NULL, null=True)
    dateLogged = models.DateField(auto_now_add=True)


class AlterationLog(models.Model):
    alterationcodes = (
    ("BMB_I", "Incipient Black Matrix Breccia"),
    ("BMB_W", "Weak Black Matrix Breccia"),
    ("BMB", "Black Matrix Breccia"),
    ("BMB_S", "Strong Black Matrix Breccia"),
    ("WMB_I", "Incipient White Matrix Breccia"),
    ("WMB_W","Weak White Matrix Breccia"),
    ("WMB", "White Matrix Breccia"),
    ("WMB_S", "Strong White Matrix Breccia"),
    ("FE_Ox", "Fe Oxides"),
    ("MN_OX", "Mn Oxides"),
    ("LE_W", "Weak Leaching"),
    ("LE", "Leaching" ),
    ("LE_S", "Strong Leaching" ),
    ("WTD_W", "Weak Weathering"),
    ("WTD", "Weathering"),
    ("WTD_S", "Strong Weathering"),
    ("BHY_Dol","Black Hydrothermal Dolomite"),
    ("WHY_Dol","White Hydrothermal Dolomite"),
    )
    index = models.AutoField(primary_key=True)
    start = models.DecimalField(decimal_places=2, max_digits=8,
                            validators=[
                                MaxValueValidator(100000.00)
                            ])
    end = models.DecimalField(decimal_places=2, max_digits=8,
                            validators=[
                                MaxValueValidator(100000.00)
                            ])
    alterationcode = models.CharField(choices=alterationcodes)
    comment = models.CharField(max_length=500)
    alterationtype = models.CharField(max_length=35)
    holeid = models.ForeignKey(Drillhole, on_delete=models.CASCADE)
    userid = models.ForeignKey(Users, on_delete=models.SET_NULL, null=True)
    dateLogged = models.DateField(auto_now_add=True)


class StructureLog(models.Model):
    structurecodes = (
    ("F1", "Weak Fault"),
    ("F2", "Moderate Fault"),
    ("F3", "Strong Fault"),
    ("F4", "Strongest Fault"),
    ("FLT", "Fault Zone"),
    ("GOU","Fault Gouge"),
    ("HY_BX", "Hydrothermal Breccia"),
    ("BX", "Non Hydrothermal Breccia"),
    ("VCAL", "Calcite Vein"),
    ("VDOL", "Dolomite Vein"),
    ("VPDOL", "Pink Plug dolomite vein"),
    ("VQTZ", "Quartz Vein" ),
    ("VHAEM", "Haematite Vein" ),
    ("J1", "Weak Joint"),
    ("J2", "Moderate Joint"),
    ("J3", "Strong Joint"),
    ("J4","Strongest Joint"),
    ("S1","Weak Slip Plane"),
    ("S2","Moderate Slip Plane"),
    ("S3","Strong Slip Plane"),
    ("S4","Strongest Slip Plane"),
    ("FLD","Fold"),
    ("B", "Bedding")
    )
    index = models.AutoField(primary_key=True)
    start = models.DecimalField(decimal_places=2, max_digits=8,
                            validators=[
                                MaxValueValidator(100000.00)
                            ])
    end = models.DecimalField(decimal_places=2, max_digits=8,
                            validators=[
                                MaxValueValidator(100000.00)
                            ])
    structurecode = models.CharField(choices=structurecodes)
    comment = models.CharField(max_length=500)
    structuretype = models.CharField(max_length=35)
    dip = models.IntegerField(validators=[
        MaxValueValidator(90)
    ])
    holeid = models.ForeignKey(Drillhole, on_delete=models.CASCADE)
    userid = models.ForeignKey(Users, on_delete=models.SET_NULL, null=True)
    dateLogged = models.DateField(auto_now_add=True)

class MineralLog(models.Model):
    texturechoices = (
        ("D", "Disseminated"),
        ("R", "Replacement"),
        ("M", "Massive"),
        ("Sm", "Semi-massive"),
        ("X", "Breccia"),
        ("F", "Fracture Filling"),
        ("Rm", "Remobilised"),
        ("S", "Stringer"),
        ("V", "Veins")
    )
    sampletypes = (
        ("BLANK","Blank"),
        ("STD1", "Standard One"),
        ("STD2", "Standard Two"),
        ("STD3", "Standard Three"),
        ("SAMPLE", "Core Sample")
    )
    sampleid = models.AutoField(primary_key=True)
    start = models.DecimalField(decimal_places=2, max_digits=8,
                            validators=[
                                MaxValueValidator(100000.00)
                            ])
    end = models.DecimalField(decimal_places=2, max_digits=8,
                            validators=[
                                MaxValueValidator(100000.00)
                            ])
    estimate = models.DecimalField(decimal_places=2, max_digits=5,
                                   validators=[
                                       MinValueValidator(0.00),
                                       MaxValueValidator(100.00)
                                   ])
    zn = models.DecimalField(decimal_places=2, max_digits=5, default=0.00,   
                             validators=[
                                 MinValueValidator(0.00),
                                 MaxValueValidator(100.00)
                             ])
    pb = models.DecimalField(decimal_places=2, max_digits=5, default=0.00,
                             validators=[
                                 MinValueValidator(0.00),
                                 MaxValueValidator(100.00)
                             ])
    fe = models.DecimalField(decimal_places=2, max_digits=5, default=0.00,
                             validators=[
                                 MinValueValidator(0.00),
                                 MaxValueValidator(100.00)
                             ])
    ag = models.DecimalField(decimal_places=2, max_digits=8, default=0.00,
                             validators=[
                                 MinValueValidator(0.00),
                                 MaxValueValidator(999000.00)
                             ])
    comment = models.CharField(max_length=500)
    sampletype = models.CharField(choices=sampletypes)
    texture = models.CharField(choices=texturechoices)
    holeid = models.ForeignKey(Drillhole, on_delete=models.CASCADE)
    userid = models.ForeignKey(Users, on_delete=models.SET_NULL, null=True)
    dateLogged = models.DateField(auto_now_add=True)



                                