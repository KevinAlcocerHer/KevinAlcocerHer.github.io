// REEMPLAZAR TODO EL CONTENIDO DE agregar-actividad.js CON ESTE CÓDIGO

// Variables globales para el sistema de actividades
let modalAgregarActividad, seleccionTipoActividad, formMaterial, formListaRaya, formHerramienta;
let modoEdicion = false;
let tipoActividadEditando = null;
let tarjetaEditando = null;

document.addEventListener("DOMContentLoaded", function() {
    console.log("Inicializando sistema de actividades...");
    
    // Elementos DOM
    const btnAgregarActividad = document.getElementById("btnAgregarActividad");
    modalAgregarActividad = document.getElementById("modalAgregarActividad");
    seleccionTipoActividad = document.getElementById("seleccionTipoActividad");
    formMaterial = document.getElementById("formMaterial");
    formListaRaya = document.getElementById("formListaRaya");
    formHerramienta = document.getElementById("formHerramienta");
    const tiposActividad = document.querySelectorAll(".tipo-actividad");
    const cerrarSeleccionTipo = document.getElementById("cerrarSeleccionTipo");

    // Inicialización
    if (modalAgregarActividad) {
        modalAgregarActividad.style.display = "none";
    }

    // EVENT LISTENERS
    if (btnAgregarActividad) {
        btnAgregarActividad.addEventListener("click", () => {
            console.log("Abriendo modal para agregar actividad");
            modoEdicion = false;
            tipoActividadEditando = null;
            tarjetaEditando = null;
            abrirModalAgregarActividad();
        });
    }

    if (cerrarSeleccionTipo) {
        cerrarSeleccionTipo.addEventListener("click", cerrarModalAgregarActividad);
    }

    // Eventos para seleccionar tipo de actividad
    if (tiposActividad) {
        tiposActividad.forEach(tipo => {
            tipo.addEventListener("click", () => {
                const tipoActividad = tipo.getAttribute("data-tipo");
                console.log("Tipo de actividad seleccionado:", tipoActividad);
                seleccionarTipoActividad(tipoActividad);
            });
        });
    }

    // Eventos para cerrar formularios
    const cerrarFormMaterial = document.getElementById("cerrarFormMaterial");
    const cerrarFormListaRaya = document.getElementById("cerrarFormListaRaya");
    const cerrarFormHerramienta = document.getElementById("cerrarFormHerramienta");

    if (cerrarFormMaterial) {
        cerrarFormMaterial.addEventListener("click", cerrarModalAgregarActividad);
    }
    if (cerrarFormListaRaya) {
        cerrarFormListaRaya.addEventListener("click", cerrarModalAgregarActividad);
    }
    if (cerrarFormHerramienta) {
        cerrarFormHerramienta.addEventListener("click", cerrarModalAgregarActividad);
    }

    // Eventos para envío de formularios
    const formAgregarMaterial = document.getElementById("formAgregarMaterial");
    const formAgregarListaRaya = document.getElementById("formAgregarListaRaya");
    const formAgregarHerramienta = document.getElementById("formAgregarHerramienta");

    if (formAgregarMaterial) {
        formAgregarMaterial.addEventListener("submit", (e) => {
            e.preventDefault();
            console.log("Guardando actividad de material");
            guardarActividadMaterial();
        });
    }

    if (formAgregarListaRaya) {
        formAgregarListaRaya.addEventListener("submit", (e) => {
            e.preventDefault();
            console.log("Guardando actividad de lista raya");
            guardarActividadListaRaya();
        });
    }

    if (formAgregarHerramienta) {
        formAgregarHerramienta.addEventListener("submit", (e) => {
            e.preventDefault();
            console.log("Guardando actividad de herramienta");
            guardarActividadHerramienta();
        });
    }

    // Eventos para agregar items a listas
    configurarEventosListas();

    console.log("Sistema de actividades inicializado correctamente");
});

// EVENT LISTENER PARA BOTONES DE EDICIÓN (DELEGACIÓN DE EVENTOS)
document.addEventListener('click', function(e) {
    // Editar Material
    if (e.target.closest('.btn-editar-material-dinamico')) {
        e.preventDefault();
        e.stopPropagation();
        const tarjeta = e.target.closest('.actividad-tarjeta');
        editarActividadMaterial(tarjeta);
    }
    
    // Editar Lista Raya
    if (e.target.closest('.btn-editar-lista-dinamico')) {
        e.preventDefault();
        e.stopPropagation();
        const tarjeta = e.target.closest('.actividad-tarjeta');
        editarActividadListaRaya(tarjeta);
    }
    
    // Editar Herramienta
    if (e.target.closest('.btn-editar-herramienta-dinamico')) {
        e.preventDefault();
        e.stopPropagation();
        const tarjeta = e.target.closest('.actividad-tarjeta');
        editarActividadHerramienta(tarjeta);
    }
});

// FUNCIONES PRINCIPALES (AHORA GLOBALES)

function abrirModalAgregarActividad() {
    if (!window.obraActual) {
        alert("No se ha cargado correctamente la información de la obra");
        return;
    }

    if (window.obraActual.finalizada) {
        alert("No se pueden agregar actividades a una obra finalizada");
        return;
    }

    ocultarSeccionInformacion();
    ocultarTodosLosFormularios();
    restaurarTitulosOriginales();

    if (seleccionTipoActividad) seleccionTipoActividad.style.display = "block";

    if (modalAgregarActividad) {
        modalAgregarActividad.style.display = "flex";
        modalAgregarActividad.style.zIndex = "2000";
    }

    document.body.style.overflow = "hidden";
}

function abrirModalEdicion() {
    ocultarSeccionInformacion();
    ocultarTodosLosFormularios();
    
    if (modalAgregarActividad) {
        modalAgregarActividad.style.display = "flex";
        modalAgregarActividad.style.zIndex = "2000";
    }
    
    document.body.style.overflow = "hidden";
}

function cerrarModalAgregarActividad() {
    if (modalAgregarActividad) {
        modalAgregarActividad.style.display = "none";
    }

    const seccionInformacion = document.querySelector(".proyecto-informacion-container");
    if (seccionInformacion && seccionInformacion.dataset.displayState) {
        seccionInformacion.style.display = seccionInformacion.dataset.displayState;
        delete seccionInformacion.dataset.displayState;
    } else if (seccionInformacion) {
        seccionInformacion.style.display = "block";
    }

    document.body.style.overflow = "auto";
    limpiarFormularios();

    modoEdicion = false;
    tipoActividadEditando = null;
    tarjetaEditando = null;

    restaurarTitulosOriginales();
}

// AGREGAR ESTA NUEVA FUNCIÓN:
function configurarCalculoTrabajadores() {
    setTimeout(() => {
        const gastoTotalElement = document.getElementById("nuevoGastoTrabajadores");
        if (gastoTotalElement) {
            // Hacer el campo de gasto total readonly
            gastoTotalElement.readOnly = true;
            gastoTotalElement.style.backgroundColor = '#f8f9fa';
            gastoTotalElement.style.fontWeight = 'bold';
            gastoTotalElement.placeholder = 'Se calculará automáticamente';
        }
        console.log("Cálculo automático de trabajadores configurado");
    }, 100);
}

