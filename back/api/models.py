from django.db import models
from import_export import resources

class Sensor(models.Model):
    TIPO_SENSOR = [
        ('temperatura','temperatura'),
        ('luminosidade','luminosidade'),
        ('umidade','umidade'),
        ('contador','contador'),
    ]

    UNIDADE_MEDIDA = [
        ('°C','°C'),
        ('lux','lux'),
        ('%','%'),
        ('num','num')
    ]

    STATUS = [
        ('ativo','ativo'),
        ('inativo','inativo')
    ]

    sensor = models.CharField(max_length=255, choices=TIPO_SENSOR)
    mac_address = models.CharField(max_length=255)
    unidade_med = models.CharField(max_length=10, choices=UNIDADE_MEDIDA)
    latitude = models.FloatField()
    longitude = models.FloatField()
    status = models.CharField(max_length=50, choices=STATUS)

    def __str__(self):
        return self.sensor
    
class Ambiente(models.Model):
    sig = models.IntegerField()
    descricao = models.CharField(max_length=255)
    ni = models.CharField(max_length=255)
    responsavel = models.CharField(max_length=255)

    def __str__(self):
        return self.descricao
    
class Historico(models.Model):
    sensor = models.ForeignKey(Sensor, on_delete=models.CASCADE)
    ambiente = models.ForeignKey(Ambiente,on_delete=models.CASCADE)
    valor = models.FloatField()
    timestamp = models.DateTimeField()

