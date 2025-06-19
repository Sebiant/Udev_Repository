$(document).ready(function () {
    var tabla = $('#tablaClases').DataTable({
        "paging": false,
        "searching": false,
        "info": false,
        "ajax": "Cuentas-Docentes-Controlador.php?accion=listarClases",
        "columns": [
            { "data": "fecha" },
            { "data": "hora" },
            { "data": "nombre" },
            { "data": "nombre_salon" },
            {
                data: "estado",
                render: function (data, type, row) {
                    if (data === 'Perdida') {
                        return `<button class="btn btn-danger w-100 reprogramar-btn" data-bs-toggle="modal" data-bs-target="#modalReprogramar" data-id="${row.id_programador}">Reagendar</button>`;
                    } else if (data === 'Agendada') {
                        return `<button class="btn btn-secondary w-100" disabled>${data}</button>`;
                    } else if (data === 'Reagendada') {
                        return `<button class="btn btn-warning text-white w-100" disabled>${data}</button>`;
                    } else if (data === 'Vista') {
                        return `<button class="btn btn-info w-100" disabled>${data}</button>`;
                    } else {
                        return `<span class="badge bg-light text-dark w-100">${data}</span>`;  // para otros estados desconocidos
                    }
                    
                }
            },
            
        ],
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/1.13.6/i18n/Spanish.json"
        },
        "order": [],
        "responsive": true
    });

    $('#tablaClases').on('click', '.reprogramar-btn', function () {
        var data = tabla.row($(this).closest('tr')).data(); // Obtener datos de la fila
        
        if (data) {
            $('#id_programador').val(data.id_programador);
            $('#id_salon').val(data.id_salon);
            $('#numero_documento').val(data.numero_documento);
            $('#id_modulo').val(data.id_modulo);
            $('#id_periodo').val(data.id_periodo);
            $('#modalidad').val(data.modalidad);

        } else {
            console.error("No se pudieron obtener los datos de la fila.");
        }
    });
   
    var table = $('#datos_CuentaCobroDocente').DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: "Cuentas-Docentes-Controlador.php",
            type: "POST",
            dataSrc: 'data'
        },
        columns: [
            { "data": "fecha" },
            { "data": null,
                "render": function(data, type, row) {
                    return row.nombres + ' ' + row.apellidos;
                }   
            },
            { "data": "valor_hora" },
            { "data": "horas_trabajadas" },
            { "data": "monto" },
            {
                data: "estado",
                render: function (data, type, row) {
                    
                    if (data === 'Aceptada por el docente') {
                        return `<button class="btn btn-success w-100 text-white" disabled>Aceptada por docente</button>`;
                    } else if (data === 'Pendiente de firma') {
                        return `<button class="btn btn-warning text-white w-100" disabled>Pendiente de firma</button>`;
                    } else if (data === 'En proceso de pago') {
                        return `<button class="btn btn-info w-100 text-white" disabled>En proceso de pago</button>`;
                    } else if (data === 'Pagada') {
                        return `<button class="btn btn-success w-100 text-white" disabled>Pagada</button>`;
                    } else if (data === 'Rechazada por el docente') {
                        return `<button class="btn btn-danger w-100 text-white" disabled>Rechazada por docente</button>`;
                    } else if (data === 'Rechazada por la institucion') {
                        return `<button class="btn btn-danger w-100 text-white" disabled>Rechazada por institución</button>`;
                    } else {
                        return `<span>${data}</span>`;
                    }
                }
            }, 
        ]
    });
});

function reprogramarClase() {
    const formData = new FormData(document.getElementById('formReprogramar'));
    console.log(...formData);

    $.ajax({
        url: "Cuentas-Docentes-Controlador.php?accion=reprogramar",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function(response) {
            console.log("Respuesta del servidor:", response);
            location.reload();
        },
        error: function(xhr, status, error) {
            console.error("Error:", error);
            alert("Hubo un problema al procesar la solicitud.");
        }
    });
}

function aceptarCuenta() {
    const formData = new FormData(document.getElementById('formCuentaCobro'));
    console.log(...formData);

    $.ajax({
        url: "Cuentas-Docentes-Controlador.php?accion=Aceptar",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function(response) {
            alert("Cuenta aceptada correctamente.");
            location.reload();
        },
        error: function(xhr, status, error) {
            console.error("Error:", error);
            alert("Hubo un problema al procesar la solicitud.");
        }
    });
}
function rechazarCuenta() {
    const formData = new FormData(document.getElementById('formCuentaCobro'));
    console.log(...formData);

    $.ajax({
        url: "Cuentas-Docentes-Controlador.php?accion=Rechazar",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function(response) {
            alert("Cuenta rechazada correctamente.");
            location.reload();
        },
        error: function(xhr, status, error) {
            console.error("Error:", error);
            alert("Hubo un problema al procesar la solicitud.");
        }
    });
}