function seleccionarTipoActividad(tipo) {
    ocultarTodosLosFormularios();

    switch (tipo) {
        case "material":
            if (formMaterial) {
                formMaterial.style.display = "block";
                configurarCalculoMaterial();
            }
            break;
        case "listaRaya":
    if (formListaRaya) {
        formListaRaya.style.display = "block";
        const listaTrabajadores = document.getElementById("nuevoListaTrabajadores");
        if (listaTrabajadores && listaTrabajadores.children.length === 0) {
            agregarEmpleadoDetallado();
        }
        // AGREGAR ESTA LÍNEA:
        configurarCalculoTrabajadores();
    }
    break;
        case "herramienta":
            if (formHerramienta) {
                formHerramienta.style.display = "block";
                const listaHerramientas = document.getElementById("nuevoListaHerramientas");
                if (listaHerramientas && listaHerramientas.children.length === 0) {
                    agregarItemLista("nuevoListaHerramientas", "Nombre de la herramienta");
                }
            }
            break;
    }
}

// FUNCIONES DE EDICIÓN DE ACTIVIDADES

function editarActividadMaterial(tarjeta) {
    console.log("Editando actividad de material");
    
    const datos = extraerDatosMaterial(tarjeta);
    if (!datos) {
        alert("Error al obtener los datos de la actividad");
        return;
    }
    
    // Configurar modo edición
    modoEdicion = true;
    tipoActividadEditando = "material";
    tarjetaEditando = tarjeta;
    
    // Abrir modal y llenar formulario
    abrirModalEdicion();
    seleccionarTipoActividad("material");
    llenarFormularioMaterial(datos);
    
    // Cambiar título y botón
    const titulo = document.querySelector("#formMaterial h3");
    const boton = document.querySelector("#formMaterial button[type='submit']");
    if (titulo) titulo.textContent = "Editar: Entrada de Material";
    if (boton) boton.textContent = "Actualizar Actividad";
}

function editarActividadListaRaya(tarjeta) {
    console.log("Editando actividad de lista raya");
    
    const datos = extraerDatosListaRaya(tarjeta);
    if (!datos) {
        alert("Error al obtener los datos de la actividad");
        return;
    }
    
    modoEdicion = true;
    tipoActividadEditando = "listaRaya";
    tarjetaEditando = tarjeta;
    
    abrirModalEdicion();
    seleccionarTipoActividad("listaRaya");
    llenarFormularioListaRaya(datos);
    
    const titulo = document.querySelector("#formListaRaya h3");
    const boton = document.querySelector("#formListaRaya button[type='submit']");
    if (titulo) titulo.textContent = "Editar: Lista Raya";
    if (boton) boton.textContent = "Actualizar Actividad";
}

function editarActividadHerramienta(tarjeta) {
    console.log("Editando actividad de herramienta");
    
    const datos = extraerDatosHerramienta(tarjeta);
    if (!datos) {
        alert("Error al obtener los datos de la actividad");
        return;
    }
    
    modoEdicion = true;
    tipoActividadEditando = "herramienta";
    tarjetaEditando = tarjeta;
    
    abrirModalEdicion();
    seleccionarTipoActividad("herramienta");
    llenarFormularioHerramienta(datos);
    
    const titulo = document.querySelector("#formHerramienta h3");
    const boton = document.querySelector("#formHerramienta button[type='submit']");
    if (titulo) titulo.textContent = "Editar: Entrada Herramienta";
    if (boton) boton.textContent = "Actualizar Actividad";
}

// FUNCIONES DE EXTRACCIÓN DE DATOS
function extraerDatosMaterial(tarjeta) {
    try {
        const textos = tarjeta.querySelectorAll('p');
        const datos = {};
        
        textos.forEach(p => {
            const texto = p.textContent.trim();
            if (texto.includes('Fecha de entrada:')) {
                datos.fecha = texto.split(':')[1].trim();
                const fechaParts = datos.fecha.split('/');
                if (fechaParts.length === 3) {
                    datos.fecha = `${fechaParts[2]}-${fechaParts[1].padStart(2, '0')}-${fechaParts[0].padStart(2, '0')}`;
                }
            } else if (texto.includes('Cantidad:')) {
                datos.cantidad = parseFloat(texto.split(':')[1].trim()) || 0;
            } else if (texto.includes('Precio Actual:')) {
                datos.precioActual = parseFloat(texto.split(':')[1].trim()) || 0;
            } else if (texto.includes('Recibió:')) {
                datos.responsableRecibe = texto.split(':')[1].trim();
            } else if (texto.includes('Tipo de material:')) {
                datos.tipoMaterial = texto.split(':')[1].trim();
            } else if (texto.includes('Responsable Entrega:')) {
                datos.responsableEntrega = texto.split(':')[1].trim();
            } else if (texto.includes('Obra:')) {
                datos.obra = texto.split(':')[1].trim();
            } else if (texto.includes('Semana de obra:')) {
                datos.semanaObra = parseInt(texto.split(':')[1].trim()) || 0;
            } else if (texto.includes('Gasto Total:')) {
                datos.gasto = parseFloat(texto.split(':')[1].trim()) || 0;
            }
        });
        
        return datos;
    } catch (error) {
        console.error("Error extrayendo datos de material:", error);
        return null;
    }
}

function extraerDatosListaRaya(tarjeta) {
    try {
        const datos = {};
        const textos = tarjeta.querySelectorAll('.actividad-izquierda p');
        
        textos.forEach(p => {
            const texto = p.textContent.trim();
            if (texto.includes('Fecha de corte:')) {
                datos.fecha = texto.split(':')[1].trim();
                const fechaParts = datos.fecha.split('/');
                if (fechaParts.length === 3) {
                    datos.fecha = `${fechaParts[2]}-${fechaParts[1].padStart(2, '0')}-${fechaParts[0].padStart(2, '0')}`;
                }
            } else if (texto.includes('Obra:')) {
                datos.obra = texto.split(':')[1].trim();
            } else if (texto.includes('Responsable pagar:')) {
                datos.responsablePagar = texto.split(':')[1].trim();
            } else if (texto.includes('Gasto Total:')) {
                datos.gasto = parseFloat(texto.split(':')[1].trim()) || 0;
            }
        });
        
        // Extraer empleados
        datos.empleados = [];
        const empleadosLi = tarjeta.querySelectorAll('.actividad-derecha ul li');
        empleadosLi.forEach(li => {
            const texto = li.innerHTML;
            const nombreMatch = texto.match(/<strong>(.*?)<\/strong>/);
            const nombre = nombreMatch ? nombreMatch[1] : '';
            
            const smallText = li.querySelector('small')?.textContent || '';
            const salarioMatch = smallText.match(/Salario:\s*([\d.]+)/);
            const diasMatch = smallText.match(/Días:\s*(\d+)/);
            const reciboMatch = smallText.match(/Recibo:\s*(\w+)/);
            const statusMatch = smallText.match(/Status:\s*(\w+)/);
            
            if (nombre) {
                datos.empleados.push({
                    nombre: nombre,
                    salario: parseFloat(salarioMatch ? salarioMatch[1] : 0),
                    diasTrabajados: parseInt(diasMatch ? diasMatch[1] : 0),
                    reciboSemanal: reciboMatch ? reciboMatch[1] : '',
                    status: statusMatch ? statusMatch[1] : ''
                });
            }
        });
        
        return datos;
    } catch (error) {
        console.error("Error extrayendo datos de lista raya:", error);
        return null;
    }
}

