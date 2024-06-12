from django import forms
from .models import Paciente

class PacienteForm(forms.ModelForm):
    class Meta:
        model = Paciente
        fields = ['nombre', 'propietario', 'correo', 'fecha_registro', 'sintomas']
        widgets = {
            'fecha_registro': forms.DateInput(attrs={'type': 'date'}),
        }