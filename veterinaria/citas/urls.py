from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('pacientes/', views.lista_pacientes, name='lista_pacientes'),
    path('paciente/nuevo/', views.crear_paciente, name='crear_paciente'),
    path('paciente/editar/<int:id>/', views.editar_paciente, name='editar_paciente'),
    path('api/citas/', views.obtener_citas, name='obtener_citas'),  # Nueva ruta para obtener citas en formato JSON
    path('api/citas/<int:id>/', views.actualizar_cita, name='actualizar_cita'),  # Nueva ruta para actualizar cita
    path('api/citas/eliminar/<int:id>/', views.eliminar_cita, name='eliminar_cita'),  # Nueva ruta para eliminar cita


]
