// ========== DATOS ==========
let tareas = [];
let filtroEstado = "todas";
let filtroPrioridad = "todas";
let tareaEditandoId = null;

// ========== LOCALSTORAGE ==========
function guardarTareas() {
    localStorage.setItem("misTareas", JSON.stringify(tareas));
}

function cargarTareas() {
    let tareasGuardadas = localStorage.getItem("misTareas");
    if (tareasGuardadas && tareasGuardadas !== "[]") {
        tareas = JSON.parse(tareasGuardadas);
    } else {
        cargarEjemplos();
    }
    mostrarTareas();
}

// ========== SEGURIDAD (PREVENIR XSS) ==========
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

// ========== MEJORA 1: MENSAJE DE BIENVENIDA CON FECHA ==========
function mostrarBienvenida() {
    let fecha = new Date();
    let opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let fechaFormateada = fecha.toLocaleDateString('es-ES', opciones);
    let hora = fecha.getHours();
    let saludo = "";
    
    if (hora < 12) saludo = "🌅 Buenos días";
    else if (hora < 18) saludo = "🌞 Buenas tardes";
    else saludo = "🌙 Buenas noches";
    
    let dia = fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1);
    
    let bienvenida = document.getElementById("bienvenida");
    if (bienvenida) {
        bienvenida.innerHTML = `${saludo} 👋 ¡${dia}! Tienes <strong>${tareas.length}</strong> tarea(s) en total`;
    }
}

// ========== MEJORA 2: CONTADOR DE CARACTERES ==========
function iniciarContadorCaracteres() {
    let input = document.getElementById("nombreTarea");
    let contador = document.getElementById("contadorCaracteres");
    
    if (!input || !contador) return;
    
    input.addEventListener("input", () => {
        let longitud = input.value.length;
        let maximo = 50;
        
        contador.textContent = `${longitud}/${maximo} caracteres`;
        
        if (longitud >= maximo) {
            contador.className = "contador peligro";
            contador.textContent = `⚠️ ${longitud}/${maximo} - Límite alcanzado`;
        } else if (longitud >= maximo - 5) {
            contador.className = "contador advertencia";
        } else {
            contador.className = "contador normal";
        }
    });
}

// ========== MEJORA 3: BORRAR TODAS LAS TAREAS ==========
function borrarTodo() {
    if (tareas.length === 0) {
        alert("📭 No hay tareas para borrar");
        return;
    }
    
    if (confirm(`⚠️ ¿Estás seguro? Se eliminarán ${tareas.length} tarea(s). Esta acción no se puede deshacer.`)) {
        tareas = [];
        guardarTareas();
        mostrarTareas();
        mostrarBienvenida();
        alert("✅ Todas las tareas fueron eliminadas");
    }
}

// ========== PRIORIDAD ==========
function getPrioridadTexto(prioridad) {
    if (prioridad === "alta") return "🔴 ALTA - Urgente";
    if (prioridad === "media") return "🟡 MEDIA - Normal";
    return "🟢 BAJA - Baja prioridad";
}

