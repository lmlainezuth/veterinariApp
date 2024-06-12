from django.shortcuts import render, redirect, get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from .models import Paciente
from .forms import PacienteForm
from django.http import JsonResponse, HttpResponseNotAllowed
import json

def home(request):
    pacientes = Paciente.objects.all()
    return render(request, 'pacientes/home.html', {'pacientes': pacientes})

def lista_pacientes(request):
    pacientes = Paciente.objects.all()
    return render(request, 'pacientes/lista_pacientes.html', {'pacientes': pacientes})

def crear_paciente(request):
    if request.method == 'POST':
        form = PacienteForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('crear_paciente')
        else:
            pacientes = Paciente.objects.all()
            return render(request, 'pacientes/paciente.html', {'form': form, 'pacientes': pacientes})
    else:
        form = PacienteForm()
        pacientes = Paciente.objects.all()
    return render(request, 'pacientes/paciente.html', {'form': form, 'pacientes': pacientes})

def editar_paciente(request, id):
    paciente = get_object_or_404(Paciente, id=id)
    if request.method == 'POST':
        form = PacienteForm(request.POST, instance=paciente)
        if form.is_valid():
            form.save()
            return redirect('crear_paciente')
    else:
        form = PacienteForm(instance=paciente)
    pacientes = Paciente.objects.all()
    return render(request, 'pacientes/paciente.html', {'form': form, 'pacientes': pacientes, 'editando': True, 'paciente_id': id})
@csrf_exempt
def obtener_citas(request):
    if request.method == 'GET':
        pacientes = Paciente.objects.all()
        pacientes_lista = list(pacientes.values('id', 'nombre', 'propietario', 'correo', 'fecha_alta', 'fecha_registro', 'sintomas'))
        return JsonResponse(pacientes_lista, safe=False)
    
    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            nuevo_paciente = Paciente(
                nombre=data['nombre'],
                propietario=data['propietario'],
                correo=data['correo'],
                fecha_registro=data['fecha_registro'],
                sintomas=data['sintomas']
            )
            nuevo_paciente.save()
            return JsonResponse({'mensaje': 'Paciente registrado correctamente'}, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    else:
        return HttpResponseNotAllowed(['GET', 'POST'])

@csrf_exempt
def actualizar_cita(request, id):
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            paciente = get_object_or_404(Paciente, id=id)
            paciente.nombre = data['nombre']
            paciente.propietario = data['propietario']
            paciente.correo = data['correo']
            paciente.fecha_registro = data['fecha_registro']
            paciente.sintomas = data['sintomas']
            paciente.save()
            return JsonResponse({'mensaje': 'Paciente actualizado correctamente'}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return HttpResponseNotAllowed(['PUT'])

@csrf_exempt
def eliminar_cita(request, id):
    if request.method == 'DELETE':
        try:
            paciente = get_object_or_404(Paciente, id=id)
            paciente.delete()
            return JsonResponse({'mensaje': 'Paciente eliminado correctamente'}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return HttpResponseNotAllowed(['DELETE'])