function extraerDatosHerramienta(tarjeta) {
    try {
        const datos = {};
        const textos = tarjeta.querySelectorAll('.actividad-izquierda p');
        
        textos.forEach(p => {
            const texto = p.textContent.trim();
            if (texto.includes('Fecha de entrega:')) {
                datos.fecha = texto.split(':')[1].trim();
                const fechaParts = datos.fecha.split('/');
                if (fechaParts.length === 3) {
                    datos.fecha = `${fechaParts[2]}-${fechaParts[1].padStart(2, '0')}-${fechaParts[0].padStart(2, '0')}`;
                }
            } else if (texto.includes('Cantidad:')) {
                datos.cantidad = parseInt(texto.split(':')[1].trim()) || 0;
            } else if (texto.includes('Responsable Entrega:')) {
                datos.responsableEntrega = texto.split(':')[1].trim();
            } else if (texto.includes('Responsable Recibe:')) {
                datos.responsableRecibe = texto.split(':')[1].trim();
            } else if (texto.includes('Semana de obra:')) {
                datos.semanaObra = parseInt(texto.split(':')[1].trim()) || 0;
            } else if (texto.includes('Obra saliente:')) {
                datos.obraSaliente = texto.split(':')[1].trim();
            } else if (texto.includes('Obra entrante:')) {
                datos.obraEntrante = texto.split(':')[1].trim();
            } else if (texto.includes('Gasto:')) {
                datos.gasto = parseFloat(texto.split(':')[1].trim()) || 0;
            }
        });
        
        // Extraer herramientas
        datos.herramientas = [];
        const herramientasLi = tarjeta.querySelectorAll('.actividad-derecha ul li');
        herramientasLi.forEach(li => {
            const herramienta = li.textContent.trim();
            if (herramienta) {
                datos.herramientas.push(herramienta);
            }
        });
        
        return datos;
    } catch (error) {
        console.error("Error extrayendo datos de herramienta:", error);
        return null;
    }
}

// FUNCIONES DE LLENADO DE FORMULARIOS
function llenarFormularioMaterial(datos) {
    document.getElementById("nuevoFechaEntrada").value = datos.fecha || '';
    document.getElementById("nuevoCantidad").value = datos.cantidad || '';
    document.getElementById("nuevoPrecioActual").value = datos.precioActual || '';
    document.getElementById("nuevoResponsableRecibe").value = datos.responsableRecibe || '';
    document.getElementById("nuevoTipoMaterial").value = datos.tipoMaterial || '';
    document.getElementById("nuevoResponsableEntrega").value = datos.responsableEntrega || '';
    document.getElementById("nuevoObraMaterial").value = datos.obra || '';
    document.getElementById("nuevoSemanaObraMaterial").value = datos.semanaObra || '';
    document.getElementById("nuevoGastoMaterial").value = datos.gasto || '';
    
    // Reconfigurar el cálculo automático
    setTimeout(() => {
        configurarCalculoMaterial();
    }, 100);
}

function llenarFormularioListaRaya(datos) {
    document.getElementById("nuevoFechaCorte").value = datos.fecha || '';
    document.getElementById("nuevoObraListaRaya").value = datos.obra || '';
    document.getElementById("nuevoResponsablePagar").value = datos.responsablePagar || '';
    document.getElementById("nuevoGastoTrabajadores").value = datos.gasto || '';
    
    // Limpiar y llenar empleados
    const listaEmpleados = document.getElementById("nuevoListaTrabajadores");
    listaEmpleados.innerHTML = '';
    
    if (datos.empleados && datos.empleados.length > 0) {
        datos.empleados.forEach(empleado => {
            agregarEmpleadoDetallado();
            const ultimoEmpleado = listaEmpleados.lastElementChild;
            if (ultimoEmpleado) {
                ultimoEmpleado.querySelector('.empleado-nombre').value = empleado.nombre || '';
                ultimoEmpleado.querySelector('.empleado-salario').value = empleado.salario || '';
                ultimoEmpleado.querySelector('.empleado-dias').value = empleado.diasTrabajados || '';
                ultimoEmpleado.querySelector('.empleado-recibo').value = empleado.reciboSemanal || '';
                ultimoEmpleado.querySelector('.empleado-status').value = empleado.status || '';
                
                // Calcular total individual
                const total = (empleado.salario || 0) * (empleado.diasTrabajados || 0);
                ultimoEmpleado.querySelector('.empleado-total').value = total.toFixed(2);
            }
        });
        
        // Recalcular total después de llenar todos los empleados
        setTimeout(calcularGastoTotalTrabajadores, 100);
    } else {
        agregarEmpleadoDetallado();
    }
    
    // Configurar cálculo automático
    setTimeout(configurarCalculoTrabajadores, 200);
}

function llenarFormularioHerramienta(datos) {
    document.getElementById("nuevoFechaEntrega").value = datos.fecha || '';
    document.getElementById("nuevoCantidadHerramientas").value = datos.cantidad || '';
    document.getElementById("nuevoResponsableEntrega").value = datos.responsableEntrega || '';
    document.getElementById("nuevoResponsableRecibe").value = datos.responsableRecibe || '';
    document.getElementById("nuevoSemanaObra").value = datos.semanaObra || '';
    document.getElementById("nuevoObraSaliente").value = datos.obraSaliente || '';
    document.getElementById("nuevoObraEntrante").value = datos.obraEntrante || '';
    document.getElementById("nuevoGastoHerramientas").value = datos.gasto || '';
    
    // Limpiar y llenar herramientas
    const listaHerramientas = document.getElementById("nuevoListaHerramientas");
    listaHerramientas.innerHTML = '';
    
    if (datos.herramientas && datos.herramientas.length > 0) {
        datos.herramientas.forEach(herramienta => {
            agregarItemLista("nuevoListaHerramientas", "Nombre de la herramienta");
            const ultimaHerramienta = listaHerramientas.lastElementChild;
            if (ultimaHerramienta) {
                ultimaHerramienta.querySelector('input').value = herramienta;
            }
        });
    } else {
        agregarItemLista("nuevoListaHerramientas", "Nombre de la herramienta");
    }
}

function configurarCalculoMaterial() {
    setTimeout(() => {
        const cantidadInput = document.getElementById("nuevoCantidad");
        const precioInput = document.getElementById("nuevoPrecioActual");

        if (cantidadInput && precioInput) {
            // Remover listeners anteriores
            cantidadInput.removeEventListener("input", calcularGastoTotalMaterial);
            precioInput.removeEventListener("input", calcularGastoTotalMaterial);
            
            // Agregar nuevos listeners
            cantidadInput.addEventListener("input", calcularGastoTotalMaterial);
            precioInput.addEventListener("input", calcularGastoTotalMaterial);
            
            console.log("Eventos de cálculo configurados correctamente");
        }
    }, 100);
}

