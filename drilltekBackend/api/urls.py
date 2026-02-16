from django.urls import include, path
from .views import UserViewSet

#URL for newly created userlist endpoint
urlpatterns = [
    path('user/checkUser', UserViewSet.as_view({'post':'checkUser'}), name='checkUser'),
    path('user/setPassword', UserViewSet.as_view({'patch':'setPassword'}), name='setPassword')
]