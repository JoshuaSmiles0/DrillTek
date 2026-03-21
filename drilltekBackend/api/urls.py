from django.urls import include, path
from .views import DrillholeViewSet, LithLogViewset, TestEndpointViewset, UserViewSet, DrillProgramViewSet, ProtectedUserViewset, AlterationLogViewset, MineralLogViewset, StructureLogViewset
from rest_framework_simplejwt.views import TokenRefreshView

#URL for newly created userlist endpoint
urlpatterns = [
    path('user/checkUser', UserViewSet.as_view({'post':'checkUser'}), name='checkUser'),
    path('user/setPassword', UserViewSet.as_view({'patch':'setPassword'}), name='setPassword'),
    path('user/login', UserViewSet.as_view({'post':'login'}), name='login'),
    # Path for refreshing token using built in JWT tokenrefreshview. Takes a refresh token, returns a new access token
    path('token/refresh', TokenRefreshView.as_view(), name='token_refresh' ),
    path('user/testEndpoint', TestEndpointViewset.as_view({'get':'testEndpoint'}), name="testEndpoint"),
    path('user/logout', ProtectedUserViewset.as_view({'post':'logout'}), name='logout'),
    path('drillProgram/getPrograms', DrillProgramViewSet.as_view({'get': 'getPrograms'}), name='getPrograms'),
    path('drillProgram/createProgram', DrillProgramViewSet.as_view({'post': 'createProgram'}), name='createProgram'),
    path('drillProgram/getProgramById', DrillProgramViewSet.as_view({'get':'getProgramById'}), name='getProgramById'),
    path('drillProgram/editProgram', DrillProgramViewSet.as_view({'patch': 'editProgram'}), name='editProgram'),
    path('drillhole/addDrillhole', DrillholeViewSet.as_view({'post': 'addDrillhole'}), name='addDrillHole'),
    path('drillhole/addMultipleDrillholes', DrillholeViewSet.as_view({'post':'addMultipleDrillholes'}), name='addMultipleDrillholes'),
    path('drillhole/getDrillholesByProgramId', DrillholeViewSet.as_view({'get':'getDrillholesByProgramId'}), name='getDrillholesByProgramId'),
    path('drillhole/getDrillholeById', DrillholeViewSet.as_view({'get':'getDrillholeById'}), name='getDrillholeById'),
    path('drillhole/editDrillhole',DrillholeViewSet.as_view({'patch':'editDrillhole'}),name='editDrillhole'),
    path('user/getEmail', ProtectedUserViewset.as_view({'get':'getUserEmailById'}), name='getUserEmailById'),
    path('lithlog/getlithlogbyholeid', LithLogViewset.as_view({'get':'getLithlogByHoleid'}), name='getLithlogByHoleid'),
    path('lithlog/addLithLog', LithLogViewset.as_view({'post':'addLithLog'}), name='addLithLog'),
    path('lithlog/deleteLithLog', LithLogViewset.as_view({'delete':'deleteLithLog'}), name='deleteLithLog'),
    path('altlog/getAlterationlogByHoleid', AlterationLogViewset.as_view({'get':'getAlterationlogByHoleid'}), name='getAlterationlogByHoleid'),
    path('altlog/addAlterationLog', AlterationLogViewset.as_view({'post':'addAlterationLog'}), name='addAlterationLog'),
    path('altlog/deleteAlterationLog', AlterationLogViewset.as_view({'delete':'deleteAlterationLog'}), name='deleteAlterationLog'),
    path('struclog/getStructurelogByHoleid', StructureLogViewset.as_view({'get':'getStructurelogByHoleid'}), name='getStructurelogByHoleid'),
    path('struclog/addStructureLog', StructureLogViewset.as_view({'post':'addStructureLog'}), name='addStructureLog'),
    path('struclog/deleteStructureLog', StructureLogViewset.as_view({'delete':'deleteStructureLog'}), name='deleteStructureLog'),
    path('minlog/getMinerallogByHoleid', MineralLogViewset.as_view({'get':'getMinerallogByHoleid'}), name='getMinerallogByHoleid'),
    path('minlog/addMineralLog', MineralLogViewset.as_view({'post':'addMineralLog'}), name='addMineralLog'),
    path('minlog/deleteMineralLog', MineralLogViewset.as_view({'delete':'deleteMineralLog'}), name='deleteMineralLog'),
]