function calcularGastoTotalMaterial() {
    const cantidadElement = document.getElementById("nuevoCantidad");
    const precioElement = document.getElementById("nuevoPrecioActual");
    const gastoElement = document.getElementById("nuevoGastoMaterial");

    if (!cantidadElement || !precioElement || !gastoElement) {
        console.log("Elementos no encontrados para cálculo");
        return;
    }

    const cantidad = parseFloat(cantidadElement.value) || 0;
    const precioActual = parseFloat(precioElement.value) || 0;
    const gastoTotal = cantidad * precioActual;

    gastoElement.value = gastoTotal.toFixed(2);

    console.log(`Cálculo automático: ${cantidad} × ${precioActual} = ${gastoTotal.toFixed(2)}`);

    // Efectos visuales
    if (gastoTotal > 0) {
        gastoElement.style.background = 'linear-gradient(135deg, #e8f5e8, #d4edda)';
        gastoElement.style.borderColor = '#28a745';
    } else {
        gastoElement.style.background = '';
        gastoElement.style.borderColor = '';
    }

    setTimeout(() => {
        gastoElement.style.background = '';
        gastoElement.style.borderColor = '';
    }, 1000);
}

// FUNCIONES DE GUARDADO DE ACTIVIDADES

function guardarActividadMaterial() {
    if (modoEdicion && tarjetaEditando) {
        console.log("Actualizando actividad de material...");
        
        const datosOriginales = extraerDatosMaterial(tarjetaEditando);
        const gastoOriginal = datosOriginales.gasto || 0;
        
        // Obtener nuevos datos
        const datos = {
            fechaEntrada: document.getElementById("nuevoFechaEntrada").value,
            cantidad: parseFloat(document.getElementById("nuevoCantidad").value) || 0,
            precioActual: parseFloat(document.getElementById("nuevoPrecioActual").value) || 0,
            responsableRecibe: document.getElementById("nuevoResponsableRecibe").value,
            tipoMaterial: document.getElementById("nuevoTipoMaterial").value,
            responsableEntrega: document.getElementById("nuevoResponsableEntrega").value,
            obra: document.getElementById("nuevoObraMaterial").value,
            semanaObra: parseInt(document.getElementById("nuevoSemanaObraMaterial").value) || 0
        };
        
        if (!validarDatosMaterial(datos)) return;
        
        const nuevoGasto = datos.cantidad * datos.precioActual;
        const diferenciaGasto = nuevoGasto - gastoOriginal;
        
        // Validar presupuesto con la diferencia
        if (diferenciaGasto > 0 && !validarPresupuesto("material", diferenciaGasto)) {
            return;
        }
        
        // Actualizar tarjeta
        actualizarTarjetaMaterial(tarjetaEditando, datos, nuevoGasto);
        
        // Actualizar gastos
        if (window.actualizarGastos) {
            window.actualizarGastos("material", diferenciaGasto, false, 0);
        }
        
        // Actualizar en localStorage
        actualizarActividadEnStorage(tarjetaEditando, {
            tipo: "Entrada de Material",
            fecha: datos.fechaEntrada,
            cantidad: datos.cantidad,
            precioActual: datos.precioActual,
            responsableRecibe: datos.responsableRecibe,
            tipoMaterial: datos.tipoMaterial,
            responsableEntrega: datos.responsableEntrega,
            obra: datos.obra,
            semanaObra: datos.semanaObra,
            gasto: nuevoGasto
        });
        
        cerrarModalAgregarActividad();
        alert("Actividad de material actualizada correctamente");
        return;
    }

    // Lógica original para crear nueva actividad
    console.log("Guardando actividad de material...");

    const datos = {
        fechaEntrada: document.getElementById("nuevoFechaEntrada").value,
        cantidad: parseFloat(document.getElementById("nuevoCantidad").value) || 0,
        precioActual: parseFloat(document.getElementById("nuevoPrecioActual").value) || 0,
        responsableRecibe: document.getElementById("nuevoResponsableRecibe").value,
        tipoMaterial: document.getElementById("nuevoTipoMaterial").value,
        responsableEntrega: document.getElementById("nuevoResponsableEntrega").value,
        obra: document.getElementById("nuevoObraMaterial").value,
        semanaObra: parseInt(document.getElementById("nuevoSemanaObraMaterial").value) || 0
    };

    // Validaciones
    if (!validarDatosMaterial(datos)) {
        return;
    }

    const gastoCalculado = datos.cantidad * datos.precioActual;

    // Validar presupuesto antes de guardar
    if (!validarPresupuesto("material", gastoCalculado)) {
        return;
    }

    const actividad = {
        id: generateUniqueId(),
        tipo: "Entrada de Material",
        fecha: datos.fechaEntrada,
        cantidad: datos.cantidad,
        precioActual: datos.precioActual,
        responsableRecibe: datos.responsableRecibe,
        tipoMaterial: datos.tipoMaterial,
        responsableEntrega: datos.responsableEntrega,
        obra: datos.obra,
        semanaObra: datos.semanaObra,
        gasto: gastoCalculado,
        estado: "Completado",
        fechaCreacion: new Date().toISOString()
    };

    console.log("Actividad de material creada:", actividad);

    // Actualizar gastos y guardar
    if (window.actualizarGastos) {
        window.actualizarGastos("material", gastoCalculado, false, 0);
    }
    
    guardarActividad(actividad);
    actualizarUIActividades(actividad);
    cerrarModalAgregarActividad();

    alert(`Actividad de Entrada de Material guardada correctamente.\nGasto registrado: ${gastoCalculado.toFixed(2)}`);
}

function guardarActividadListaRaya() {
    if (modoEdicion && tarjetaEditando) {
        console.log("Actualizando actividad de lista raya...");
        
        const datosOriginales = extraerDatosListaRaya(tarjetaEditando);
        const gastoOriginal = datosOriginales.gasto || 0;
        
        const datos = {
            fechaCorte: document.getElementById("nuevoFechaCorte").value,
            obra: document.getElementById("nuevoObraListaRaya").value,
            responsablePagar: document.getElementById("nuevoResponsablePagar").value,
            gastoTrabajadores: parseFloat(document.getElementById("nuevoGastoTrabajadores").value) || 0
        };
        
        const empleados = obtenerEmpleados();
        
        if (!validarDatosListaRaya(datos, empleados)) return;
        
        const diferenciaGasto = datos.gastoTrabajadores - gastoOriginal;
        
        if (diferenciaGasto > 0 && !validarPresupuesto("trabajadores", diferenciaGasto)) {
            return;
        }
        
        actualizarTarjetaListaRaya(tarjetaEditando, datos, empleados);
        
        if (window.actualizarGastos) {
            window.actualizarGastos("trabajadores", diferenciaGasto, false, 0);
        }
        
        actualizarActividadEnStorage(tarjetaEditando, {
            tipo: "Lista Raya",
            fecha: datos.fechaCorte,
            obra: datos.obra,
            responsablePagar: datos.responsablePagar,
            empleados: empleados,
            gasto: datos.gastoTrabajadores
        });
        
        cerrarModalAgregarActividad();
        alert("Actividad de lista raya actualizada correctamente");
        return;
    }

    // Lógica original para crear nueva actividad
    console.log("Guardando actividad de lista raya...");

    const datos = {
        fechaCorte: document.getElementById("nuevoFechaCorte").value,
        obra: document.getElementById("nuevoObraListaRaya").value,
        responsablePagar: document.getElementById("nuevoResponsablePagar").value,
        gastoTrabajadores: parseFloat(document.getElementById("nuevoGastoTrabajadores").value) || 0
    };

    const empleados = obtenerEmpleados();

    // Validaciones
    if (!validarDatosListaRaya(datos, empleados)) {
        return;
    }

    // Validar presupuesto antes de guardar
    if (!validarPresupuesto("trabajadores", datos.gastoTrabajadores)) {
        return;
    }

    const actividad = {
        id: generateUniqueId(),
        tipo: "Lista Raya",
        fecha: datos.fechaCorte,
        obra: datos.obra,
        responsablePagar: datos.responsablePagar,
        empleados: empleados,
        gasto: datos.gastoTrabajadores,
        estado: "Completado",
        fechaCreacion: new Date().toISOString()
    };

    console.log("Actividad de lista raya creada:", actividad);

    // Actualizar gastos y guardar
    if (window.actualizarGastos) {
        window.actualizarGastos("trabajadores", datos.gastoTrabajadores, false, 0);
    }
    
    guardarActividad(actividad);
    actualizarUIActividades(actividad);
    cerrarModalAgregarActividad();

    alert(`Actividad de Lista Raya guardada correctamente.\nGasto en trabajadores registrado: ${datos.gastoTrabajadores.toFixed(2)}`);
}

