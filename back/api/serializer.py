from django.contrib.auth.models import User
from rest_framework import serializers
from .models import *

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user
    
#Sensor
class SensorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sensor
        fields = '__all__'

#Ambiente
class AmbienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ambiente
        fields = '__all__'

#Histórico
class HistoricoSerializer(serializers.ModelSerializer):
   class Meta:
       model = Historico
       fields = '__all__'
       
        

#    sensor = SensorSerializer(read_only = True)
#    sensor_id = serializers.PrimaryKeyRelatedField(
#        queryset = Sensor.objects.all(), source='sensor', write_only = True
#    )
#    ambiente = AmbienteSerializer(read_only = True)
#    ambiente_id = serializers.PrimaryKeyRelatedField(
#        queryset = Ambiente.objects.all(), source = 'ambiente', write_only = True
#    )
# fields = ['sensor', 'sensor_id', 'ambiente', 'ambiente_id', 'observacoes']
