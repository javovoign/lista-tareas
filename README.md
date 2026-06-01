===========================================
TASKMASTER - Lista de Tareas
===========================================

Integrantes: Martin Gallegos y Javier Caro
Asignatura: Programación Frontend
Fecha: Junio 2026

===========================================
DESCRIPCIÓN DEL PROYECTO
===========================================

Aplicación web para gestionar tareas diarias de forma sencilla y eficiente.
Permite agregar, completar, editar, eliminar tareas y filtrarlas por estado o prioridad.
Los datos se guardan automáticamente en el navegador (localStorage) y no se pierden al cerrar la página.

===========================================
FUNCIONALIDADES PRINCIPALES
===========================================

✅ Agregar tareas (con validación y contador de caracteres)
✅ Marcar como completadas / Desmarcar
✅ Editar tareas (nombre y prioridad)
✅ Eliminar tareas individuales
✅ Borrar todas las tareas de una vez
✅ Filtrar por estado (Todas / Pendientes / Completadas)
✅ Filtrar por prioridad (Todas / Alta / Media / Baja)
✅ Estadísticas en tiempo real (total, completadas, pendientes, por prioridad)
✅ Modo oscuro / claro
✅ Mensaje de bienvenida con saludo y fecha actual
✅ Persistencia de datos con localStorage
✅ Diseño responsive (funciona en celular)

===========================================
MEJORAS ADICIONALES IMPLEMENTADAS
===========================================

1. MENSAJE DE BIENVENIDA: Muestra saludo según la hora del día (Buenos días/tardes/noches), la fecha actual y el total de tareas.

2. CONTADOR DE CARACTERES: Muestra 0/50 caracteres mientras se escribe. Cambia a color naranja al llegar a 45 y a rojo al llegar al límite de 50.

3. BOTÓN BORRAR TODO: Elimina todas las tareas de una sola vez con confirmación previa.

4. LOCALSTORAGE: Las tareas se guardan automáticamente en el navegador y no se pierden al cerrar la página.

===========================================
PROMPTS USADOS CON IA (Criterio 2.1.2 y 2.1.3)
===========================================

PROMPT 1 (Validación y seguridad):
"Hago una app de tareas simple. Necesito validar que el campo nombre no esté vacío, tenga mínimo 3 caracteres y máximo 50. También quiero prevenir que alguien ponga código malicioso como <script>. ¿Cómo lo hago?"

RESPUESTA DE IA:
Usar validación con if, mostrar mensajes de error, y limpiar el texto eliminando < y > con replace.

LO QUE IMPLEMENTAMOS:
- Función limpiarTexto() que elimina < y >
- Validación en validarFormulario()
- Bloque try-catch para manejo de errores

PROMPT 2 (Arreglos y objetos):
"Tengo un arreglo de tareas en JavaScript. Cada tarea tiene: id, nombre, prioridad, completada. ¿Cómo puedo contar cuántas están completadas sin usar for? ¿Cómo filtro las pendientes?"

RESPUESTA DE IA:
Usar .filter() para contar y filtrar, y .find() para buscar una tarea específica.

LO QUE IMPLEMENTAMOS:
- actualizarEstadisticas() usa .filter()
- mostrarTareas() usa .filter() para filtrar
- alternarCompletada() usa .find()
- eliminarTarea() usa .filter()

PROMPT 3 (localStorage):
"¿Cómo guardo las tareas para que no se pierdan al cerrar el navegador?"

RESPUESTA DE IA:
Usar localStorage con JSON.stringify() para guardar y JSON.parse() para recuperar.

LO QUE IMPLEMENTAMOS:
- guardarTareas() con setItem
- cargarTareas() con getItem

===========================================
CRITERIOS DE EVALUACIÓN CUMPLIDOS
===========================================

✅ 2.1.1 Manipulación del DOM:
   - crearTarjetaTarea(): CREA elementos dinámicamente
   - mostrarTareas(): MODIFICA y LIMPIA el DOM
   - eliminarTarea(): ELIMINA elementos
   - borrarTodo(): ELIMINA todas las tareas
   - Eventos: submit, click, input

✅ 2.1.2 Validación y Seguridad:
   - validarFormulario(): campos obligatorios y longitud (3-50)
   - limpiarTexto(): previene ataques XSS
   - try-catch: manejo de errores
   - Mensajes de error visibles en la interfaz

✅ 2.1.3 Arreglos y Objetos:
   - tareas[]: arreglo principal
   - Cada tarea es un OBJETO con id, nombre, prioridad, completada
   - .filter(): usado en estadísticas, filtros y eliminación
   - .find(): usado para buscar tarea al editar o cambiar estado
   - .forEach(): usado para recorrer tareas y renderizar
   - .sort(): usado para ordenar por prioridad

✅ 2.1.4 Modularidad y Funciones:
   - Cada función tiene una sola responsabilidad
   - Funciones reutilizables (limpiarTexto, getPrioridadTexto, etc.)
   - Código ordenado, comentado y sin duplicación (DRY)

===========================================
ESTRUCTURA DEL PROYECTO
===========================================

lista-tareas/
│
├── index.html    (Estructura de la página)
├── style.css     (Estilos y diseño responsive)
├── script.js     (Lógica y funcionalidad)
└── README.txt    (Este archivo)

===========================================
CÓMO EJECUTAR LA APLICACIÓN
===========================================

1. Descargar o clonar los 4 archivos
2. Colocarlos en una misma carpeta
3. Abrir el archivo index.html en cualquier navegador web
4. ¡Comenzar a gestionar tareas!

No se necesita internet ni servidor, todo funciona localmente.

===========================================
CÓMO VERIFICAR EL LOCALSTORAGE
===========================================

1. Abrir la aplicación
2. Presionar F12 (herramientas de desarrollador)
3. Ir a la pestaña "Application" o "Aplicación"
4. En el menú izquierdo, "Local Storage"
5. Hacer clic en la URL del proyecto
6. Se verá la clave "misTareas" con todas las tareas guardadas

===========================================
REPOSITORIO GITHUB
===========================================
https://github.com/javovoign/lista-tareas