function guardarActividadHerramienta() {
    if (modoEdicion && tarjetaEditando) {
        console.log("Actualizando actividad de herramienta...");
        
        const datosOriginales = extraerDatosHerramienta(tarjetaEditando);
        const gastoOriginal = datosOriginales.gasto || 0;
        
        const datos = {
            fechaEntrega: document.getElementById("nuevoFechaEntrega").value,
            cantidad: parseInt(document.getElementById("nuevoCantidadHerramientas").value) || 0,
            responsableEntrega: document.getElementById("nuevoResponsableEntrega").value,
            responsableRecibe: document.getElementById("nuevoResponsableRecibe").value,
            semanaObra: parseInt(document.getElementById("nuevoSemanaObra").value) || 0,
            obraSaliente: document.getElementById("nuevoObraSaliente").value,
            obraEntrante: document.getElementById("nuevoObraEntrante").value,
            gastoHerramientas: parseFloat(document.getElementById("nuevoGastoHerramientas").value) || 0
        };
        
        const herramientas = obtenerHerramientas();
        
        if (!validarDatosHerramienta(datos, herramientas)) return;
        
        const diferenciaGasto = datos.gastoHerramientas - gastoOriginal;
        
        if (diferenciaGasto > 0 && !validarPresupuesto("material", diferenciaGasto)) {
            return;
        }
        
        actualizarTarjetaHerramienta(tarjetaEditando, datos, herramientas);
        
        if (window.actualizarGastos) {
            window.actualizarGastos("material", diferenciaGasto, false, 0);
        }
        
        actualizarActividadEnStorage(tarjetaEditando, {
            tipo: "Entrada Herramienta",
            fecha: datos.fechaEntrega,
            cantidad: datos.cantidad,
            responsableEntrega: datos.responsableEntrega,
            responsableRecibe: datos.responsableRecibe,
            semanaObra: datos.semanaObra,
            obraSaliente: datos.obraSaliente,
            obraEntrante: datos.obraEntrante,
            herramientas: herramientas,
            gasto: datos.gastoHerramientas
        });
        
        cerrarModalAgregarActividad();
        alert("Actividad de herramienta actualizada correctamente");
        return;
    }

    // Lógica original para crear nueva actividad
    console.log("Guardando actividad de herramienta...");

    const datos = {
        fechaEntrega: document.getElementById("nuevoFechaEntrega").value,
        cantidad: parseInt(document.getElementById("nuevoCantidadHerramientas").value) || 0,
        responsableEntrega: document.getElementById("nuevoResponsableEntrega").value,
        responsableRecibe: document.getElementById("nuevoResponsableRecibe").value,
        semanaObra: parseInt(document.getElementById("nuevoSemanaObra").value) || 0,
        obraSaliente: document.getElementById("nuevoObraSaliente").value,
        obraEntrante: document.getElementById("nuevoObraEntrante").value,
        gastoHerramientas: parseFloat(document.getElementById("nuevoGastoHerramientas").value) || 0
    };

    const herramientas = obtenerHerramientas();

    // Validaciones
    if (!validarDatosHerramienta(datos, herramientas)) {
        return;
    }

    // Validar presupuesto antes de guardar
    if (!validarPresupuesto("material", datos.gastoHerramientas)) {
        return;
    }

    const actividad = {
        id: generateUniqueId(),
        tipo: "Entrada Herramienta",
        fecha: datos.fechaEntrega,
        cantidad: datos.cantidad,
        responsableEntrega: datos.responsableEntrega,
        responsableRecibe: datos.responsableRecibe,
        semanaObra: datos.semanaObra,
        obraSaliente: datos.obraSaliente,
        obraEntrante: datos.obraEntrante,
        herramientas: herramientas,
        gasto: datos.gastoHerramientas,
        estado: "Completado",
        fechaCreacion: new Date().toISOString()
    };

    console.log("Actividad de herramienta creada:", actividad);

    // Las herramientas se consideran como material para efectos del presupuesto
    if (window.actualizarGastos) {
        window.actualizarGastos("material", datos.gastoHerramientas, false, 0);
    }
    
    guardarActividad(actividad);
    actualizarUIActividades(actividad);
    cerrarModalAgregarActividad();

    alert(`Actividad de Entrada Herramienta guardada correctamente.\nGasto en material registrado: ${datos.gastoHerramientas.toFixed(2)}`);
}

// FUNCIONES DE VALIDACIÓN

function validarDatosMaterial(datos) {
    if (!datos.fechaEntrada) {
        alert("La fecha es obligatoria");
        return false;
    }

    if (!datos.cantidad || datos.cantidad <= 0) {
        alert("La cantidad debe ser mayor que cero");
        return false;
    }

    if (!datos.precioActual || datos.precioActual <= 0) {
        alert("El precio actual debe ser mayor que cero");
        return false;
    }

    if (!datos.responsableRecibe.trim()) {
        alert("El responsable que recibe es obligatorio");
        return false;
    }

    if (!datos.tipoMaterial.trim()) {
        alert("El tipo de material es obligatorio");
        return false;
    }

    if (!datos.responsableEntrega.trim()) {
        alert("El responsable de entrega es obligatorio");
        return false;
    }

    if (!datos.obra.trim()) {
        alert("La obra es obligatoria");
        return false;
    }

    if (!datos.semanaObra || datos.semanaObra <= 0) {
        alert("La semana de obra debe ser mayor que cero");
        return false;
    }

    return true;
}

function validarDatosListaRaya(datos, empleados) {
    if (!datos.fechaCorte) {
        alert("La fecha de corte es obligatoria");
        return false;
    }

    if (!datos.obra.trim()) {
        alert("La obra es obligatoria");
        return false;
    }

    if (!datos.responsablePagar.trim()) {
        alert("El responsable de pagar es obligatorio");
        return false;
    }

    if (empleados.length === 0) {
        alert("Debe agregar al menos un empleado con información completa");
        return false;
    }

    if (!datos.gastoTrabajadores || datos.gastoTrabajadores <= 0) {
        alert("El gasto en trabajadores debe ser mayor que cero");
        return false;
    }

    return true;
}

