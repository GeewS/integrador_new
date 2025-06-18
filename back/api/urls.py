from django.urls import path
from .views import *
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    #Token
    path('signup/', SignUpView.as_view(), name='signup'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    #Sensores
    path('sensores', SensorView.as_view()),
    path('sensor/<int:pk>', SensoresDetailView.as_view()),
    path('upload-sensor/', UploadXLSXViewSensor.as_view(), name='upload-sensor'),
    path('exportar/sensores/', exportar_sensor_excel, name='exportar_sensor_excel'),

    #Ambientes
    path('ambientes', AmbienteView.as_view()),
    path('ambiente/<int:pk>', AmbientesDetailView.as_view()),
    path('upload-ambiente/', UploadXLSXViewAmbiente.as_view(), name='upload-ambiente'),
    path('exportar/ambientes/', exportar_ambiente_excel, name='exportar_ambiente_excel'),

    #Históricos
    path('historicos', HistoricoView.as_view()),
    path('historico/<int:pk>', HistoricosDetailView.as_view()),
    path('upload-historico/', UploadXLSXViewHistorico.as_view(), name='upload-historico'),
    path('exportar/historico/', exportar_historico_excel, name='exportar_historico_excel'),
]