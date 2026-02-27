from django.db import models

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