function validarDatosHerramienta(datos, herramientas) {
    if (!datos.fechaEntrega) {
        alert("La fecha de entrega es obligatoria");
        return false;
    }

    if (!datos.cantidad || datos.cantidad <= 0) {
        alert("La cantidad debe ser mayor que cero");
        return false;
    }

    if (!datos.responsableEntrega.trim()) {
        alert("El responsable de entrega es obligatorio");
        return false;
    }

    if (!datos.responsableRecibe.trim()) {
        alert("El responsable que recibe es obligatorio");
        return false;
    }

    if (!datos.semanaObra || datos.semanaObra <= 0) {
        alert("La semana de obra debe ser mayor que cero");
        return false;
    }

    if (!datos.obraSaliente.trim()) {
        alert("La obra saliente es obligatoria");
        return false;
    }

    if (!datos.obraEntrante.trim()) {
        alert("La obra entrante es obligatoria");
        return false;
    }

    if (herramientas.length === 0) {
        alert("Debe agregar al menos una herramienta");
        return false;
    }

    if (!datos.gastoHerramientas || datos.gastoHerramientas <= 0) {
        alert("El gasto en herramientas debe ser mayor que cero");
        return false;
    }

    return true;
}

function validarPresupuesto(tipoActividad, monto) {
    if (!window.obraActual || monto <= 0) return true;

    const presupuestoAsignado = parseFloat(window.obraActual.presupuesto?.replace(/[$,]/g, '')) || 0;
    const gastoActual = (parseFloat(window.obraActual.gastoMaterial) || 0) + (parseFloat(window.obraActual.gastoTrabajadores) || 0);
    const nuevoTotal = gastoActual + monto;

    if (presupuestoAsignado > 0 && nuevoTotal > presupuestoAsignado) {
        const exceso = nuevoTotal - presupuestoAsignado;
        const confirmacion = confirm(
            `¡Atención! Este gasto excederá el presupuesto en ${exceso.toFixed(2)}.\n\n` +
            `Presupuesto: ${presupuestoAsignado.toFixed(2)}\n` +
            `Gastado actual: ${gastoActual.toFixed(2)}\n` +
            `Nuevo gasto: ${monto.toFixed(2)}\n` +
            `Total después: ${nuevoTotal.toFixed(2)}\n\n` +
            `¿Desea continuar de todas formas?`
        );
        return confirmacion;
    }

    return true;
}

// FUNCIONES AUXILIARES

function obtenerEmpleados() {
    const empleados = [];
    const empleadosItems = document.querySelectorAll("#nuevoListaTrabajadores .empleado-detalle-item");

    empleadosItems.forEach(item => {
        const nombre = item.querySelector('.empleado-nombre')?.value.trim();
        const salario = parseFloat(item.querySelector('.empleado-salario')?.value) || 0;
        const diasTrabajados = parseInt(item.querySelector('.empleado-dias')?.value) || 0;
        const reciboSemanal = item.querySelector('.empleado-recibo')?.value;
        const status = item.querySelector('.empleado-status')?.value;

        if (nombre && salario > 0 && diasTrabajados > 0 && reciboSemanal && status) {
            empleados.push({
                nombre: nombre,
                salario: salario,
                diasTrabajados: diasTrabajados,
                reciboSemanal: reciboSemanal,
                status: status
            });
        }
    });

    return empleados;
}

function obtenerHerramientas() {
    const herramientas = [];
    const herramientasInputs = document.querySelectorAll("#nuevoListaHerramientas .lista-editable-item input");
    
    herramientasInputs.forEach(input => {
        if (input.value.trim()) {
            herramientas.push(input.value.trim());
        }
    });

    return herramientas;
}

function guardarActividad(actividad) {
    if (!window.obraActual) {
        console.error("No hay obra actual para guardar actividad");
        return;
    }

    const obrasGuardadas = JSON.parse(localStorage.getItem("obras")) || [];
    const indice = obrasGuardadas.findIndex(o => o.id === window.obraActual.id);

    if (indice !== -1) {
        if (!obrasGuardadas[indice].actividades) {
            obrasGuardadas[indice].actividades = [];
        }

        obrasGuardadas[indice].actividades.push(actividad);
        window.obraActual = obrasGuardadas[indice];
        localStorage.setItem("obras", JSON.stringify(obrasGuardadas));

        console.log(`Actividad "${actividad.tipo}" guardada correctamente`);
    }
}

function actualizarUIActividades(actividad) {
    const actividadesContainer = document.querySelector(".actividades-container");

    if (!actividadesContainer) {
        console.error("Container de actividades no encontrado");
        return;
    }

    if (actividad.tipo === "Entrada de Material") {
        const tarjeta = crearTarjetaMaterial(actividad);
        actividadesContainer.insertBefore(tarjeta, actividadesContainer.firstChild);
    } 
    else if (actividad.tipo === "Lista Raya") {
        const tarjeta = crearTarjetaListaRaya(actividad);
        actividadesContainer.insertBefore(tarjeta, actividadesContainer.firstChild);
    }
    else if (actividad.tipo === "Entrada Herramienta") {
        const tarjeta = crearTarjetaHerramienta(actividad);
        actividadesContainer.insertBefore(tarjeta, actividadesContainer.firstChild);
    }
}

function crearTarjetaMaterial(actividad) {
    const tarjeta = document.createElement("div");
    tarjeta.className = "actividad-tarjeta";
    tarjeta.innerHTML = `
        <div class="actividad-header">
            <div class="actividad-titulo-botones">
                <h2>Actividad: ${actividad.tipo}</h2>
                <button class="btn-editar-actividad btn-editar-material-dinamico" title="Editar Entrada de Material">
                    <i class='bx bx-edit'></i>
                </button>
            </div>
            <p>Fecha de entrada: ${formatearFecha(actividad.fecha)}</p>
            <p>Cantidad: ${actividad.cantidad}</p>
            <p>Precio Actual: ${actividad.precioActual.toFixed(2)}</p>
            <p>Recibió: ${actividad.responsableRecibe}</p>
            <p>Tipo de material: ${actividad.tipoMaterial}</p>
            <p>Responsable Entrega: ${actividad.responsableEntrega}</p>
            <p>Obra: ${actividad.obra}</p>
            <p>Semana de obra: ${actividad.semanaObra}</p>
            <p>Gasto Total: ${actividad.gasto.toFixed(2)}</p>
        </div>
    `;
    return tarjeta;
}

function crearTarjetaListaRaya(actividad) {
    const tarjeta = document.createElement("div");
    tarjeta.className = "actividad-tarjeta doble";

    let empleadosHTML = "";
    actividad.empleados.forEach(empleado => {
        empleadosHTML += `
            <li>
                <strong>${empleado.nombre}</strong><br>
                <small>Salario: ${empleado.salario} | Días: ${empleado.diasTrabajados} | 
                Recibo: ${empleado.reciboSemanal} | Status: ${empleado.status}</small>
            </li>
        `;
    });

    tarjeta.innerHTML = `
        <div class="actividad-izquierda">
            <div class="actividad-header">
                <div class="actividad-titulo-botones">
                    <h2>Actividad: ${actividad.tipo}</h2>
                </div>
                <p>Fecha de corte: ${formatearFecha(actividad.fecha)}</p>
                <p>Obra: ${actividad.obra}</p>
                <p>Responsable pagar: ${actividad.responsablePagar}</p>
                <p>Gasto Total: ${actividad.gasto.toFixed(2)}</p>
            </div>
        </div>
        <div class="actividad-derecha">
            <div class="actividad-lista">
                <h2>Empleados</h2>
                <ul>${empleadosHTML}</ul>
            </div>
        </div>
        <button class="btn-editar-actividad btn-editar-lista-dinamico" title="Editar Lista Raya">
            <i class='bx bx-edit'></i>
        </button>
    `;
    return tarjeta;
}

