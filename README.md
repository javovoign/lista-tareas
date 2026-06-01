Integrantes: [Martin Gallegos] y [javier Caro]
Asignatura: Programación Frontend

DESCRIPCIÓN:
Aplicación simple para gestionar tareas diarias.
Permite agregar, completar, eliminar tareas y filtrarlas.

FUNCIONALIDADES:
✅ Agregar tareas (con validación)
✅ Marcar como completadas
✅ Eliminar tareas
✅ Filtrar por estado (todas/pendientes/completadas)
✅ Estadísticas en tiempo real
✅ Modo oscuro/claro

===========================================
PROMPTS USADOS CON IA
===========================================

PROMPT 1 (Para validación y seguridad):
"Hago una app de tareas simple. Necesito validar que el campo nombre no esté vacío, tenga mínimo 3 caracteres y máximo 50. También quiero prevenir que alguien ponga código malicioso como <script>. ¿Cómo lo hago?"

RESPUESTA DE IA:
Usar validación con if, mostrar mensajes de error, y limpiar el texto eliminando < y > con replace.

LO QUE IMPLEMENTAMOS:
- Función limpiarTexto() que elimina < y >
- Validación en validarFormulario()
- try-catch por si algo falla

PROMPT 2 (Para arreglos y objetos):
"Tengo un arreglo de tareas en JavaScript. Cada tarea tiene: id, nombre, prioridad, completada. ¿Cómo puedo contar cuántas están completadas sin usar for? También cómo filtro las pendientes."

RESPUESTA DE IA:
Usar .filter() para contar: tareas.filter(t => t.completada === true).length
Usar .filter() para filtrar pendientes
Usar .find() para buscar una tarea específica

LO QUE IMPLEMENTAMOS:
- actualizarEstadisticas() usa .filter()
- mostrarTareas() usa .filter() para filtrar
- alternarCompletada() usa .find()

===========================================
CRITERIOS DE EVALUACIÓN CUMPLIDOS
===========================================

✅ 2.1.1 DOM:
   - crearTarjetaTarea(): CREA elementos
   - mostrarTareas(): MODIFICA y LIMPIA el DOM
   - eliminarTarea(): ELIMINA
   - Eventos: submit, click

✅ 2.1.2 Validación:
   - validarFormulario(): campos obligatorios y longitud
   - limpiarTexto(): previene XSS
   - try-catch: manejo de errores
   - Mensajes visibles al usuario

✅ 2.1.3 Arreglos y Objetos:
   - tareas[]: arreglo principal
   - Cada tarea es un OBJETO
   - .filter() usado 2 veces
   - .find() usado 1 vez
   - .forEach() usado 1 vez

✅ 2.1.4 Modularidad:
   - Cada función hace UNA cosa
   - Funciones reutilizables
   - Código ordenado y comentado

===========================================
CÓMO EJECUTAR
===========================================
1. Descargar los 4 archivos
2. Ponerlos en una misma carpeta
3. Abrir index.html en cualquier navegador
4. ¡Listo!

===========================================
REPOSITORIO GITHUB
===========================================
