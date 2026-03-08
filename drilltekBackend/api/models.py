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