function crearTarjetaHerramienta(actividad) {
    const tarjeta = document.createElement("div");
    tarjeta.className = "actividad-tarjeta doble";

    let herramientasHTML = "";
    actividad.herramientas.forEach(herramienta => {
        herramientasHTML += `<li>${herramienta}</li>`;
    });

    tarjeta.innerHTML = `
        <div class="actividad-izquierda">
            <div class="actividad-header">
                <div class="actividad-titulo-botones">
                    <h2>Actividad: ${actividad.tipo}</h2>
                </div>
                <p>Fecha de entrega: ${formatearFecha(actividad.fecha)}</p>
                <p>Cantidad: ${actividad.cantidad}</p>
                <p>Responsable Entrega: ${actividad.responsableEntrega}</p>
                <p>Responsable Recibe: ${actividad.responsableRecibe}</p>
                <p>Semana de obra: ${actividad.semanaObra}</p>
                <p>Obra saliente: ${actividad.obraSaliente}</p>
                <p>Obra entrante: ${actividad.obraEntrante}</p>
                <p>Gasto: ${actividad.gasto.toFixed(2)}</p>
            </div>
        </div>
        <div class="actividad-derecha">
            <div class="actividad-lista">
                <h2>Herramientas</h2>
                <ul>${herramientasHTML}</ul>
            </div>
        </div>
        <button class="btn-editar-actividad btn-editar-herramienta-dinamico" title="Editar Entrada Herramienta">
            <i class='bx bx-edit'></i>
        </button>
    `;
    return tarjeta;
}

// FUNCIONES DE ACTUALIZACIÓN DE TARJETAS
function actualizarTarjetaMaterial(tarjeta, datos, gasto) {
    const nuevaFecha = new Date(datos.fechaEntrada).toLocaleDateString();
    tarjeta.innerHTML = `
        <div class="actividad-header">
            <div class="actividad-titulo-botones">
                <h2>Actividad: Entrada de Material</h2>
                <button class="btn-editar-actividad btn-editar-material-dinamico" title="Editar Entrada de Material">
                    <i class='bx bx-edit'></i>
                </button>
            </div>
            <p>Fecha de entrada: ${nuevaFecha}</p>
            <p>Cantidad: ${datos.cantidad}</p>
            <p>Precio Actual: ${datos.precioActual.toFixed(2)}</p>
            <p>Recibió: ${datos.responsableRecibe}</p>
            <p>Tipo de material: ${datos.tipoMaterial}</p>
            <p>Responsable Entrega: ${datos.responsableEntrega}</p>
            <p>Obra: ${datos.obra}</p>
            <p>Semana de obra: ${datos.semanaObra}</p>
            <p>Gasto Total: ${gasto.toFixed(2)}</p>
        </div>
    `;
}

function actualizarTarjetaListaRaya(tarjeta, datos, empleados) {
    const nuevaFecha = new Date(datos.fechaCorte).toLocaleDateString();
    let empleadosHTML = "";
    empleados.forEach(empleado => {
        empleadosHTML += `
            <li>
                <strong>${empleado.nombre}</strong><br>
                <small>Salario: ${empleado.salario} | Días: ${empleado.diasTrabajados} | 
                Recibo: ${empleado.reciboSemanal} | Status: ${empleado.status}</small>
            </li>
        `;
    });
    
    tarjeta.innerHTML = `
        <div class="actividad-izquierda">
            <div class="actividad-header">
                <div class="actividad-titulo-botones">
                    <h2>Actividad: Lista Raya</h2>
                </div>
                <p>Fecha de corte: ${nuevaFecha}</p>
                <p>Obra: ${datos.obra}</p>
                <p>Responsable pagar: ${datos.responsablePagar}</p>
                <p>Gasto Total: ${datos.gastoTrabajadores.toFixed(2)}</p>
            </div>
        </div>
        <div class="actividad-derecha">
            <div class="actividad-lista">
                <h2>Empleados</h2>
                <ul>${empleadosHTML}</ul>
            </div>
        </div>
        <button class="btn-editar-actividad btn-editar-lista-dinamico" title="Editar Lista Raya">
            <i class='bx bx-edit'></i>
        </button>
    `;
}

function actualizarTarjetaHerramienta(tarjeta, datos, herramientas) {
    const nuevaFecha = new Date(datos.fechaEntrega).toLocaleDateString();
    let herramientasHTML = "";
    herramientas.forEach(herramienta => {
        herramientasHTML += `<li>${herramienta}</li>`;
    });
    
    tarjeta.innerHTML = `
        <div class="actividad-izquierda">
            <div class="actividad-header">
                <div class="actividad-titulo-botones">
                    <h2>Actividad: Entrada Herramienta</h2>
                </div>
                <p>Fecha de entrega: ${nuevaFecha}</p>
                <p>Cantidad: ${datos.cantidad}</p>
                <p>Responsable Entrega: ${datos.responsableEntrega}</p>
                <p>Responsable Recibe: ${datos.responsableRecibe}</p>
                <p>Semana de obra: ${datos.semanaObra}</p>
                <p>Obra saliente: ${datos.obraSaliente}</p>
                <p>Obra entrante: ${datos.obraEntrante}</p>
                <p>Gasto: ${datos.gastoHerramientas.toFixed(2)}</p>
            </div>
        </div>
        <div class="actividad-derecha">
            <div class="actividad-lista">
                <h2>Herramientas</h2>
                <ul>${herramientasHTML}</ul>
            </div>
        </div>
        <button class="btn-editar-actividad btn-editar-herramienta-dinamico" title="Editar Entrada Herramienta">
            <i class='bx bx-edit'></i>
        </button>
    `;
}

// FUNCIÓN PARA ACTUALIZAR EN LOCALSTORAGE
function actualizarActividadEnStorage(tarjeta, nuevosDeatos) {
    if (!window.obraActual || !window.obraActual.actividades) return;
    
    // Buscar la actividad por su posición en el DOM
    const todasLasTarjetas = document.querySelectorAll('.actividad-tarjeta');
    const indiceTarjeta = Array.from(todasLasTarjetas).indexOf(tarjeta);
    
    if (indiceTarjeta >= 0 && indiceTarjeta < window.obraActual.actividades.length) {
        // Actualizar la actividad manteniendo id y fechaCreacion
        const actividadOriginal = window.obraActual.actividades[indiceTarjeta];
        const actividadActualizada = {
            ...actividadOriginal,
            ...nuevosDeatos,
            fechaModificacion: new Date().toISOString()
        };
        
        window.obraActual.actividades[indiceTarjeta] = actividadActualizada;
        
        // Guardar en localStorage
        const obrasGuardadas = JSON.parse(localStorage.getItem("obras")) || [];
        const indiceObra = obrasGuardadas.findIndex(o => o.id === window.obraActual.id);
        
        if (indiceObra !== -1) {
            obrasGuardadas[indiceObra] = window.obraActual;
            localStorage.setItem("obras", JSON.stringify(obrasGuardadas));
        }
    }
}

// FUNCIONES DE CONFIGURACIÓN DE LISTAS

