// ========== DATOS ==========
let tareas = [];
let filtroEstado = "todas";      // Filtro de estado (todas/pendiente/completada)
let filtroPrioridad = "todas";   // Filtro de prioridad (todas/alta/media/baja)

// ========== FUNCIONES DE SEGURIDAD ==========
function limpiarTexto(texto) {
    if (!texto) return "";
    return texto.replace(/[<>]/g, "");
}

// ========== FUNCIONES DE ESTADÍSTICAS ==========
function actualizarEstadisticas() {
    let tareasCompletadas = tareas.filter(t => t.completada === true).length;
    let tareasPendientes = tareas.filter(t => t.completada === false).length;
    
    document.getElementById("total").textContent = tareas.length;
    document.getElementById("completadas").textContent = tareasCompletadas;
    document.getElementById("pendientes").textContent = tareasPendientes;
}

// ========== OBTENER TEXTO DE PRIORIDAD ==========
function getPrioridadTexto(prioridad) {
    if (prioridad === "alta") return "🔴 ALTA - Urgente";
    if (prioridad === "media") return "🟡 MEDIA - Normal";
    return "🟢 BAJA - Baja prioridad";
}

// ========== CREAR TARJETA DE TAREA ==========
function crearTarjetaTarea(tarea) {
    let div = document.createElement("div");
    div.className = "tarea";
    if (tarea.completada) {
        div.classList.add("completada");
    }
    div.setAttribute("data-id", tarea.id);
    div.setAttribute("data-prioridad", tarea.prioridad);
    
    let nombreLimpio = limpiarTexto(tarea.nombre);
    
    div.innerHTML = `
        <div class="prioridad-banner prioridad-${tarea.prioridad}">
            ⭐ ${getPrioridadTexto(tarea.prioridad)}
        </div>
        <div class="contenido-tarea">
            <div class="nombre-tarea">📌 ${nombreLimpio}</div>
            <div class="acciones">
                <button class="btn-completar" title="Completar">${tarea.completada ? "🔄 Desmarcar" : "✅ Completar"}</button>
                <button class="btn-eliminar" title="Eliminar">🗑️ Eliminar</button>
            </div>
        </div>
    `;
    
    let btnCompletar = div.querySelector(".btn-completar");
    let btnEliminar = div.querySelector(".btn-eliminar");
    
    btnCompletar.addEventListener("click", () => alternarCompletada(tarea.id));
    btnEliminar.addEventListener("click", () => eliminarTarea(tarea.id));
    
    return div;
}

// ========== MOSTRAR TAREAS CON AMBOS FILTROS ==========
function mostrarTareas() {
    let contenedor = document.getElementById("listaTareas");
    
    // PASO 1: Filtrar por ESTADO
    let tareasFiltradas = tareas;
    if (filtroEstado === "pendiente") {
        tareasFiltradas = tareas.filter(t => t.completada === false);
    } else if (filtroEstado === "completada") {
        tareasFiltradas = tareas.filter(t => t.completada === true);
    }
    
    // PASO 2: Filtrar por PRIORIDAD (desde el sidebar)
    if (filtroPrioridad !== "todas") {
        tareasFiltradas = tareasFiltradas.filter(t => t.prioridad === filtroPrioridad);
    }
    
    // Ordenar: primero las de ALTA prioridad, luego MEDIA, luego BAJA
    tareasFiltradas.sort((a, b) => {
        const orden = { "alta": 1, "media": 2, "baja": 3 };
        return orden[a.prioridad] - orden[b.prioridad];
    });
    
    // Limpiar y mostrar
    contenedor.innerHTML = "";
    
    if (tareasFiltradas.length === 0) {
        contenedor.innerHTML = '<p class="mensaje-vacio">📭 No hay tareas que mostrar</p>';
        actualizarEstadisticas();
        return;
    }
    
    tareasFiltradas.forEach(tarea => {
        let tarjeta = crearTarjetaTarea(tarea);
        contenedor.appendChild(tarjeta);
    });
    
    actualizarEstadisticas();
}

// ========== CRUD DE TAREAS ==========
function agregarTarea(nombre, prioridad) {
    let nuevaTarea = {
        id: Date.now(),
        nombre: nombre,
        prioridad: prioridad,
        completada: false
    };
    tareas.push(nuevaTarea);
    mostrarTareas();
}

function alternarCompletada(id) {
    let tarea = tareas.find(t => t.id === id);
    if (tarea) {
        tarea.completada = !tarea.completada;
        mostrarTareas();
    }
}

