document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.querySelector('#formulario-cita');
    const formularioInput = document.querySelector('#formularioInput');
    const idInput = document.querySelector('input[name="id"]');
    const pacienteInput = document.querySelector('#paciente');
    const propietarioInput = document.querySelector('#propietario');
    const emailInput = document.querySelector('#email');
    const fechaInput = document.querySelector('#fecha');
    const sintomasInput = document.querySelector('#sintomas');

    let editando = false;

    let citas = {
        citas: [],
        eliminar: function(id) {
            this.citas = this.citas.filter(cita => cita.id !== id);
            mostrarCitas();
        }
    };

    async function obtenerCitas() {
        try {
            const respuesta = await fetch('/api/citas/');
            if (!respuesta.ok) {
                throw new Error(`HTTP error! status: ${respuesta.status}`);
            }
            const data = await respuesta.json();
            console.log(data);  // Verifica los datos recibidos aquí
            citas.citas = data;
            mostrarCitas();
        } catch (error) {
            console.error('Error obteniendo citas:', error);
            alert(`Error obteniendo citas: ${error.message}`);
        }
    }

    function mostrarCitas() {
        const contenedorCitas = document.querySelector('#citas ul');
        if (!contenedorCitas) {
            console.error('Contenedor de citas no encontrado');
            return;
        }
        contenedorCitas.innerHTML = '';

        citas.citas.forEach(cita => {
            const citaHTML = document.createElement('li');
            citaHTML.classList.add('mb-5', 'p-5', 'bg-white', 'shadow-md', 'rounded-lg');
            citaHTML.dataset.id = cita.id;

            // Verificar las fechas antes de formatearlas
            console.log(cita.fecha_alta, cita.fecha_registro);

            // Formateo de la fecha
            const opcionesFecha = { year: 'numeric', month: '2-digit', day: '2-digit' };
            const fechaAltaFormateada = new Date(cita.fecha_alta).toLocaleDateString('es-ES', opcionesFecha);
            const fechaRegistroFormateada = new Date(cita.fecha_registro).toLocaleDateString('es-ES', opcionesFecha);

            citaHTML.innerHTML = `
                <p class="font-bold">Nombre: <span class="font-normal">${cita.nombre}</span></p>
                <p class="font-bold">Propietario: <span class="font-normal">${cita.propietario}</span></p>
                <p class="font-bold">Email: <span class="font-normal">${cita.correo}</span></p>
                <p class="font-bold">Fecha de Alta: <span class="font-normal">${fechaAltaFormateada}</span></p>
                <p class="font-bold">Fecha de Registro: <span class="font-normal">${fechaRegistroFormateada}</span></p>
                <p class="font-bold">Síntomas: <span class="font-normal">${cita.sintomas}</span></p>
                <div class="flex justify-between mt-5">
                    <button class="py-2 px-10 bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase rounded-lg flex items-center gap-2 btn-editar">Editar</button>
                    <button class="py-2 px-10 bg-red-600 hover:bg-red-700 text-white font-bold uppercase rounded-lg flex items-center gap-2 btn-eliminar">Eliminar</button>
                </div>
            `;
            contenedorCitas.appendChild(citaHTML);

            citaHTML.querySelector('.btn-editar').addEventListener('click', () => editarCita(cita));
            citaHTML.querySelector('.btn-eliminar').addEventListener('click', () => eliminarCita(cita.id));
        });
    }

    formulario.addEventListener('submit', async function(e) {
        e.preventDefault();

        const citaId = idInput.value;
        const nuevaCita = {
            nombre: pacienteInput.value,
            propietario: propietarioInput.value,
            correo: emailInput.value,
            fecha_registro: new Date(fechaInput.value).toISOString().split('T')[0], // Formateo a yyyy-MM-dd
            sintomas: sintomasInput.value
        };

        try {
            const url = citaId ? `/api/citas/${citaId}/` : '/api/citas/';
            const method = citaId ? 'PUT' : 'POST';

            const respuesta = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify(nuevaCita)
            });

            if (!respuesta.ok) {
                throw new Error(`HTTP error! status: ${respuesta.status}`);
            }

            const data = await respuesta.json();
            console.log('Cita guardada:', data);

            // Actualizar la lista de citas sin necesidad de recargar la página
            obtenerCitas();
          
        } catch (error) {
            console.error('Error guardando cita:', error);
            alert(`Error guardando cita: ${error.message}`);
        }

        formulario.reset();
        reiniciarObjetoCita();
        formularioInput.value = 'Registrar Paciente';
        editando = false;
    });

    function editarCita(cita) {
        idInput.value = cita.id;
        pacienteInput.value = cita.nombre;
        propietarioInput.value = cita.propietario;
        emailInput.value = cita.correo;
        fechaInput.value = new Date(cita.fecha_registro).toISOString().split('T')[0]; // Formateo a yyyy-MM-dd
        sintomasInput.value = cita.sintomas;

        editando = true;
        formularioInput.value = 'Guardar Cambios';
    }

    async function eliminarCita(id) {
        try {
            const respuesta = await fetch(`/api/citas/eliminar/${id}/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                }
            });

            if (!respuesta.ok) {
                throw new Error(`HTTP error! status: ${respuesta.status}`);
            }

            const data = await respuesta.json();
            console.log('Cita eliminada:', data);
            citas.eliminar(id);
          
        } catch (error) {
            console.error('Error eliminando cita:', error);
            alert(`Error eliminando cita: ${error.message}`);
        }
    }

    function reiniciarObjetoCita() {
        idInput.value = '';
        pacienteInput.value = '';
        propietarioInput.value = '';
        emailInput.value = '';
        fechaInput.value = '';
        sintomasInput.value = '';
    }

    obtenerCitas();
});

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
