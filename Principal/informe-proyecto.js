// JavaScript para la sección de Información del Proyecto y generación de PDF
document.addEventListener("DOMContentLoaded", function() {
    // Elementos DOM
    const btnDescargarPDF = document.getElementById("btnDescargarPDF");
    
    // Verificar que el botón existe
    if (btnDescargarPDF) {
        btnDescargarPDF.addEventListener("click", generarPDF);
    }
    
    // Cargar datos de la obra en la sección de información del proyecto
    actualizarInformacionProyecto();
    
    // Exponer la función para que pueda ser llamada desde otros scripts
    window.actualizarInformacionProyecto = actualizarInformacionProyecto;
    
    // Función para actualizar la información del proyecto
    function actualizarInformacionProyecto() {
        // Verificar si tenemos la información de la obra actual
        if (!window.obraActual) {
            console.log("No se encontró información de la obra actual");
            return;
        }
        
        const obra = window.obraActual;
        console.log("Actualizando información del proyecto:", obra);
        
        try {
            // Actualizar el resumen del proyecto
            if (document.getElementById("proyectoTipo")) {
                document.getElementById("proyectoTipo").textContent = obtenerTipoObra(obra.nombre);
            }
            if (document.getElementById("proyectoUbicacion")) {
                document.getElementById("proyectoUbicacion").textContent = obra.ubicacion || "ubicación no especificada";
            }
            if (document.getElementById("proyectoNumeroContrato")) {
                document.getElementById("proyectoNumeroContrato").textContent = obra.numeroContrato ? obra.numeroContrato : "sin número asignado";
            }
            if (document.getElementById("proyectoPresupuesto")) {
                document.getElementById("proyectoPresupuesto").textContent = obra.presupuesto || "$0";
            }
            if (document.getElementById("proyectoFechaInicio")) {
                document.getElementById("proyectoFechaInicio").textContent = formatearFecha(obra.fechaInicio) || "fecha no especificada";
            }
            
            // Obtener número de semana actual
            const semanaElement = document.getElementById("obraSemana");
            if (semanaElement && document.getElementById("proyectoSemana")) {
                const semanaActual = semanaElement.textContent;
                document.getElementById("proyectoSemana").textContent = semanaActual;
            }
            
            // Actualizar información financiera
            const presupuesto = convertirANumero(obra.presupuesto) || 0;
            const gastoMaterial = obra.gastoMaterial || 0;
            const gastoTrabajadores = obra.gastoTrabajadores || 0;
            const totalGastado = gastoMaterial + gastoTrabajadores;
            const restante = presupuesto - totalGastado;
            const porcentajeGastado = presupuesto > 0 ? Math.min(100, Math.round((totalGastado / presupuesto) * 100)) : 0;
            
            if (document.getElementById("financieroPresupuesto")) {
                document.getElementById("financieroPresupuesto").textContent = formatearDinero(presupuesto);
            }
            if (document.getElementById("financieroMateriales")) {
                document.getElementById("financieroMateriales").textContent = formatearDinero(gastoMaterial);
            }
            if (document.getElementById("financieroTrabajadores")) {
                document.getElementById("financieroTrabajadores").textContent = formatearDinero(gastoTrabajadores);
            }
            if (document.getElementById("financieroTotalGastado")) {
                document.getElementById("financieroTotalGastado").textContent = formatearDinero(totalGastado);
            }
            if (document.getElementById("financieroRestante")) {
                document.getElementById("financieroRestante").textContent = formatearDinero(restante);
            }
            if (document.getElementById("financieroPorcentaje")) {
                document.getElementById("financieroPorcentaje").textContent = porcentajeGastado + "%";
            }
            
            // Actualizar barra de progreso financiero
            const barraGastado = document.getElementById("barraGastado");
            if (barraGastado) {
                barraGastado.style.width = porcentajeGastado + "%";
                
                // Establecer color de la barra según el porcentaje
                if (porcentajeGastado > 90) {
                    barraGastado.style.backgroundColor = "#e74c3c"; // Rojo si está casi agotado
                } else if (porcentajeGastado > 70) {
                    barraGastado.style.backgroundColor = "#f39c12"; // Naranja si está en advertencia
                }
            }
        } catch (error) {
            console.error("Error al actualizar información del proyecto:", error);
        }
    }
    
    // Función para generar y descargar el PDF
    function generarPDF() {
        console.log("Iniciando generación de PDF...");
        
        // Verificar si jsPDF está disponible
        if (typeof window.jspdf === 'undefined') {
            console.log("La librería jsPDF no está disponible, cargando dinámicamente...");
            
            // Cargar jsPDF y html2canvas dinámicamente
            loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js')
                .then(() => {
                    console.log("jsPDF cargado correctamente");
                    return loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
                })
                .then(() => {
                    console.log("html2canvas cargado correctamente");
                    // Una vez cargadas ambas librerías, proceder con la generación del PDF
                    generarContenidoPDF();
                })
                .catch(error => {
                    console.error("Error al cargar librerías:", error);
                    alert("Error al cargar las librerías necesarias para generar el PDF. Por favor, intente de nuevo.");
                });
        } else {
            // Si ya está disponible, generar directamente
            console.log("Las librerías ya están cargadas, generando PDF...");
            generarContenidoPDF();
        }
    }
    
    // Función auxiliar para cargar scripts dinámicamente
    function loadScript(url) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = url;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
    
    // Función para generar el contenido del PDF
    // Función para generar el contenido del PDF con información detallada de actividades
function generarContenidoPDF() {
    // Verificar si tenemos la información de la obra actual
    if (!window.obraActual) {
        alert("No se ha cargado correctamente la información de la obra");
        return;
    }
    
    try {
        const obra = window.obraActual;
        
        // Verificar que jsPDF esté disponible en el objeto window
        if (!window.jspdf) {
            alert("No se pudo cargar la librería jsPDF. Por favor, recargue la página e intente de nuevo.");
            return;
        }
        
        const { jsPDF } = window.jspdf;
        
        // Crear nuevo documento PDF
        const doc = new jsPDF('p', 'mm', 'a4');
        
        // Configuración de fuentes y colores
        doc.setFont("helvetica", "bold");
        doc.setFontSize(20);
        doc.setTextColor(33, 33, 33);
        
        // Logotipo y encabezado
        doc.text("TecnoBuild", 15, 15);
        doc.setDrawColor(212, 163, 115); // Color primario
        doc.setLineWidth(0.5);
        doc.line(15, 17, 195, 17);
        
        // Título del documento
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text(`Informe del Proyecto: ${obra.nombre}`, 15, 25);
        
        // Fecha de impresión
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        const fechaActual = new Date().toLocaleDateString();
        doc.text(`Fecha de impresión: ${fechaActual}`, 150, 25);
        
        // Información general
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text("Información General", 15, 35);
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.text(`Ubicación: ${obra.ubicacion || "No especificada"}`, 20, 45);
        doc.text(`Dueño del predio: ${obra.duenoPredio || "No especificado"}`, 20, 52);
        doc.text(`Número de contrato: ${obra.numeroContrato || "No asignado"}`, 20, 59);
        doc.text(`Presupuesto: ${obra.presupuesto || "$0"}`, 20, 66);
        doc.text(`Fecha de inicio: ${formatearFecha(obra.fechaInicio) || "No especificada"}`, 20, 73);
        
        // Progreso del proyecto
        const semanaElement = document.getElementById("obraSemana");
        const semanaActual = semanaElement ? semanaElement.textContent : "0";
        doc.text(`Progreso: Semana ${semanaActual}`, 20, 80);
        
        // Información Financiera
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text("Estado Financiero", 15, 95);
        
        // Información financiera actual
        const presupuesto = convertirANumero(obra.presupuesto) || 0;
        const gastoMaterial = obra.gastoMaterial || 0;
        const gastoTrabajadores = obra.gastoTrabajadores || 0;
        const totalGastado = gastoMaterial + gastoTrabajadores;
        const restante = presupuesto - totalGastado;
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.text(`Presupuesto asignado: ${formatearDinero(presupuesto)}`, 20, 105);
        doc.text(`Gasto en materiales: ${formatearDinero(gastoMaterial)}`, 20, 112);
        doc.text(`Gasto en trabajadores: ${formatearDinero(gastoTrabajadores)}`, 20, 119);
        doc.text(`Total gastado: ${formatearDinero(totalGastado)}`, 20, 126);
        doc.text(`Presupuesto restante: ${formatearDinero(restante)}`, 20, 133);
        
        // Actividades (Tabla mejorada con más detalles)
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text("Registro de Actividades", 15, 150);
        
        // Encabezados de tabla mejorados
        const headers = ["Tipo de Actividad", "Fecha", "Detalles", "Gasto", "Estado"];
        const data = [];
        
        // Añadir datos de actividades si están disponibles
        if (obra.actividades && obra.actividades.length > 0) {
            obra.actividades.forEach(act => {
                // Preparar los detalles según el tipo de actividad
                let detalles = "";
                
                if (act.tipo === "Entrada de Material") {
                    detalles = `Material: ${act.tipoMaterial || "No especificado"} (${act.cantidad || ""})`;
                } else if (act.tipo === "Lista Raya") {
                    const numTrabajadores = act.trabajadores ? act.trabajadores.length : 0;
                    detalles = `Trabajadores: ${numTrabajadores}`;
                } else if (act.tipo === "Entrada Herramienta") {
                    const numHerramientas = act.herramientas ? act.herramientas.length : 0;
                    detalles = `Herramientas: ${numHerramientas}`;
                }
                
                data.push([
                    act.tipo || "No especificado",
                    formatearFecha(act.fecha) || "Sin fecha",
                    detalles,
                    formatearDinero(act.gasto || 0),
                    act.estado || "En progreso"
                ]);
            });
        } else {
            // Intentar obtener datos de las actividades mostradas en la página
            try {
                // Actividad 1: Entrada de Material
                const fechaEntrada = document.getElementById("fechaEntrada");
                const recibio = document.getElementById("recibio");
                const cantidad = document.getElementById("cantidad");
                if (fechaEntrada && recibio && cantidad) {
                    data.push([
                        "Entrada de Material",
                        fechaEntrada.textContent.replace("Fecha de entrada: ", ""),
                        `Recibió: ${recibio.textContent.replace("Recibió: ", "")} - Cantidad: ${cantidad.textContent.replace("Cantidad: ", "")}`,
                        "No registrado",
                        "Completado"
                    ]);
                }
                
                // Actividad 2: Lista raya
                const fechaCorte = document.getElementById("fechaCorte");
                const responsablePagar = document.getElementById("responsablePagar");
                const pagado = document.getElementById("pagado");
                if (fechaCorte && responsablePagar && pagado) {
                    // Obtener lista de trabajadores si existe
                    let numTrabajadores = "No disponible";
                    const listaTrabajadores = document.getElementById("listaTrabajadores");
                    if (listaTrabajadores) {
                        const trabajadores = listaTrabajadores.querySelectorAll("li");
                        numTrabajadores = trabajadores.length.toString();
                    }
                    
                    data.push([
                        "Lista raya",
                        fechaCorte.textContent.replace("Fecha de corte: ", ""),
                        `Trabajadores: ${numTrabajadores}`,
                        "No registrado",
                        pagado.textContent.replace("Pagado: ", "") === "Sí" ? "Completado" : "Pendiente"
                    ]);
                }
                
                // Actividad 3: Entrada Herramienta
                const fechaEntrega = document.getElementById("fechaEntrega");
                const responsableEntrega = document.getElementById("responsableEntrega");
                if (fechaEntrega && responsableEntrega) {
                    // Obtener lista de herramientas si existe
                    let numHerramientas = "No disponible";
                    const listaHerramientas = document.getElementById("listaHerramientas");
                    if (listaHerramientas) {
                        const herramientas = listaHerramientas.querySelectorAll("li");
                        numHerramientas = herramientas.length.toString();
                    }
                    
                    data.push([
                        "Entrada Herramienta",
                        fechaEntrega.textContent.replace("Fecha de entrega: ", ""),
                        `Herramientas: ${numHerramientas}`,
                        "No registrado",
                        "Completado"
                    ]);
                }
            } catch (error) {
                console.error("Error al obtener datos de actividades:", error);
                // Si hay error, agregar al menos una fila
                data.push([
                    "Sin actividades registradas",
                    fechaActual,
                    "No hay detalles disponibles",
                    "$0.00",
                    "N/A"
                ]);
            }
        }
        
        // Asegurarse de que hay al menos una actividad para mostrar
        if (data.length === 0) {
            data.push([
                "Sin actividades registradas",
                fechaActual,
                "No hay detalles disponibles",
                "$0.00",
                "N/A"
            ]);
        }
        
        // Dibujar tabla de actividades
        doc.setFontSize(9); // Tamaño de fuente más pequeño para que quepa más información
        doc.setTextColor(33, 33, 33);
        
        // Configuración de tabla mejorada
        const startY = 155;
        const cellWidth = 38; // Ancho de celda ajustado para 5 columnas
        const cellHeight = 10;
        let currentY = startY;
        
        // Dibujar encabezados
        doc.setFont("helvetica", "bold");
        doc.setFillColor(240, 240, 240);
        doc.rect(15, currentY, cellWidth * 5, cellHeight, 'F');
        
        for (let i = 0; i < headers.length; i++) {
            doc.text(headers[i], 15 + (i * cellWidth) + 3, currentY + 7);
        }
        currentY += cellHeight;
        
        // Dibujar filas de datos
        doc.setFont("helvetica", "normal");
        for (let i = 0; i < data.length; i++) {
            // Alternar color de fondo para las filas
            if (i % 2 === 0) {
                doc.setFillColor(250, 250, 250);
                doc.rect(15, currentY, cellWidth * 5, cellHeight, 'F');
            }
            
            // Dibujar borde de la fila
            doc.setDrawColor(200, 200, 200);
            doc.rect(15, currentY, cellWidth * 5, cellHeight);
            
            // Dibujar contenido de la celda
            for (let j = 0; j < data[i].length; j++) {
                // Acortar texto si es demasiado largo
                let texto = data[i][j] || "";
                if (texto.length > 18) {
                    texto = texto.substring(0, 15) + "...";
                }
                doc.text(texto, 15 + (j * cellWidth) + 3, currentY + 7);
            }
            currentY += cellHeight;
        }
        
        // Total de gastos al final
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(33, 33, 33);
        doc.text(`TOTAL DE GASTOS HASTA EL MOMENTO: ${formatearDinero(totalGastado)}`, 15, currentY + 15);
        
        // Pie de página
        const pageCount = doc.internal.getNumberOfPages();
        doc.setFont("helvetica", "italic");
        doc.setFontSize(8);
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.text("TecnoBuild - Sistema de Gestión de Obras", 15, 285);
            doc.text(`Página ${i} de ${pageCount}`, 180, 285);
        }
        
        // Guardar PDF con un nombre seguro
        const nombreArchivo = `Informe_${(obra.nombre || "Obra").replace(/[^a-zA-Z0-9]/g, "_")}_${fechaActual.replace(/\//g, "-")}.pdf`;
        console.log("Guardando PDF con nombre:", nombreArchivo);
        doc.save(nombreArchivo);
        
        console.log("PDF generado correctamente");
    } catch (error) {
        console.error("Error al generar PDF:", error);
        alert("Ocurrió un error al generar el PDF. Por favor, intente de nuevo.");
    }
}
    
    // Función auxiliar para obtener el tipo de obra basado en el nombre
    function obtenerTipoObra(nombre) {
        if (!nombre) return "una edificación";
        
        const nombreLower = nombre.toLowerCase();
        if (nombreLower.includes("casa")) return "una casa residencial";
        if (nombreLower.includes("edificio")) return "un edificio";
        if (nombreLower.includes("local")) return "un local comercial";
        if (nombreLower.includes("oficina")) return "una oficina";
        if (nombreLower.includes("nave")) return "una nave industrial";
        if (nombreLower.includes("puente")) return "un puente";
        if (nombreLower.includes("carretera")) return "una carretera";
        
        return "una construcción";
    }
    
    // Función auxiliar para formatear fechas
    function formatearFecha(fechaStr) {
        if (!fechaStr) return "";
        
        try {
            const fecha = new Date(fechaStr);
            if (isNaN(fecha.getTime())) return "Fecha inválida";
            
            return fecha.toLocaleDateString();
        } catch (error) {
            console.error("Error al formatear fecha:", error);
            return "Fecha inválida";
        }
    }
    
    // Función para convertir un string de dinero a número
    function convertirANumero(dineroStr) {
        if (!dineroStr) return 0;
        
        try {
            // Quitar símbolo de moneda y cualquier otro carácter no numérico excepto el punto decimal
            return parseFloat(dineroStr.toString().replace(/[^\d.]/g, '')) || 0;
        } catch (error) {
            console.error("Error al convertir a número:", error);
            return 0;
        }
    }
    
    // Función para formatear dinero
    function formatearDinero(cantidad) {
        try {
            return '$' + cantidad.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        } catch (error) {
            console.error("Error al formatear dinero:", error);
            return "$0.00";
        }
    }
});