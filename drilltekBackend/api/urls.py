from django.urls import include, path
from .views import UserList

urlpatterns = [
    path('list/', UserList.as_view(), name='list-customer')
]