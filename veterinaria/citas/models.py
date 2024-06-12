from django.db import models
import datetime

class Paciente(models.Model):
    nombre = models.CharField(max_length=100)
    propietario = models.CharField(max_length=100)
    correo = models.EmailField()
    fecha_alta = models.DateField(auto_now_add=True)
    fecha_registro = models.DateField(default=datetime.date.today)
    sintomas = models.TextField()

    def __str__(self):
        return self.nombre
