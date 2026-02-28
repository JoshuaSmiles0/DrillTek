from django.urls import include, path
from .views import UserViewSet, DrillProgramViewSet

#URL for newly created userlist endpoint
urlpatterns = [
    path('user/checkUser', UserViewSet.as_view({'post':'checkUser'}), name='checkUser'),
    path('user/setPassword', UserViewSet.as_view({'patch':'setPassword'}), name='setPassword'),
    path('user/login', UserViewSet.as_view({'post':'login'}), name='login'),
    path('drillProgram/getPrograms', DrillProgramViewSet.as_view({'get': 'getPrograms'}), name='getPrograms'),
]