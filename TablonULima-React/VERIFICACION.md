# Verificación de la migración

## Comprobaciones ejecutadas

- `node --check src/legacy.js`: **correcto**.
- Parser y transpilación de JSX (`App.jsx` y `main.jsx`, TypeScript 5.8): **cero errores de sintaxis**.
- Pruebas de interacción en Chromium sobre el **árbol generado a partir del JSX transpilado** y la capa `legacy.js`: **sin errores JavaScript detectados**.

### Flujos comprobados

1. Pantalla de inicio y navegación al login.
2. Login del usuario de ejemplo, login del administrador y rechazo de cuenta bloqueada.
3. Navegación protegida por rol y acceso denegado al administrador en Mis publicaciones.
4. Mis publicaciones del usuario, filtros de estado, búsqueda, contadores y estado vacío de una cuenta nueva.
5. Creación de cuenta y cierre de sesión.
6. Nuevo aviso, validaciones (categoría/fotografías) y habilitación del botón Publicar tras corregir.
7. Subida de una imagen PNG real, transformación a imagen comprimida y almacenamiento en el prototipo.
8. Publicación nueva visible, cambio de estado, eliminación y persistencia local.
9. Persistencia de cambios de estado de los avisos de ejemplo tras reiniciar el contenido.
10. Edición del teléfono, validación, foto de perfil y eliminación de foto.
11. Cambio de contraseña y nuevo ingreso; recuperación de contraseña en sus tres pasos de demostración.
12. Rechazo de archivo con formato no admitido, límite de seis fotos, galería, reapertura y cancelar ediciones de fotografías.

### Límite de esta verificación

**No se ejecutó una compilación real con `npm run build` ni se arrancó el servidor de Vite con los paquetes oficiales**, porque el entorno de creación no tenía acceso al registro npm para instalar React y Vite. Se verificaron la sintaxis, el JSX transpilado y los flujos de la interfaz con un montador de prueba en Chromium; esa simulación no sustituye una prueba de ejecución sobre React real. Al descargarlo, ejecuta `npm install`, `npm run dev` y `npm run build` desde VS Code para realizar también esa validación en tu equipo.
