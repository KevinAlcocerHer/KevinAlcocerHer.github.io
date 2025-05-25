// JavaScript para el botón de finalizar obra
document.addEventListener("DOMContentLoaded", function() {
    // Elementos DOM
    const btnFinalizar = document.getElementById("btnFinalizar");
    const btnEditar = document.getElementById("btnEditar");
    const btnAgregarActividad = document.getElementById("btnAgregarActividad");
    const contenedorObra = document.querySelector(".contenedor");
    
    // Comprobar si la obra ya está finalizada
    function comprobarObraFinalizada() {
        if (obraActual && obraActual.finalizada) {
            // Aplicar estilos visuales
            contenedorObra.classList.add("obra-finalizada");
            
            // Deshabilitar botones
            btnEditar.classList.add("obra-finalizada-botones");
            btnAgregarActividad.classList.add("obra-finalizada-botones");
            btnFinalizar.classList.add("obra-finalizada-botones");
            
            // Poner la barra de progreso al 100%
            document.getElementById("obraProgreso").style.width = "100%";
            
            // Cambiar el texto del botón
            btnFinalizar.innerHTML = '<i class="bx bx-check-double"></i> Obra Finalizada';
        }
    }
    
    // Manejar el evento de finalizar obra
    btnFinalizar.addEventListener("click", function() {
        // Primera alerta de confirmación
        const confirmarPrimero = confirm("¿Está seguro que desea finalizar esta obra?");
        
        if (confirmarPrimero) {
            // Segunda alerta de confirmación
            const confirmarSegundo = confirm("Esta acción no se puede deshacer. ¿Desea continuar?");
            
            if (confirmarSegundo) {
                finalizarObra();
            }
        }
    });
    
    // Función para finalizar la obra
    function finalizarObra() {
        if (!obraActual) return;
        
        // Actualizar objeto obra
        obraActual.finalizada = true;
        obraActual.fechaFin = new Date().toISOString().split('T')[0]; // Fecha actual
        
        // Guardar en localStorage
        guardarObraActualizada();
        
        // Aplicar estilos visuales
        contenedorObra.classList.add("obra-finalizada");
        
        // Deshabilitar botones
        btnEditar.classList.add("obra-finalizada-botones");
        btnAgregarActividad.classList.add("obra-finalizada-botones");
        btnFinalizar.classList.add("obra-finalizada-botones");
        
        // Poner la barra de progreso al 100%
        document.getElementById("obraProgreso").style.width = "100%";
        document.getElementById("obraSemana").textContent = calcularSemanas(); // Actualizar semana
        
        // Cambiar el texto del botón
        btnFinalizar.innerHTML = '<i class="bx bx-check-double"></i> Obra Finalizada';
        
        // Mostrar mensaje de éxito
        alert("¡Obra finalizada con éxito!");
    }
    
    // Calcular semanas totales del proyecto
    function calcularSemanas() {
        if (!obraActual || !obraActual.fechaInicio) return "1";
        
        const inicio = new Date(obraActual.fechaInicio);
        const fin = obraActual.fechaFin ? new Date(obraActual.fechaFin) : new Date();
        
        const diasTotales = Math.floor((fin - inicio) / (1000 * 60 * 60 * 24));
        return Math.ceil(diasTotales / 7) || 1; // Mínimo 1 semana
    }
    
    // Modificar la función existente para guardar la obra actualizada
    function guardarObraActualizada() {
        // Obtener todas las obras del localStorage
        const obrasGuardadas = JSON.parse(localStorage.getItem("obras")) || [];
        
        // Encontrar el índice de la obra actual
        const indice = obrasGuardadas.findIndex(o => o.id === obraActual.id);
        
        if (indice !== -1) {
            // Reemplazar la obra
            obrasGuardadas[indice] = obraActual;
            
            // Guardar de nuevo en localStorage
            localStorage.setItem("obras", JSON.stringify(obrasGuardadas));
        }
    }
    
    // Cuando se carga la obra, comprobar si ya está finalizada
    const cargarDatosObraOriginal = window.cargarDatosObra;
    
    window.cargarDatosObra = function(id) {
        // Llamar a la función original
        if (typeof cargarDatosObraOriginal === 'function') {
            cargarDatosObraOriginal(id);
        }
        
        // Comprobar si la obra está finalizada
        comprobarObraFinalizada();
    };
    
    // Verificar al cargar la página
    if (typeof obraActual !== 'undefined' && obraActual) {
        comprobarObraFinalizada();
    }
});
