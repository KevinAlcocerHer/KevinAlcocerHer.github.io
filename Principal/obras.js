// JavaScript para manejar la página principal con creación de etiquetas
document.addEventListener("DOMContentLoaded", function() {
    // Elementos DOM
    const body = document.querySelector("body");
    const sidebar = body.querySelector(".sidebar");
    const toggle = body.querySelector(".toggle");
    const modeSwitch = body.querySelector(".toggle-switch");
    const modeText = body.querySelector(".mode-text");
    const menuTitles = document.querySelectorAll('.menu-title');
    
    // Elementos modales
    const openModal = document.getElementById('openModal');
    const closeModal = document.getElementById('closeModal');
    const formModal = document.getElementById('formModal');
    const formObra = formModal ? formModal.querySelector('form') : null;
    
    // Elementos para eliminar obras
    const deleteObra = document.getElementById('deleteObra');
    const deleteModal = document.getElementById('deleteModal');
    const cancelDelete = document.getElementById('cancelDelete');
    const confirmDelete = document.getElementById('confirmDelete');
    const obraSelect = document.getElementById('obraSelect');
    
    const contenedorEtiquetas = document.querySelector('.home');

    // Toggle sidebar
    if (toggle) {
        toggle.addEventListener("click", () => {
            sidebar.classList.toggle("close");
            
            // Cerrar todos los submenús cuando se cierra/abre el sidebar
            document.querySelectorAll('.nav-link.open').forEach(item => {
                item.classList.remove('open');
            });
        });
    }
    
    // Tema oscuro y claro
    if (modeSwitch) {
        modeSwitch.addEventListener("click", () => {
            body.classList.toggle("dark");
            
            if (body.classList.contains("dark")) {
                modeText.innerText = "Modo claro";
                // Guardar el modo oscuro en localStorage
                localStorage.setItem("theme", "dark");
            } else {
                modeText.innerText = "Modo oscuro";
                // Guardar el modo claro en localStorage
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
    
    // Funcionalidad para submenús verticales
    if (menuTitles && menuTitles.length > 0) {
        menuTitles.forEach(menuTitle => {
            menuTitle.addEventListener('click', function(e) {
                // Si el sidebar está cerrado, no activar el clic
                if (sidebar.classList.contains('close')) {
                    return;
                }
                
                e.preventDefault();
                const parentLi = this.parentElement;
                
                // Toggle: si ya está abierto, cerrarlo
                if (parentLi.classList.contains('open')) {
                    parentLi.classList.remove('open');
                    
                    // Ajustar altura después de cerrar
                    setTimeout(() => {
                        recalculateMenuPositions();
                    }, 10);
                } else {
                    // Cerrar cualquier otro submenú abierto
                    document.querySelectorAll('.nav-link.open').forEach(item => {
                        if (item !== parentLi) {
                            item.classList.remove('open');
                        }
                    });
                    
                    // Abrir este submenú
                    parentLi.classList.add('open');
                    
                    // Ajustar posiciones después de abrir
                    setTimeout(() => {
                        recalculateMenuPositions();
                    }, 10);
                }
            });
        });
    }
    
    // Función para recalcular posiciones del menú
    function recalculateMenuPositions() {
        // Asegurarse de que todos los elementos del menú se reposicionen correctamente
        const menuLinks = document.querySelectorAll('.menu-links > li');
        let currentPosition = 0;
        
        menuLinks.forEach(link => {
            // Si este elemento tiene un submenú abierto, ajustar su altura
            if (link.classList.contains('open')) {
                const submenu = link.querySelector('.submenu');
                if (submenu) {
                    const submenuItems = submenu.querySelectorAll('li');
                    const submenuHeight = submenuItems.length * 40 + 10; // altura de cada item + margen
                    
                    // Ajustar el espacio que ocupa el menú desplegado
                    link.style.height = `${submenuHeight + 50}px`; // altura del menú + altura del título
                }
            } else {
                // Restaurar altura normal para elementos cerrados
                link.style.height = '';
            }
        });
    }
    
    // Funcionamiento del hover cuando el sidebar está cerrado
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if (link.querySelector('.submenu')) {
            // Mostrar submenú al hover cuando el sidebar está cerrado
            link.addEventListener('mouseenter', function() {
                if (sidebar.classList.contains('close')) {
                    this.classList.add('open');
                }
            });
            
            // Ocultar al salir
            link.addEventListener('mouseleave', function() {
                if (sidebar.classList.contains('close')) {
                    this.classList.remove('open');
                }
            });
        }
    });
    
    // Cerrar submenús cuando se hace clic fuera del sidebar
    document.addEventListener('click', function(event) {
        if (!sidebar.contains(event.target) && !sidebar.classList.contains('close')) {
            document.querySelectorAll('.nav-link.open').forEach(item => {
                item.classList.remove('open');
            });
            // Restaurar posiciones después de cerrar
            setTimeout(() => {
                recalculateMenuPositions();
            }, 10);
        }
    });
    
    // Manejo del modal de agregar obra
    if (openModal && closeModal && formModal) {
        openModal.addEventListener('click', () => {
            formModal.style.display = 'flex';
        });
        
        closeModal.addEventListener('click', () => {
            formModal.style.display = 'none';
            if (formObra) formObra.reset(); // Limpia el formulario
        });
        
        window.addEventListener('click', (event) => {
            if (event.target === formModal) {
                formModal.style.display = 'none';
                if (formObra) formObra.reset(); // Limpia el formulario
            }
        });
    }
    
    // Manejo del modal de eliminar obra
    if (deleteObra && deleteModal) {
        deleteObra.addEventListener('click', () => {
            cargarObrasParaEliminar();
            deleteModal.style.display = 'flex';
        });
        
        if (cancelDelete) {
            cancelDelete.addEventListener('click', () => {
                deleteModal.style.display = 'none';
            });
        }
        
        window.addEventListener('click', (event) => {
            if (event.target === deleteModal) {
                deleteModal.style.display = 'none';
            }
        });
        
        if (confirmDelete && obraSelect) {
            confirmDelete.addEventListener('click', () => {
                const obraId = obraSelect.value;
                if (obraId) {
                    eliminarObra(obraId);
                    deleteModal.style.display = 'none';
                    
                    // Recargar la página para ver los cambios
                    setTimeout(function() {
                        window.location.reload();
                    }, 500);
                } else {
                    alert('Por favor, selecciona una obra para eliminar');
                }
            });
        }
    }
    
    // Cargar obras existentes al iniciar
    cargarObrasGuardadas();
    
    // Manejar el envío del formulario de agregar obra
    if (formObra) {
        formObra.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obtener todos los campos del formulario
            const nombre = document.getElementById('name').value;
            const fechaInicio = document.getElementById('fecha-inicio').value;
            const ubicacion = document.getElementById('ubicacion').value;
            const duenoPredio = document.getElementById('dueno-predio').value;
            const presupuesto = document.getElementById('partida-presupuestal').value;
            const fechaFin = document.getElementById('fecha-fin').value;
            const numeroContrato = document.getElementById('numero-contrato').value;
            
            // Validar que todos los campos estén completos
            if (!nombre || !fechaInicio || !ubicacion || !duenoPredio || !presupuesto || !fechaFin || !numeroContrato) {
                alert("Por favor, complete todos los campos del formulario");
                return;
            }
            
            // Validar que la fecha de fin sea posterior a la fecha de inicio
            if (new Date(fechaFin) <= new Date(fechaInicio)) {
                alert("La fecha de finalización debe ser posterior a la fecha de inicio");
                return;
            }
            
            // Crear un objeto con los datos de la obra
            const nuevaObra = {
                id: 'obra_' + Date.now(), // ID único basado en timestamp
                nombre: nombre,
                fechaInicio: fechaInicio,
                ubicacion: ubicacion,
                duenoPredio: duenoPredio,
                presupuesto: presupuesto,
                fechaFin: fechaFin,
                numeroContrato: numeroContrato,
                // Datos por defecto
                imagen: 'Obra1.png',
                gastoMaterial: 0,
                gastoTrabajadores: 0,
                actividades: [],
                finalizada: false
            };
            
            // Guardar en localStorage
            guardarObra(nuevaObra);
            
            // Cerrar el modal
            formModal.style.display = 'none';
            
            // Crear y añadir la nueva tarjeta de obra
            crearTarjetaObra(nuevaObra);
            
            // Limpiar el formulario
            formObra.reset();
            
            // Remover la etiqueta de ejemplo si existe
            const etiquetasEjemplo = document.querySelectorAll('.etiquetas');
            if (etiquetasEjemplo.length === 1) {
                etiquetasEjemplo[0].remove();
            }
        });
    }
    
    // Función para guardar una obra en localStorage
    function guardarObra(obra) {
        try {
            // Obtener obras existentes
            let obras = JSON.parse(localStorage.getItem('obras')) || [];
            
            // Añadir la nueva obra
            obras.push(obra);
            
            // Guardar en localStorage
            localStorage.setItem('obras', JSON.stringify(obras));
            
            return true;
        } catch (error) {
            console.error('Error al guardar obra:', error);
            alert('Error al guardar la obra. Por favor, intenta de nuevo.');
            return false;
        }
    }
    
    // Función para crear una tarjeta de obra y añadirla al DOM
    function crearTarjetaObra(obra) {
        // Crear una nueva sección para la etiqueta
        const seccionEtiqueta = document.createElement('section');
        seccionEtiqueta.className = 'etiquetas';
        
        // Calcular el porcentaje de progreso basado en fechas reales
        let porcentajeProgreso = 0;
        const fechaInicio = new Date(obra.fechaInicio);
        const fechaFin = obra.fechaFin ? new Date(obra.fechaFin) : new Date(fechaInicio);
        const hoy = new Date();
        
        if (fechaInicio && fechaFin && !isNaN(fechaInicio) && !isNaN(fechaFin)) {
            const totalDias = Math.floor((fechaFin - fechaInicio) / (1000 * 60 * 60 * 24));
            const diasTranscurridos = Math.floor((hoy - fechaInicio) / (1000 * 60 * 60 * 24));
            
            if (totalDias > 0) {
                porcentajeProgreso = Math.min(100, Math.max(0, (diasTranscurridos / totalDias) * 100));
            }
        }
        
        // Calcular la semana actual basada en fechas reales
        let numeroSemana = 1;
        if (fechaInicio && fechaFin && !isNaN(fechaInicio) && !isNaN(fechaFin)) {
            const totalDias = Math.floor((fechaFin - fechaInicio) / (1000 * 60 * 60 * 24));
            const diasTranscurridos = Math.floor((hoy - fechaInicio) / (1000 * 60 * 60 * 24));
            const totalSemanas = Math.ceil(totalDias / 7);
            const semanasTranscurridas = Math.ceil(diasTranscurridos / 7);
            
            numeroSemana = Math.min(totalSemanas, Math.max(1, semanasTranscurridas));
        }
        
        // Determinar el estado de la obra
        let estadoObra = "En progreso";
        let claseEstado = "";
        
        if (obra.finalizada) {
            estadoObra = "Finalizada";
            claseEstado = "obra-finalizada";
        } else if (hoy > fechaFin) {
            estadoObra = "Atrasada";
            claseEstado = "obra-atrasada";
        } else if (porcentajeProgreso >= 90) {
            estadoObra = "Por finalizar";
            claseEstado = "obra-por-finalizar";
        }
        
        // HTML para la tarjeta con todos los datos del formulario
        seccionEtiqueta.innerHTML = `
            <a href="/Principal/detalle/obra-detalle.html?id=${obra.id}" class="etiqueta ${claseEstado}">
                <div class="imagen">
                    <img src="${obra.imagen}" alt="Imagen de ${obra.nombre}">
                </div>
                <div class="descripcion">
                    <h2 class="text-t">${obra.nombre}</h2>
                    <h2 class="text-et"><i class='bx bx-calendar'></i> Inicio: ${formatearFecha(obra.fechaInicio)}</h2>
                    <h2 class="text-et"><i class='bx bx-calendar-check'></i> Fin: ${formatearFecha(obra.fechaFin)}</h2>
                    <h2 class="text-et"><i class='bx bx-map-pin'></i> Ubicación: ${obra.ubicacion}</h2>
                    <h2 class="text-et"><i class='bx bx-user'></i> Dueño: ${obra.duenoPredio}</h2>
                    <h2 class="text-et"><i class='bx bx-dollar-circle'></i> Presupuesto: ${obra.presupuesto}</h2>
                    <h2 class="text-et"><i class='bx bx-file'></i> Contrato: ${obra.numeroContrato}</h2>
                </div>
                <div class="text-final">
                    <h2 class="text-t">Semana</h2>
                    <h2 class="text-t">${numeroSemana}</h2>
                    <div class="progreso">
                        <div class="barra-progreso" style="width: ${porcentajeProgreso}%"></div>
                    </div>
                    <div class="estado-obra">
                        <span class="estado-texto">${estadoObra}</span>
                        <span class="porcentaje-texto">${Math.round(porcentajeProgreso)}%</span>
                    </div>
                </div>
            </a>
        `;
        
        // Insertar después del contenedor principal
        document.body.appendChild(seccionEtiqueta);
    }
    
    // Función para cargar obras guardadas
    function cargarObrasGuardadas() {
        try {
            const obras = JSON.parse(localStorage.getItem('obras')) || [];
            
            // Eliminar las etiquetas de ejemplo si hay obras guardadas
            if (obras.length > 0) {
                // Eliminar todas las secciones de etiquetas existentes (ejemplos)
                const etiquetasEjemplo = document.querySelectorAll('.etiquetas');
                etiquetasEjemplo.forEach(etiqueta => etiqueta.remove());
            }
            
            // Cargar cada obra guardada
            obras.forEach(obra => {
                crearTarjetaObra(obra);
            });
        } catch (error) {
            console.error('Error al cargar obras guardadas:', error);
        }
    }
    
    // Función para cargar las obras en el select para eliminar
    function cargarObrasParaEliminar() {
        if (!obraSelect) return;
        
        try {
            // Obtener obras existentes
            const obras = JSON.parse(localStorage.getItem('obras')) || [];
            
            // Limpiar el select
            obraSelect.innerHTML = '<option value="">Selecciona una obra...</option>';
            
            // Añadir cada obra como opción
            obras.forEach(obra => {
                const option = document.createElement('option');
                option.value = obra.id;
                option.textContent = obra.nombre;
                obraSelect.appendChild(option);
            });
            
            // Mostrar mensaje si no hay obras
            if (obras.length === 0) {
                obraSelect.innerHTML = '<option value="">No hay obras disponibles</option>';
                if (confirmDelete) confirmDelete.disabled = true;
            } else {
                if (confirmDelete) confirmDelete.disabled = false;
            }
        } catch (error) {
            console.error('Error al cargar obras para eliminar:', error);
            obraSelect.innerHTML = '<option value="">Error al cargar obras</option>';
            if (confirmDelete) confirmDelete.disabled = true;
        }
    }
    
    // Función para eliminar una obra
    function eliminarObra(id) {
        try {
            // Obtener obras existentes
            let obras = JSON.parse(localStorage.getItem('obras')) || [];
            
            // Filtrar la obra a eliminar
            obras = obras.filter(obra => obra.id !== id);
            
            // Guardar en localStorage
            localStorage.setItem('obras', JSON.stringify(obras));
            
            // Mostrar mensaje de éxito
            alert('Obra eliminada correctamente');
            
            return true;
        } catch (error) {
            console.error('Error al eliminar obra:', error);
            alert('Error al eliminar la obra. Por favor, intenta de nuevo.');
            return false;
        }
    }
    
    // Función auxiliar para formatear fechas
    function formatearFecha(fechaStr) {
        if (!fechaStr) return "No definido";
        
        const fecha = new Date(fechaStr);
        if (isNaN(fecha)) return "Fecha inválida";
        
        return fecha.toLocaleDateString();
    }
    
    // Marcar la página actual como activa
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage) {
        // Buscar enlaces que coincidan con la página actual
        document.querySelectorAll('.menu-links a').forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.includes(currentPage)) {
                // Si es un enlace de submenú
                if (link.closest('.submenu')) {
                    link.parentElement.classList.add('active');
                    // Abrir el submenú padre
                    const parentNavLink = link.closest('.nav-link');
                    parentNavLink.classList.add('open');
                    parentNavLink.classList.add('active');
                    
                    // Ajustar posiciones para el menú abierto
                    setTimeout(() => {
                        recalculateMenuPositions();
                    }, 10);
                } else {
                    // Si es un enlace principal
                    link.closest('.nav-link').classList.add('active');
                }
            }
        });
    }
});
