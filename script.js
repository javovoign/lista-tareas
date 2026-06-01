// ========== DATOS ==========
let tareas = [];
let filtroEstado = "todas";
let filtroPrioridad = "todas";

// ========== FUNCIÓN PARA GUARDAR EN LOCALSTORAGE ==========
function guardarTareas() {
    // Convierte el arreglo tareas a JSON y lo guarda
    localStorage.setItem("misTareas", JSON.stringify(tareas));
    console.log("💾 Tareas guardadas:", tareas.length); // Para verificar
}

// ========== FUNCIÓN PARA CARGAR DESDE LOCALSTORAGE ==========
function cargarTareas() {
    // Intenta recuperar las tareas guardadas
    let tareasGuardadas = localStorage.getItem("misTareas");
    
    if (tareasGuardadas) {
        // Si hay tareas guardadas, las carga
        tareas = JSON.parse(tareasGuardadas);
        console.log("📂 Tareas cargadas:", tareas.length);
    } else {
        // Si es la primera vez, carga ejemplos
        console.log("🆕 Primera vez - Cargando ejemplos");
        cargarEjemplos();
    }
    
    mostrarTareas();
}

// ========== SEGURIDAD ==========
function limpiarTexto(texto) {
    if (!texto) return "";
    return texto.replace(/[<>]/g, "");
}

// ========== ESTADÍSTICAS ==========
function actualizarEstadisticas() {
    let tareasCompletadas = tareas.filter(t => t.completada === true).length;
    let tareasPendientes = tareas.filter(t => t.completada === false).length;
    let altas = tareas.filter(t => t.prioridad === "alta").length;
    let medias = tareas.filter(t => t.prioridad === "media").length;
    let bajas = tareas.filter(t => t.prioridad === "baja").length;
    
    let totalSpan = document.getElementById("total");
    let completadasSpan = document.getElementById("completadas");
    let pendientesSpan = document.getElementById("pendientes");
    let altasSpan = document.getElementById("altasCount");
    let mediasSpan = document.getElementById("mediasCount");
    let bajasSpan = document.getElementById("bajasCount");
    
    if (totalSpan) totalSpan.textContent = tareas.length;
    if (completadasSpan) completadasSpan.textContent = tareasCompletadas;
    if (pendientesSpan) pendientesSpan.textContent = tareasPendientes;
    if (altasSpan) altasSpan.textContent = altas;
    if (mediasSpan) mediasSpan.textContent = medias;
    if (bajasSpan) bajasSpan.textContent = bajas;
}

// ========== PRIORIDAD ==========
function getPrioridadTexto(prioridad) {
    if (prioridad === "alta") return "🔴 ALTA - Urgente";
    if (prioridad === "media") return "🟡 MEDIA - Normal";
    return "🟢 BAJA - Baja prioridad";
}

