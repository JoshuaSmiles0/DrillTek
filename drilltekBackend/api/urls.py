from django.urls import include, path
from .views import DrillholeViewSet, UserViewSet, DrillProgramViewSet, ProtectedUserViewset
from rest_framework_simplejwt.views import TokenRefreshView

#URL for newly created userlist endpoint
urlpatterns = [
    path('user/checkUser', UserViewSet.as_view({'post':'checkUser'}), name='checkUser'),
    path('user/setPassword', UserViewSet.as_view({'patch':'setPassword'}), name='setPassword'),
    path('user/login', UserViewSet.as_view({'post':'login'}), name='login'),
    # Path for refreshing token using built in JWT tokenrefreshview. Takes a refresh token, returns a new access token
    path('token/refresh', TokenRefreshView.as_view(), name='token_refresh' ),
    path('drillProgram/getPrograms', DrillProgramViewSet.as_view({'get': 'getPrograms'}), name='getPrograms'),
    path('drillProgram/createProgram', DrillProgramViewSet.as_view({'post': 'createProgram'}), name='createProgram'),
    path('drillProgram/getProgramById', DrillProgramViewSet.as_view({'get':'getProgramById'}), name='getProgramById'),
    path('drillProgram/editProgram', DrillProgramViewSet.as_view({'patch': 'editProgram'}), name='editProgram'),
    path('drillhole/addDrillhole', DrillholeViewSet.as_view({'post': 'addDrillhole'}), name='addDrillHole'),
    path('drillhole/getDrillholesByProgramId', DrillholeViewSet.as_view({'get':'getDrillholesByProgramId'}), name='getDrillholesByProgramId'),
    path('drillhole/getDrillholeById', DrillholeViewSet.as_view({'get':'getDrillholeById'}), name='getDrillholeById'),
    path('drillhole/editDrillhole',DrillholeViewSet.as_view({'patch':'editDrillhole'}),name='editDrillhole'),
    path('user/getEmail', ProtectedUserViewset.as_view({'get':'getUserEmailById'}), name='getUserEmailById')
]