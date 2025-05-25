// obra-detalle.js - Versión corregida y optimizada
document.addEventListener("DOMContentLoaded", function() {
    // Elementos DOM
    const body = document.querySelector("body");
    const btnRegresar = document.getElementById("btnRegresar");
    const btnEditar = document.getElementById("btnEditar");
    const modalEditar = document.getElementById("modalEditar");
    const cerrarModalEditar = document.getElementById("cerrarModalEditar");
    const formEditar = document.getElementById("formEditar");
    const toggleSwitch = document.querySelector(".toggle-switch");
    const modeText = document.querySelector(".mode-text");

    // Variables globales
    let obraActual = null;
    window.obraActual = null;

    // Inicialización
    if (modalEditar) modalEditar.style.display = "none";
    if (btnEditar) btnEditar.style.display = "flex";

    // Event Listeners
    if (btnRegresar) {
        btnRegresar.addEventListener("click", () => {
            window.location.href = "/Principal/obras.html";
        });
    }

    if (btnEditar) {
        btnEditar.addEventListener("click", () => {
            cargarDatosFormularioEdicion();
            modalEditar.style.display = "flex";
            document.body.style.overflow = "hidden";
        });
    }

    if (cerrarModalEditar) {
        cerrarModalEditar.addEventListener("click", () => {
            modalEditar.style.display = "none";
            document.body.style.overflow = "auto";
        });
    }

    if (formEditar) {
        formEditar.addEventListener("submit", (e) => {
            e.preventDefault();
            guardarCambiosObra();
        });
    }

    // Tema oscuro y claro
    if (toggleSwitch) {
        toggleSwitch.addEventListener("click", () => {
            body.classList.toggle("dark");
            
            if (body.classList.contains("dark")) {
                modeText.innerText = "Modo claro";
                localStorage.setItem("theme", "dark");
            } else {
                modeText.innerText = "Modo oscuro";
                localStorage.setItem("theme", "light");
            }
        });
    }

    // Cargar tema guardado
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        body.classList.add("dark");
        if (modeText) modeText.innerText = "Modo claro";
    } else {
        body.classList.remove("dark");
        if (modeText) modeText.innerText = "Modo oscuro";
    }

    // Cerrar modal al hacer clic fuera
    window.addEventListener("click", (event) => {
        if (event.target === modalEditar) {
            modalEditar.style.display = "none";
            document.body.style.overflow = "auto";
        }
    });

    // Obtener el ID de la obra desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const obraId = urlParams.get('id');

    if (obraId) {
        cargarDatosObra(obraId);
    } else {
        alert("No se especificó una obra para mostrar");
        window.location.href = "obras.html";
    }

    // FUNCIÓN PRINCIPAL PARA CARGAR DATOS DE LA OBRA
    function cargarDatosObra(id) {
        console.log("Cargando datos de obra:", id);
        
        const obrasGuardadas = JSON.parse(localStorage.getItem("obras")) || [];
        const obra = obrasGuardadas.find(o => o.id === id);
        
        if (obra) {
            // Inicializar campos de gastos si no existen
            if (obra.gastoMaterial === undefined) {
                obra.gastoMaterial = 0;
            }
            if (obra.gastoTrabajadores === undefined) {
                obra.gastoTrabajadores = 0;
            }
            
            // Guardar la obra actual
            obraActual = obra;
            window.obraActual = obra;
            
            console.log("Obra cargada:", obra);
            
            // Actualizar la interfaz
            actualizarInterfazObra(obra);
            
            // Guardar cambios en localStorage
            const indice = obrasGuardadas.findIndex(o => o.id === obra.id);
            if (indice !== -1) {
                obrasGuardadas[indice] = obra;
                localStorage.setItem("obras", JSON.stringify(obrasGuardadas));
            }
            
            // Actualizar información financiera
            setTimeout(() => {
                actualizarInformacionProyecto();
            }, 100);
            
        } else {
            alert("No se encontró la obra especificada");
            window.location.href = "obras.html";
        }
    }

    // FUNCIÓN PARA ACTUALIZAR LA INTERFAZ
    function actualizarInterfazObra(obra) {
        // Título
        document.title = "Obra: " + obra.nombre + " | TecnoBuild";
        const tituloElement = document.getElementById("obraTitulo");
        if (tituloElement) {
            tituloElement.innerHTML = `Obra: <span>${obra.nombre}</span>`;
        }
        
        // Imagen
        const imagenElement = document.getElementById("obraImagen");
        if (imagenElement && obra.imagen) {
            imagenElement.src = obra.imagen;
        }
        
        // Información básica
        const ubicacionElement = document.getElementById("obraUbicacion");
        if (ubicacionElement) {
            ubicacionElement.textContent = `Ubicación: ${obra.ubicacion || "Ubicación no disponible"}`;
        }
        
        const duenoElement = document.getElementById("obraDuenoPredio");
        if (duenoElement) {
            duenoElement.textContent = `Dueño del predio: ${obra.duenoPredio || "Dueño no especificado"}`;
        }
        
        const presupuestoElement = document.getElementById("obraPresupuesto");
        if (presupuestoElement) {
            presupuestoElement.textContent = `Presupuesto: ${obra.presupuesto || "$0"}`;
        }
        
        const fechaInicioElement = document.getElementById("obraFechaInicio");
        if (fechaInicioElement) {
            fechaInicioElement.textContent = `Fecha de inicio: ${obra.fechaInicio ? formatearFecha(obra.fechaInicio) : "Fecha no disponible"}`;
        }
        
        const fechaFinElement = document.getElementById("obraFechaFin");
        if (fechaFinElement) {
            fechaFinElement.textContent = `Fecha de finalización: ${obra.fechaFin ? formatearFecha(obra.fechaFin) : "Fecha no disponible"}`;
        }
        
        const contratoElement = document.getElementById("obraNumeroContrato");
        if (contratoElement) {
            contratoElement.textContent = `Número de contrato: ${obra.numeroContrato || "No asignado"}`;
        }
        
        // Calcular progreso
        calcularProgreso(obra);
        
        // Actividades simuladas
        actualizarActividadesSimuladas(obra);
    }

    // FUNCIÓN PARA CALCULAR PROGRESO
    function calcularProgreso(obra) {
        const hoy = new Date();
        const inicio = obra.fechaInicio ? new Date(obra.fechaInicio) : new Date();
        const fin = obra.fechaFin ? new Date(obra.fechaFin) : new Date(inicio.getTime() + (90 * 24 * 60 * 60 * 1000));
        
        const progresoElement = document.getElementById("obraProgreso");
        const semanaElement = document.getElementById("obraSemana");
        
        if (progresoElement && semanaElement) {
            if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
                progresoElement.style.width = "0%";
                semanaElement.textContent = "0";
            } else {
                const totalDias = Math.floor((fin - inicio) / (1000 * 60 * 60 * 24));
                const diasTranscurridos = Math.floor((hoy - inicio) / (1000 * 60 * 60 * 24));
                
                const semanasTotal = Math.ceil(totalDias / 7);
                const semanaActual = Math.ceil(diasTranscurridos / 7);
                
                const semanaAMostrar = Math.min(Math.max(semanaActual, 1), semanasTotal);
                semanaElement.textContent = semanaAMostrar;
                
                let porcentaje = totalDias > 0 ? (diasTranscurridos / totalDias) * 100 : 0;
                porcentaje = Math.max(0, Math.min(100, porcentaje));
                
                progresoElement.style.width = `${porcentaje}%`;
            }
        }
    }

    // FUNCIÓN PARA ACTUALIZAR ACTIVIDADES SIMULADAS
    function actualizarActividadesSimuladas(obra) {
        // Actividad de material
        const fechaEntradaElement = document.getElementById("fechaEntrada");
        const recibioElement = document.getElementById("recibio");
        const cantidadElement = document.getElementById("cantidad");
        
        if (fechaEntradaElement) {
            fechaEntradaElement.textContent = `Fecha de entrada: ${obra.fechaEntrada ? formatearFecha(obra.fechaEntrada) : fechaAleatoria()}`;
        }
        if (recibioElement) {
            recibioElement.textContent = `Recibió: ${obra.recibio || "Nombre no registrado"}`;
        }
        if (cantidadElement) {
            cantidadElement.textContent = `Cantidad: ${obra.cantidad || Math.floor(Math.random() * 100) + 1}`;
        }
        
        // Actividad de lista raya
        const fechaCorteElement = document.getElementById("fechaCorte");
        const responsablePagarElement = document.getElementById("responsablePagar");
        const pagadoElement = document.getElementById("pagado");
        
        if (fechaCorteElement) {
            fechaCorteElement.textContent = `Fecha de corte: ${obra.fechaCorte ? formatearFecha(obra.fechaCorte) : fechaAleatoria()}`;
        }
        if (responsablePagarElement) {
            responsablePagarElement.textContent = `Responsable pagar: ${obra.responsablePagar || obra.responsable || "No asignado"}`;
        }
        if (pagadoElement) {
            pagadoElement.textContent = `Pagado: ${obra.pagado || (Math.random() > 0.5 ? "Sí" : "No")}`;
        }
        
        // Actividad de herramientas
        const fechaEntregaElement = document.getElementById("fechaEntrega");
        const responsableEntregaElement = document.getElementById("responsableEntrega");
        const responsableRecibeElement = document.getElementById("responsableRecibe");
        
        if (fechaEntregaElement) {
            fechaEntregaElement.textContent = `Fecha de entrega: ${obra.fechaEntrega ? formatearFecha(obra.fechaEntrega) : fechaAleatoria()}`;
        }
        if (responsableEntregaElement) {
            responsableEntregaElement.textContent = `Responsable Entrega: ${obra.responsableEntrega || obra.responsable || "No asignado"}`;
        }
        if (responsableRecibeElement) {
            responsableRecibeElement.textContent = `Responsable Recibe: ${obra.responsableRecibe || obra.recibio || "No asignado"}`;
        }
        
        // Listas de trabajadores y herramientas
        if (obra.trabajadores && obra.trabajadores.length > 0) {
            const listaTrabajadores = document.getElementById("listaTrabajadores");
            if (listaTrabajadores) {
                listaTrabajadores.innerHTML = "";
                obra.trabajadores.forEach(trabajador => {
                    const li = document.createElement("li");
                    li.textContent = trabajador;
                    listaTrabajadores.appendChild(li);
                });
            }
        }
        
        if (obra.herramientas && obra.herramientas.length > 0) {
            const listaHerramientas = document.getElementById("listaHerramientas");
            if (listaHerramientas) {
                listaHerramientas.innerHTML = "";
                obra.herramientas.forEach(herramienta => {
                    const li = document.createElement("li");
                    li.textContent = herramienta;
                    listaHerramientas.appendChild(li);
                });
            }
        }
    }

    // FUNCIÓN PRINCIPAL PARA ACTUALIZAR INFORMACIÓN FINANCIERA
    function actualizarInformacionProyecto() {
        console.log("Actualizando información del proyecto...");
        
        if (!window.obraActual) {
            console.log("No hay obra actual para actualizar");
            return;
        }
        
        // Obtener presupuesto asignado
        let presupuestoAsignado = 0;
        if (window.obraActual.presupuesto) {
            const presupuestoStr = window.obraActual.presupuesto.toString().replace(/[$,]/g, '');
            presupuestoAsignado = parseFloat(presupuestoStr) || 0;
        }
        
        // Obtener gastos actuales
        const gastoMateriales = parseFloat(window.obraActual.gastoMaterial) || 0;
        const gastoTrabajadores = parseFloat(window.obraActual.gastoTrabajadores) || 0;
        const totalGastado = gastoMateriales + gastoTrabajadores;
        const presupuestoRestante = presupuestoAsignado - totalGastado;
        const porcentajeUtilizado = presupuestoAsignado > 0 ? (totalGastado / presupuestoAsignado) * 100 : 0;
        
        console.log('Datos financieros:', {
            presupuestoAsignado,
            gastoMateriales,
            gastoTrabajadores,
            totalGastado,
            presupuestoRestante,
            porcentajeUtilizado
        });
        
        // Actualizar elementos del DOM
        const elementos = {
            presupuesto: document.getElementById("financieroPresupuesto"),
            materiales: document.getElementById("financieroMateriales"),
            trabajadores: document.getElementById("financieroTrabajadores"),
            totalGastado: document.getElementById("financieroTotalGastado"),
            restante: document.getElementById("financieroRestante"),
            porcentaje: document.getElementById("financieroPorcentaje")
        };
        
        if (elementos.presupuesto) {
            elementos.presupuesto.textContent = `${presupuestoAsignado.toLocaleString('es-MX', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        }
        
        if (elementos.materiales) {
            elementos.materiales.textContent = `${gastoMateriales.toLocaleString('es-MX', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        }
        
        if (elementos.trabajadores) {
            elementos.trabajadores.textContent = `${gastoTrabajadores.toLocaleString('es-MX', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        }
        
        if (elementos.totalGastado) {
            elementos.totalGastado.textContent = `${totalGastado.toLocaleString('es-MX', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        }
        
        if (elementos.porcentaje) {
            elementos.porcentaje.textContent = `${porcentajeUtilizado.toFixed(1)}%`;
        }
        
        // Actualizar presupuesto restante con colores
        if (elementos.restante) {
            if (presupuestoRestante < 0) {
                elementos.restante.style.color = '#ff4757';
                elementos.restante.textContent = `-${Math.abs(presupuestoRestante).toLocaleString('es-MX', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
            } else if (presupuestoRestante < presupuestoAsignado * 0.1) {
                elementos.restante.style.color = '#ffa502';
                elementos.restante.textContent = `${presupuestoRestante.toLocaleString('es-MX', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
            } else {
                elementos.restante.style.color = '#2ed573';
                elementos.restante.textContent = `${presupuestoRestante.toLocaleString('es-MX', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
            }
        }
        
        // Actualizar barra de progreso financiero
        const barraGastado = document.getElementById("barraGastado");
        if (barraGastado) {
            const porcentajeParaBarra = Math.min(porcentajeUtilizado, 100);
            barraGastado.style.width = `${porcentajeParaBarra}%`;
            
            // Cambiar color según el porcentaje
            barraGastado.classList.remove('warning', 'danger', 'over-budget');
            if (porcentajeUtilizado >= 100) {
                barraGastado.classList.add('over-budget');
                barraGastado.style.backgroundColor = '#ff4757';
            } else if (porcentajeUtilizado >= 90) {
                barraGastado.classList.add('danger');
                barraGastado.style.backgroundColor = '#ff6b7a';
            } else if (porcentajeUtilizado >= 70) {
                barraGastado.classList.add('warning');
                barraGastado.style.backgroundColor = '#ffa502';
            } else {
                barraGastado.style.backgroundColor = '#2ed573';
            }
        }
        
        // Actualizar indicador de estado
        const indicadorEstado = document.querySelector('.presupuesto-estado');
        if (indicadorEstado) {
            indicadorEstado.classList.remove('saludable', 'precaucion', 'peligro');
            
            if (porcentajeUtilizado >= 90) {
                indicadorEstado.classList.add('peligro');
            } else if (porcentajeUtilizado >= 70) {
                indicadorEstado.classList.add('precaucion');
            } else {
                indicadorEstado.classList.add('saludable');
            }
        }
        
        console.log("Información financiera actualizada");
    }

    // FUNCIÓN PARA ACTUALIZAR GASTOS
    function actualizarGastos(tipoGasto, monto, esEdicion = false, montoAnterior = 0) {
        console.log('Actualizando gastos:', { tipoGasto, monto, esEdicion, montoAnterior });
        
        if (!window.obraActual) {
            console.error('No hay obra actual para actualizar gastos');
            return;
        }
        
        const obrasGuardadas = JSON.parse(localStorage.getItem("obras")) || [];
        const indice = obrasGuardadas.findIndex(o => o.id === window.obraActual.id);
        
        if (indice !== -1) {
            const montoNumerico = parseFloat(monto) || 0;
            const montoAnteriorNumerico = parseFloat(montoAnterior) || 0;
            
            if (tipoGasto === "material") {
                if (esEdicion) {
                    obrasGuardadas[indice].gastoMaterial = (parseFloat(obrasGuardadas[indice].gastoMaterial) || 0) - montoAnteriorNumerico + montoNumerico;
                } else {
                    obrasGuardadas[indice].gastoMaterial = (parseFloat(obrasGuardadas[indice].gastoMaterial) || 0) + montoNumerico;
                }
            } else if (tipoGasto === "trabajadores") {
                if (esEdicion) {
                    obrasGuardadas[indice].gastoTrabajadores = (parseFloat(obrasGuardadas[indice].gastoTrabajadores) || 0) - montoAnteriorNumerico + montoNumerico;
                } else {
                    obrasGuardadas[indice].gastoTrabajadores = (parseFloat(obrasGuardadas[indice].gastoTrabajadores) || 0) + montoNumerico;
                }
            }
            
            // Asegurar que no sean negativos
            obrasGuardadas[indice].gastoMaterial = Math.max(0, obrasGuardadas[indice].gastoMaterial || 0);
            obrasGuardadas[indice].gastoTrabajadores = Math.max(0, obrasGuardadas[indice].gastoTrabajadores || 0);
            
            // Actualizar referencias
            window.obraActual = obrasGuardadas[indice];
            obraActual = obrasGuardadas[indice];
            localStorage.setItem("obras", JSON.stringify(obrasGuardadas));
            
            console.log('Gastos actualizados:', {
                gastoMaterial: window.obraActual.gastoMaterial,
                gastoTrabajadores: window.obraActual.gastoTrabajadores
            });
            
            // Actualizar información del proyecto
            setTimeout(() => {
                actualizarInformacionProyecto();
            }, 100);
        } else {
            console.error('No se encontró la obra en localStorage');
        }
    }

    // FUNCIONES DE EDICIÓN DE OBRA
    function cargarDatosFormularioEdicion() {
        if (!obraActual) return;
        
        // Mostrar solo la sección de información general
        const secciones = document.querySelectorAll('.seccion-form');
        secciones.forEach((seccion, index) => {
            seccion.style.display = index === 0 ? 'block' : 'none';
        });
        
        // Cargar datos
        const campos = {
            editNombre: obraActual.nombre || "",
            editFechaInicio: obraActual.fechaInicio || "",
            editUbicacion: obraActual.ubicacion || "", 
            editDuenoPredio: obraActual.duenoPredio || "",
            editPresupuesto: obraActual.presupuesto || "",
            editFechaFin: obraActual.fechaFin || "",
            editNumeroContrato: obraActual.numeroContrato || "",
            editGastoMaterial: obraActual.gastoMaterial || 0,
            editGastoTrabajadores: obraActual.gastoTrabajadores || 0
        };
        
        Object.keys(campos).forEach(id => {
            const elemento = document.getElementById(id);
            if (elemento) {
                elemento.value = campos[id];
            }
        });
    }

    function guardarCambiosObra() {
        if (!obraActual) return;
        
        // Obtener valores
        const campos = {
            nombre: document.getElementById("editNombre").value,
            fechaInicio: document.getElementById("editFechaInicio").value,
            ubicacion: document.getElementById("editUbicacion").value,
            duenoPredio: document.getElementById("editDuenoPredio").value,
            presupuesto: document.getElementById("editPresupuesto").value,
            fechaFin: document.getElementById("editFechaFin").value,
            numeroContrato: document.getElementById("editNumeroContrato").value
        };
        
        // Validaciones
        if (!campos.nombre.trim()) {
            alert("El nombre de la obra es obligatorio");
            return;
        }
        
        if (!campos.ubicacion.trim()) {
            alert("La ubicación es obligatoria");
            return;
        }
        
        if (!campos.fechaInicio) {
            alert("La fecha de inicio es obligatoria");
            return;
        }
        
        if (!campos.fechaFin) {
            alert("La fecha de finalización es obligatoria");
            return;
        }
        
        if (new Date(campos.fechaFin) <= new Date(campos.fechaInicio)) {
            alert("La fecha de finalización debe ser posterior a la fecha de inicio");
            return;
        }
        
        // Actualizar objeto obra
        Object.keys(campos).forEach(key => {
            obraActual[key] = campos[key];
        });
        
        // Guardar y actualizar
        guardarObraActualizada();
        cargarDatosObra(obraActual.id);
        
        modalEditar.style.display = "none";
        document.body.style.overflow = "auto";
        
        alert("Información actualizada correctamente");
        
        setTimeout(() => {
            actualizarInformacionProyecto();
        }, 100);
    }

    function guardarObraActualizada() {
        const obrasGuardadas = JSON.parse(localStorage.getItem("obras")) || [];
        const indice = obrasGuardadas.findIndex(o => o.id === obraActual.id);
        
        if (indice !== -1) {
            obrasGuardadas[indice] = obraActual;
            localStorage.setItem("obras", JSON.stringify(obrasGuardadas));
        }
    }

    // FUNCIONES AUXILIARES
    function formatearFecha(fechaStr) {
        if (!fechaStr) return "No definido";
        const fecha = new Date(fechaStr);
        return isNaN(fecha) ? "Fecha inválida" : fecha.toLocaleDateString();
    }

    function fechaAleatoria() {
        const hoy = new Date();
        const diasAtras = Math.floor(Math.random() * 365);
        const fecha = new Date(hoy);
        fecha.setDate(hoy.getDate() - diasAtras);
        return fecha.toLocaleDateString();
    }

    // HACER FUNCIONES GLOBALES
    window.actualizarInformacionProyecto = actualizarInformacionProyecto;
    window.actualizarGastos = actualizarGastos;
    window.cargarDatosObra = cargarDatosObra;
    
    console.log("Sistema de obra-detalle inicializado");
});