// ========== CREAR TARJETA ==========
function crearTarjetaTarea(tarea) {
    let div = document.createElement("div");
    div.className = "tarea";
    if (tarea.completada) div.classList.add("completada");
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
                <button class="btn-completar">${tarea.completada ? "🔄 Desmarcar" : "✅ Completar"}</button>
                <button class="btn-eliminar">🗑️ Eliminar</button>
            </div>
        </div>
    `;
    
    div.querySelector(".btn-completar").addEventListener("click", () => alternarCompletada(tarea.id));
    div.querySelector(".btn-eliminar").addEventListener("click", () => eliminarTarea(tarea.id));
    
    return div;
}

// ========== MOSTRAR TAREAS ==========
function mostrarTareas() {
    let contenedor = document.getElementById("listaTareas");
    if (!contenedor) return;
    
    // Aplicar filtros
    let tareasFiltradas = [...tareas]; // Copia del arreglo
    
    if (filtroEstado === "pendiente") {
        tareasFiltradas = tareasFiltradas.filter(t => t.completada === false);
    } else if (filtroEstado === "completada") {
        tareasFiltradas = tareasFiltradas.filter(t => t.completada === true);
    }
    
    if (filtroPrioridad !== "todas") {
        tareasFiltradas = tareasFiltradas.filter(t => t.prioridad === filtroPrioridad);
    }
    
    // Ordenar: alta, media, baja
    const ordenPrioridad = { "alta": 1, "media": 2, "baja": 3 };
    tareasFiltradas.sort((a, b) => ordenPrioridad[a.prioridad] - ordenPrioridad[b.prioridad]);
    
    // Limpiar y mostrar
    contenedor.innerHTML = "";
    
    if (tareasFiltradas.length === 0) {
        contenedor.innerHTML = '<p class="mensaje-vacio">📭 No hay tareas que mostrar</p>';
        actualizarEstadisticas();
        return;
    }
    
    tareasFiltradas.forEach(tarea => {
        contenedor.appendChild(crearTarjetaTarea(tarea));
    });
    
    actualizarEstadisticas();
}

// ========== CRUD (con localStorage) ==========
function agregarTarea(nombre, prioridad) {
    let nuevaTarea = {
        id: Date.now(),
        nombre: nombre,
        prioridad: prioridad,
        completada: false,
        fechaCreacion: new Date().toLocaleString()
    };
    
    tareas.push(nuevaTarea);
    guardarTareas();  // ← GUARDA EN LOCALSTORAGE
    mostrarTareas();
    console.log("✅ Tarea agregada y guardada:", nuevaTarea);
}

function alternarCompletada(id) {
    let tarea = tareas.find(t => t.id === id);
    if (tarea) {
        tarea.completada = !tarea.completada;
        guardarTareas();  // ← GUARDA EN LOCALSTORAGE
        mostrarTareas();
        console.log("🔄 Estado cambiado y guardado");
    }
}

function eliminarTarea(id) {
    if (confirm("¿Eliminar esta tarea?")) {
        tareas = tareas.filter(t => t.id !== id);
        guardarTareas();  // ← GUARDA EN LOCALSTORAGE
        mostrarTareas();
        console.log("🗑️ Tarea eliminada y cambio guardado");
    }
}

function completarTodas() {
    let cambiadas = false;
    tareas.forEach(t => {
        if (!t.completada) {
            t.completada = true;
            cambiadas = true;
        }
    });
    if (cambiadas) {
        guardarTareas();  // ← GUARDA EN LOCALSTORAGE
        mostrarTareas();
        console.log("✅ Todas las tareas completadas y guardadas");
    }
}

function eliminarCompletadas() {
    let completadas = tareas.filter(t => t.completada === true);
    if (completadas.length === 0) {
        alert("No hay tareas completadas para eliminar");
        return;
    }
    
    if (confirm(`¿Eliminar ${completadas.length} tarea(s) completada(s)?`)) {
        tareas = tareas.filter(t => t.completada === false);
        guardarTareas();  // ← GUARDA EN LOCALSTORAGE
        mostrarTareas();
        console.log("🗑️ Tareas completadas eliminadas y guardado");
    }
}

// ========== VALIDACIÓN ==========
function validarFormulario(nombre) {
    let errorMsg = document.getElementById("errorMsg");
    if (errorMsg) errorMsg.textContent = "";
    
    if (!nombre || nombre.trim() === "") {
        if (errorMsg) errorMsg.textContent = "❌ El nombre de la tarea es obligatorio";
        return false;
    }
    if (nombre.length < 3) {
        if (errorMsg) errorMsg.textContent = "❌ El nombre debe tener al menos 3 caracteres";
        return false;
    }
    if (nombre.length > 50) {
        if (errorMsg) errorMsg.textContent = "❌ El nombre no puede tener más de 50 caracteres";
        return false;
    }
    return true;
}

function manejarSubmit(event) {
    event.preventDefault();
    
    try {
        let inputNombre = document.getElementById("nombreTarea");
        let prioridadSelect = document.getElementById("prioridadTarea");
        
        if (!inputNombre || !prioridadSelect) return;
        
        let nombre = inputNombre.value.trim();
        let prioridad = prioridadSelect.value;
        
        if (validarFormulario(nombre)) {
            agregarTarea(limpiarTexto(nombre), prioridad);
            inputNombre.value = "";
            inputNombre.focus();
        }
    } catch (error) {
        console.error("Error:", error);
        let errorMsg = document.getElementById("errorMsg");
        if (errorMsg) errorMsg.textContent = "Ocurrió un error, intenta de nuevo";
    }
}

// ========== FILTROS ==========
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

// ========== INTERFAZ ==========
function alternarModoOscuro() {
    document.body.classList.toggle("oscuro");
    let btn = document.getElementById("btnModoOscuro");
    if (btn) {
        btn.textContent = document.body.classList.contains("oscuro") ? "☀️ Modo Claro" : "🌙 Modo Oscuro";
    }
}

// ========== DATOS DE EJEMPLO ==========
function cargarEjemplos() {
    tareas = [
        { id: 1, nombre: "Entregar proyecto Frontend", prioridad: "alta", completada: false, fechaCreacion: "Hoy" },
        { id: 2, nombre: "Hacer documentación README", prioridad: "media", completada: false, fechaCreacion: "Hoy" },
        { id: 3, nombre: "Revisar ejemplos de código", prioridad: "baja", completada: true, fechaCreacion: "Ayer" },
        { id: 4, nombre: "Estudiar métodos de arreglos", prioridad: "alta", completada: false, fechaCreacion: "Hoy" }
    ];
    guardarTareas();  // Guarda los ejemplos
}

// ========== BOTÓN PARA BORRAR LOCALSTORAGE (opcional - útil para pruebas) ==========
function borrarTodoYRecargar() {
    if (confirm("⚠️ ¿BORRAR TODAS LAS TAREAS? Esta acción no se puede deshacer")) {
        localStorage.removeItem("misTareas");
        tareas = [];
        cargarEjemplos(); // Carga ejemplos frescos
        mostrarTareas();
        console.log("🗑️ Todo borrado, ejemplos recargados");
    }
}

// ========== INICIALIZAR APLICACIÓN ==========
function iniciarApp() {
    console.log("🚀 Iniciando aplicación...");
    
    // Configurar formulario
    let formulario = document.getElementById("formTarea");
    if (formulario) {
        formulario.addEventListener("submit", manejarSubmit);
    }
    
    // Configurar botones de estado
    document.querySelectorAll(".estado-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            cambiarFiltroEstado(btn.getAttribute("data-filtro"));
        });
    });
    
    // Configurar botones de prioridad
    document.querySelectorAll(".prioridad-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            cambiarFiltroPrioridad(btn.getAttribute("data-prioridad"));
        });
    });
    
    // Configurar modo oscuro
    let btnModo = document.getElementById("btnModoOscuro");
    if (btnModo) {
        btnModo.addEventListener("click", alternarModoOscuro);
    }
    
    // Configurar botones de acciones masivas
    let btnCompletarTodas = document.getElementById("btnCompletarTodas");
    if (btnCompletarTodas) {
        btnCompletarTodas.addEventListener("click", completarTodas);
    }
    
    let btnEliminarCompletadas = document.getElementById("btnEliminarCompletadas");
    if (btnEliminarCompletadas) {
        btnEliminarCompletadas.addEventListener("click", eliminarCompletadas);
    }
    
    // Opcional: agregar botón para borrar datos (solo para pruebas)
    // Puedes agregar este botón en el HTML si quieres: <button id="btnBorrarTodo">🗑️ Borrar Todo</button>
    let btnBorrarTodo = document.getElementById("btnBorrarTodo");
    if (btnBorrarTodo) {
        btnBorrarTodo.addEventListener("click", borrarTodoYRecargar);
    }
    
    // CARGAR TAREAS DESDE LOCALSTORAGE
    cargarTareas();
    
    // Configurar fecha mínima en el input si existe
    let fechaInput = document.getElementById("fechaVencimiento");
    if (fechaInput) {
        let hoy = new Date().toISOString().split('T')[0];
        fechaInput.min = hoy;
    }
}

// Iniciar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", iniciarApp);