// ========== CREAR TARJETA DE TAREA ==========
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
                <button class="btn-completar" title="Completar/Desmarcar">${tarea.completada ? "🔄" : "✅"}</button>
                <button class="btn-editar" title="Editar tarea">✏️</button>
                <button class="btn-eliminar" title="Eliminar tarea">🗑️</button>
            </div>
        </div>
    `;
    
    div.querySelector(".btn-completar").addEventListener("click", (e) => {
        e.stopPropagation();
        alternarCompletada(tarea.id);
    });
    div.querySelector(".btn-editar").addEventListener("click", (e) => {
        e.stopPropagation();
        abrirModalEditar(tarea.id);
    });
    div.querySelector(".btn-eliminar").addEventListener("click", (e) => {
        e.stopPropagation();
        eliminarTarea(tarea.id);
    });
    
    return div;
}

// ========== MOSTRAR TAREAS EN PANTALLA ==========
function mostrarTareas() {
    let contenedor = document.getElementById("listaTareas");
    if (!contenedor) return;
    
    let tareasFiltradas = [...tareas];
    
    if (filtroEstado === "pendiente") {
        tareasFiltradas = tareasFiltradas.filter(t => t.completada === false);
    } else if (filtroEstado === "completada") {
        tareasFiltradas = tareasFiltradas.filter(t => t.completada === true);
    }
    
    if (filtroPrioridad !== "todas") {
        tareasFiltradas = tareasFiltradas.filter(t => t.prioridad === filtroPrioridad);
    }
    
    const ordenPrioridad = { "alta": 1, "media": 2, "baja": 3 };
    tareasFiltradas.sort((a, b) => ordenPrioridad[a.prioridad] - ordenPrioridad[b.prioridad]);
    
    contenedor.innerHTML = "";
    
    if (tareasFiltradas.length === 0) {
        contenedor.innerHTML = '<p class="mensaje-vacio">📭 No hay tareas que mostrar</p>';
        actualizarEstadisticas();
        mostrarBienvenida();
        return;
    }
    
    tareasFiltradas.forEach(tarea => {
        contenedor.appendChild(crearTarjetaTarea(tarea));
    });
    
    actualizarEstadisticas();
    mostrarBienvenida();
}

// ========== CRUD ==========
function agregarTarea(nombre, prioridad) {
    let nuevaTarea = {
        id: Date.now(),
        nombre: nombre,
        prioridad: prioridad,
        completada: false
    };
    tareas.push(nuevaTarea);
    guardarTareas();
    mostrarTareas();
}

function alternarCompletada(id) {
    let tarea = tareas.find(t => t.id === id);
    if (tarea) {
        tarea.completada = !tarea.completada;
        guardarTareas();
        mostrarTareas();
    }
}

function eliminarTarea(id) {
    if (confirm("¿Eliminar esta tarea?")) {
        tareas = tareas.filter(t => t.id !== id);
        guardarTareas();
        mostrarTareas();
    }
}

// ========== EDITAR TAREA (MODAL) ==========
function abrirModalEditar(id) {
    let tarea = tareas.find(t => t.id === id);
    if (!tarea) return;
    
    tareaEditandoId = id;
    
    let editNombre = document.getElementById("editNombre");
    let editPrioridad = document.getElementById("editPrioridad");
    
    if (editNombre) editNombre.value = tarea.nombre;
    if (editPrioridad) editPrioridad.value = tarea.prioridad;
    
    let modal = document.getElementById("modalEditar");
    if (modal) modal.style.display = "flex";
}

function guardarEdicion() {
    if (tareaEditandoId === null) return;
    
    let editNombre = document.getElementById("editNombre");
    let editPrioridad = document.getElementById("editPrioridad");
    
    let nuevoNombre = editNombre ? editNombre.value.trim() : "";
    let nuevaPrioridad = editPrioridad ? editPrioridad.value : "media";
    
    if (!nuevoNombre || nuevoNombre === "") {
        alert("❌ El nombre no puede estar vacío");
        return;
    }
    if (nuevoNombre.length < 3) {
        alert("❌ El nombre debe tener al menos 3 caracteres");
        return;
    }
    
    let tarea = tareas.find(t => t.id === tareaEditandoId);
    if (tarea) {
        tarea.nombre = limpiarTexto(nuevoNombre);
        tarea.prioridad = nuevaPrioridad;
        guardarTareas();
        mostrarTareas();
    }
    
    cerrarModal();
}

function cerrarModal() {
    let modal = document.getElementById("modalEditar");
    if (modal) modal.style.display = "none";
    tareaEditandoId = null;
}

// ========== ACCIONES MASIVAS ==========
function completarTodas() {
    let cambiadas = false;
    tareas.forEach(t => {
        if (!t.completada) {
            t.completada = true;
            cambiadas = true;
        }
    });
    if (cambiadas) {
        guardarTareas();
        mostrarTareas();
    } else {
        alert("Todas las tareas ya están completadas");
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
        guardarTareas();
        mostrarTareas();
    }
}

// ========== VALIDACIÓN DEL FORMULARIO ==========
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
            let contador = document.getElementById("contadorCaracteres");
            if (contador) contador.textContent = "0/50 caracteres";
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

// ========== MODO OSCURO ==========
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
        { id: 1, nombre: "Entregar proyecto Frontend", prioridad: "alta", completada: false },
        { id: 2, nombre: "Hacer documentación README", prioridad: "media", completada: false },
        { id: 3, nombre: "Revisar ejemplos de código", prioridad: "baja", completada: true },
        { id: 4, nombre: "Estudiar métodos de arreglos", prioridad: "alta", completada: false }
    ];
    guardarTareas();
}

// ========== INICIALIZAR APLICACIÓN ==========
function iniciarApp() {
    console.log("🚀 TaskMaster iniciado");
    
    let formulario = document.getElementById("formTarea");
    if (formulario) formulario.addEventListener("submit", manejarSubmit);
    
    document.querySelectorAll(".estado-btn").forEach(btn => {
        btn.addEventListener("click", () => cambiarFiltroEstado(btn.getAttribute("data-filtro")));
    });
    
    document.querySelectorAll(".prioridad-btn").forEach(btn => {
        btn.addEventListener("click", () => cambiarFiltroPrioridad(btn.getAttribute("data-prioridad")));
    });
    
    let btnModo = document.getElementById("btnModoOscuro");
    if (btnModo) btnModo.addEventListener("click", alternarModoOscuro);
    
    let btnCompletarTodas = document.getElementById("btnCompletarTodas");
    if (btnCompletarTodas) btnCompletarTodas.addEventListener("click", completarTodas);
    
    let btnEliminarCompletadas = document.getElementById("btnEliminarCompletadas");
    if (btnEliminarCompletadas) btnEliminarCompletadas.addEventListener("click", eliminarCompletadas);
    
    let btnBorrarTodo = document.getElementById("btnBorrarTodo");
    if (btnBorrarTodo) btnBorrarTodo.addEventListener("click", borrarTodo);
    
    let btnGuardarEdit = document.getElementById("btnGuardarEdit");
    if (btnGuardarEdit) btnGuardarEdit.addEventListener("click", guardarEdicion);
    
    let btnCancelarEdit = document.getElementById("btnCancelarEdit");
    if (btnCancelarEdit) btnCancelarEdit.addEventListener("click", cerrarModal);
    
    let modal = document.getElementById("modalEditar");
    if (modal) {
        window.addEventListener("click", (e) => {
            if (e.target === modal) cerrarModal();
        });
    }
    
    iniciarContadorCaracteres();
    cargarTareas();
    mostrarBienvenida();
}

document.addEventListener("DOMContentLoaded", iniciarApp);