function configurarEventosListas() {
    const nuevoAgregarTrabajador = document.getElementById("nuevoAgregarTrabajador");
    const nuevoAgregarHerramienta = document.getElementById("nuevoAgregarHerramienta");

    if (nuevoAgregarTrabajador) {
        nuevoAgregarTrabajador.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            agregarEmpleadoDetallado();
        });
    }

    if (nuevoAgregarHerramienta) {
        nuevoAgregarHerramienta.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            agregarItemLista("nuevoListaHerramientas", "Nombre de la herramienta");
        });
    }
}

function agregarEmpleadoDetallado() {
    const lista = document.getElementById("nuevoListaTrabajadores");
    if (!lista) return;

    const empleadoDiv = document.createElement("div");
    empleadoDiv.className = "empleado-detalle-item";

    empleadoDiv.innerHTML = `
        <div class="empleado-campos">
            <div class="campo-grupo">
                <label>Empleado:</label>
                <input type="text" class="empleado-nombre" placeholder="Nombre del empleado" required>
            </div>
            <div class="campo-grupo">
                <label>Salario por día ($):</label>
                <input type="number" class="empleado-salario" placeholder="Salario diario" step="0.01" required>
            </div>
            <div class="campo-grupo">
                <label>Días trabajados:</label>
                <input type="number" class="empleado-dias" placeholder="Días" min="1" max="7" required>
            </div>
            <div class="campo-grupo">
                <label>Total ($):</label>
                <input type="number" class="empleado-total" placeholder="0.00" step="0.01" readonly 
                style="background: linear-gradient(135deg, #e3f2fd, #bbdefb); 
                border: 2px solid #2196f3; 
                color: #0d47a1; 
                font-weight: bold; 
                text-align: center;
                border-radius: 5px;">
                </div>
            <div class="campo-grupo">
                <label>Recibo Semanal:</label>
                <select class="empleado-recibo" required>
                    <option value="">Seleccionar</option>
                    <option value="Sí">Sí</option>
                    <option value="No">No</option>
                </select>
            </div>
            <div class="campo-grupo">
                <label>Status:</label>
                <select class="empleado-status" required>
                    <option value="">Seleccionar</option>
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                    <option value="Pendiente">Pendiente</option>
                </select>
            </div>
        </div>
        <span class="eliminar-empleado" title="Eliminar empleado">×</span>
    `;

    // Agregar event listeners para cálculo automático
    const salarioInput = empleadoDiv.querySelector('.empleado-salario');
    const diasInput = empleadoDiv.querySelector('.empleado-dias');
    const totalInput = empleadoDiv.querySelector('.empleado-total');

    function calcularTotalEmpleado() {
        const salario = parseFloat(salarioInput.value) || 0;
        const dias = parseInt(diasInput.value) || 0;
        const total = salario * dias;
        
        totalInput.value = total.toFixed(2);
        
        // Calcular total general después de un pequeño delay
        setTimeout(calcularGastoTotalTrabajadores, 50);
    }

    salarioInput.addEventListener('input', calcularTotalEmpleado);
    diasInput.addEventListener('input', calcularTotalEmpleado);

    const btnEliminar = empleadoDiv.querySelector('.eliminar-empleado');
    btnEliminar.addEventListener('click', () => {
        lista.removeChild(empleadoDiv);
        // Recalcular total después de eliminar
        setTimeout(calcularGastoTotalTrabajadores, 50);
    });

    lista.appendChild(empleadoDiv);
}

function agregarItemLista(listaId, placeholder) {
    const lista = document.getElementById(listaId);
    if (!lista) return;

    const itemDiv = document.createElement("div");
    itemDiv.className = "lista-editable-item";

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = placeholder;
    input.required = true;

    const btnEliminar = document.createElement("span");
    btnEliminar.className = "eliminar-item";
    btnEliminar.innerHTML = "×";

    btnEliminar.addEventListener("click", () => {
        lista.removeChild(itemDiv);
    });

    itemDiv.appendChild(input);
    itemDiv.appendChild(btnEliminar);
    lista.appendChild(itemDiv);
}

// FUNCIONES AUXILIARES DE UTILIDAD

function ocultarTodosLosFormularios() {
    if (seleccionTipoActividad) seleccionTipoActividad.style.display = "none";
    if (formMaterial) formMaterial.style.display = "none";
    if (formListaRaya) formListaRaya.style.display = "none";
    if (formHerramienta) formHerramienta.style.display = "none";
}

function ocultarSeccionInformacion() {
    const seccionInformacion = document.querySelector(".proyecto-informacion-container");
    if (seccionInformacion) {
        seccionInformacion.dataset.displayState = seccionInformacion.style.display;
        seccionInformacion.style.display = "none";
    }
}

function restaurarTitulosOriginales() {
    const elementos = [
        { form: formMaterial, titulo: "Actividad: Entrada de Material", boton: "Guardar Actividad" },
        { form: formListaRaya, titulo: "Actividad: Lista Raya", boton: "Guardar Actividad" },
        { form: formHerramienta, titulo: "Actividad: Entrada Herramienta", boton: "Guardar Actividad" }
    ];

    elementos.forEach(elemento => {
        if (elemento.form) {
            const tituloElement = elemento.form.querySelector("h3");
            const botonElement = elemento.form.querySelector('button[type="submit"]');
            
            if (tituloElement) tituloElement.textContent = elemento.titulo;
            if (botonElement) botonElement.textContent = elemento.boton;
        }
    });
}

function limpiarFormularios() {
    const formularios = [
        document.getElementById("formAgregarMaterial"),
        document.getElementById("formAgregarListaRaya"),
        document.getElementById("formAgregarHerramienta")
    ];

    formularios.forEach(form => {
        if (form) form.reset();
    });

    const listas = [
        document.getElementById("nuevoListaTrabajadores"),
        document.getElementById("nuevoListaHerramientas")
    ];

    listas.forEach(lista => {
        if (lista) lista.innerHTML = "";
    });
}

function formatearFecha(fechaStr) {
    if (!fechaStr) return "Fecha no disponible";
    const fecha = new Date(fechaStr);
    return isNaN(fecha) ? "Fecha inválida" : fecha.toLocaleDateString();
}

function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// Función para calcular automáticamente el gasto total de trabajadores
function calcularGastoTotalTrabajadores() {
    const empleadosItems = document.querySelectorAll("#nuevoListaTrabajadores .empleado-detalle-item");
    const gastoTotalElement = document.getElementById("nuevoGastoTrabajadores");
    
    if (!gastoTotalElement) return;
    
    let gastoTotal = 0;
    
    empleadosItems.forEach(item => {
        const salario = parseFloat(item.querySelector('.empleado-salario')?.value) || 0;
        const diasTrabajados = parseInt(item.querySelector('.empleado-dias')?.value) || 0;
        
        if (salario > 0 && diasTrabajados > 0) {
            gastoTotal += salario * diasTrabajados;
        }
    });
    
    gastoTotalElement.value = gastoTotal.toFixed(2);
    
    // Efectos visuales
    if (gastoTotal > 0) {
        gastoTotalElement.style.background = 'linear-gradient(135deg, #e8f5e8, #d4edda)';
        gastoTotalElement.style.borderColor = '#28a745';
    } else {
        gastoTotalElement.style.background = '';
        gastoTotalElement.style.borderColor = '';
    }
    
    setTimeout(() => {
        gastoTotalElement.style.background = '';
        gastoTotalElement.style.borderColor = '';
    }, 1000);
    
    console.log(`Gasto total de trabajadores calculado: ${gastoTotal.toFixed(2)}`);
    return gastoTotal;
}