function eliminarTarea(id) {
    tareas = tareas.filter(t => t.id !== id);
    mostrarTareas();
}

// ========== VALIDACIÓN DEL FORMULARIO ==========
function validarFormulario(nombre) {
    document.getElementById("errorMsg").textContent = "";
    
    if (!nombre || nombre.trim() === "") {
        document.getElementById("errorMsg").textContent = "❌ El nombre de la tarea es obligatorio";
        return false;
    }
    
    if (nombre.length < 3) {
        document.getElementById("errorMsg").textContent = "❌ El nombre debe tener al menos 3 caracteres";
        return false;
    }
    
    if (nombre.length > 50) {
        document.getElementById("errorMsg").textContent = "❌ El nombre no puede tener más de 50 caracteres";
        return false;
    }
    
    return true;
}

// ========== MANEJADOR DEL FORMULARIO ==========
function manejarSubmit(event) {
    event.preventDefault();
    
    try {
        let inputNombre = document.getElementById("nombreTarea");
        let nombre = inputNombre.value.trim();
        let prioridad = document.getElementById("prioridadTarea").value;
        
        if (validarFormulario(nombre)) {
            let nombreLimpio = limpiarTexto(nombre);
            agregarTarea(nombreLimpio, prioridad);
            inputNombre.value = "";
            inputNombre.focus();
        }
    } catch (error) {
        console.error("Error:", error);
        document.getElementById("errorMsg").textContent = "Ocurrió un error, intenta de nuevo";
    }
}

// ========== CAMBIAR FILTRO DE ESTADO ==========
function cambiarFiltroEstado(filtro) {
    filtroEstado = filtro;
    
    document.querySelectorAll(".estado-btn").forEach(btn => {
        if (btn.getAttribute("data-filtro") === filtro) {
            btn.classList.add("activo");
        } else {
            btn.classList.remove("activo");
        }
    });
    
    mostrarTareas();
}

// ========== CAMBIAR FILTRO DE PRIORIDAD (DESDE SIDEBAR) ==========
function cambiarFiltroPrioridad(prioridad) {
    filtroPrioridad = prioridad;
    
    document.querySelectorAll(".prioridad-btn").forEach(btn => {
        if (btn.getAttribute("data-prioridad") === prioridad) {
            btn.classList.add("activo");
        } else {
            btn.classList.remove("activo");
        }
    });
    
    mostrarTareas();
}

// ========== MODO OSCURO ==========
function alternarModoOscuro() {
    document.body.classList.toggle("oscuro");
    let btn = document.getElementById("btnModoOscuro");
    if (document.body.classList.contains("oscuro")) {
        btn.textContent = "☀️ Modo Claro";
    } else {
        btn.textContent = "🌙 Modo Oscuro";
    }
}

// ========== DATOS DE EJEMPLO ==========
function cargarEjemplos() {
    tareas = [
        {
            id: 1,
            nombre: "Entregar proyecto de Frontend",
            prioridad: "alta",
            completada: false
        },
        {
            id: 2,
            nombre: "Hacer la documentación del README",
            prioridad: "media",
            completada: false
        },
        {
            id: 3,
            nombre: "Revisar ejemplos de código",
            prioridad: "baja",
            completada: true
        },
        {
            id: 4,
            nombre: "Estudiar métodos de arreglos (.filter, .map)",
            prioridad: "alta",
            completada: false
        }
    ];
    mostrarTareas();
}

// ========== INICIALIZAR APLICACIÓN ==========
function iniciarApp() {
    // Formulario
    let formulario = document.getElementById("formTarea");
    formulario.addEventListener("submit", manejarSubmit);
    
    // Filtros de estado
    let botonesEstado = document.querySelectorAll(".estado-btn");
    botonesEstado.forEach(btn => {
        btn.addEventListener("click", () => {
            let filtro = btn.getAttribute("data-filtro");
            cambiarFiltroEstado(filtro);
        });
    });
    
    // Filtros de prioridad (sidebar)
    let botonesPrioridad = document.querySelectorAll(".prioridad-btn");
    botonesPrioridad.forEach(btn => {
        btn.addEventListener("click", () => {
            let prioridad = btn.getAttribute("data-prioridad");
            cambiarFiltroPrioridad(prioridad);
        });
    });
    
    // Modo oscuro
    let btnModo = document.getElementById("btnModoOscuro");
    btnModo.addEventListener("click", alternarModoOscuro);
    
    // Cargar datos de ejemplo
    cargarEjemplos();
}

document.addEventListener("DOMContentLoaded", iniciarApp);