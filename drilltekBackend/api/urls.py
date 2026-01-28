from django.urls import include, path
from .views import UserList

#URL for newly created userlist endpoint
urlpatterns = [
    path('list/', UserList.as_view(), name='list-customer')
]