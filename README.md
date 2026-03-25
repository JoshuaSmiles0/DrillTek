# DrillTek - 

## About This Application
DrillTek is a web based solution for managing and logging boreholes in extractive industry. The application is three tier, with the presentation tier being built using Svelte and Bulma CSS, the application tier Api using Django rest framework and the Data tier comprising a Postgresql database. Users can create borehole programs comprised of individual boreholes and upload geological logging information associated with them. This application was constructed using fully open source tools due to similar industrial applications carrying a large license fee.

## Installation 
Ensure that docker is installed on running machine and download this repo. 

Create .env file at root of project and populate with contents of .envExample file

```
DBPASSWORD=YOUR DBPASSWORD
SECRET_KEY=YOUR DJANGO SECRET_KEY
DB_NAME=YOUR DB NAME
DB_USER=YOUR DB USER NAME
DB_HOST=YOUR HOST IP
DB_PORT=YOUR DB PORT 
```
Replace values with your desired properties.

Run intial command from terminal using:
```
docker compose up --build
```
This will create images for DrillTek Frontend, DrillTek Backend and Drilltek DB and then run containers from these images. 

Once running, access Client from:
http://localhost:5173/

Following inital build, destroy containers using:
```
docker compose down
```
And rebuild containers using 
```
docker compose up
```

## First Login

Given the application is still in development, a test user has been generated for testing the application. This application is designed for an admin to create users within 
Postgresql and issue users with a user email and password. 

Test user details are:
```
email:j.owen@drilltek.com
password:secretsecretsecret
```

On initial login, password change will be prompted before login. Be aware that passwords are required to be minimum 15 characters as per NIST advice. 

## Application details
At present , users will have access to an area for managing boreholes called 'drilling portal' and an area for logging drillholes called 'logging portal'.
On login these will be present from the main portal.

IMAGE - MAIN PORTAL 

### Drilling portal
#### Drill Programs
IMAGE - DRILLING PORTAL

On entering the drilling portal, a blank page will be encountered due to no drill programs yet added. Programs can be added using the 'Add button' and populating the 
subsequent form. 

IMAGE - ADD DRILL PROGRAM FORM

Be aware that fields have character length constraints as outlined below and in drilltekBackend/api/models.py

```Python
    programid = models.CharField(primary_key=True,max_length=30)
    orebody = models.CharField(max_length=10)
    location = models.CharField(max_length=10)
    target = models.CharField(max_length=10)
```
Drill programs can be opened to view details and edit by selecting open on the desired program

#### Drill Program Details

IMAGE - DRILL PROGRAM DETAILS

Upon opening desired drill program , users have the option to manipulate the existing program or add drillholes. 

Selecting 'Edit' Will present the user with a prepopulated form containing the current details. These can be edited and resubmitted. 

IMAGE - EDIT DRILL PROGRAM FORM

Selecting 'Delete' Will prompt the user to make sure they want to delete the program. **Please be aware that by deleting a program this will cascade and delete
associated drillholes and also any logs associated with said holes**. 

IMAGE - DELETE DRILL PROGRAM

Drillholes can be uploaded to a program in two ways: 

Individually, by selecting 'add':

IMAGE - ADD DRILLHOLE

Or in bulk by selecting upload:

IMAGE - UPLOAD DRILLHOLES

Uploading file format is .csv and it is advised that users first download and populate the template provided




