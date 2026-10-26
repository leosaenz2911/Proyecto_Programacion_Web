# Verificación de la integración (22/10/2026)

## Verificado en el entorno de integración

- Se conservaron los archivos base no modificados de React - Grupo 4: los ajustes puntuales se limitaron a enrutamiento, navegación, contexto de sesión, página principal, datos de configuración y documentación.
- El código original de TablonULima-React(1) se mantuvo dentro de `src/modules/tablon`. Solo se adaptó su montaje en el Router, se aislaron sus búsquedas DOM por ID para que no afecten al encabezado del grupo y se agregaron enlaces a Ofertas y Calificaciones.
- **35 archivos JS/JSX** revisados con el analizador de Babel sin errores de sintaxis ni importaciones locales faltantes.
- `node --check src/modules/tablon/legacy.js`: correcto.
- Archivo de estilos encapsulados: **383 reglas CSS** analizadas con `tinycss2`, sin errores estructurales.
- Rutas presentes: `/`, `/catalogo`, `/mis-publicaciones`, `/publicar`, `/fotografias`, `/login`, `/registro`, `/recuperar`, `/mi-cuenta`, `/ofertas`, `/calificaciones`, `/admin`.
- Identificadores, llamadas a funciones del módulo de publicaciones y rutas comprobados mediante revisión estática.

## Pendiente de comprobar al ejecutarlo en una PC con npm

La instalación de dependencias y la compilación completa (`npm run build`) no pudieron ejecutarse en este entorno debido a un fallo de resolución de red para `registry.npmjs.org` y a que los `node_modules` incluidos originalmente eran binarios para Windows. La ejecución del navegador automatizado también fue bloqueada por la configuración de este entorno. **No se declara una prueba funcional end-to-end aprobada sin haberla ejecutado.**

En Windows/VS Code, tras `npm install`, ejecutar `npm run build`, `npm run dev`, y comprobar:

1. En `/login`, iniciar sesión con las credenciales de prueba del proyecto original; navegar a `/mis-publicaciones` y `/mi-cuenta` sin volver a iniciar sesión.
2. En `/mis-publicaciones`, cambiar filtros, usar el menú de Acciones, cambiar estado y eliminar (con confirmación `ELIMINAR`) verificando los contadores. Probar también sin anuncios personales.
3. En `/publicar`, rellenar los datos obligatorios y probar guardado de borrador, carga/ordenación de fotos y publicación.
4. Ir a `/ofertas`, alternar Recibidas / Enviadas y comprobar sus diálogos y filtros.
5. Ir a `/calificaciones` y comprobar sus pestañas e interacciones.
6. Cerrar sesión desde uno de los apartados y verificar que el otro bloquea las rutas restringidas.

**Nota:** Los ZIP originales contienen prototipos sin backend común. La sesión se comparte mediante `localStorage`, pero los datos de ofertas y calificaciones del grupo siguen siendo demostrativos y **no están conectados automáticamente** con los nuevos avisos. Conectar los datos entre historias requeriría una capa de datos adicional.

## Corrección de navegación duplicada (23/10/2026)

- Causa: en la integración anterior se agregó manualmente `integration-nav` dentro de `src/App.jsx` para comunicar los módulos, sin retirar las pestañas que ya proporciona `TablonApp`.
- Solución: se retiró únicamente ese elemento redundante, su importación de `Link` (ya innecesaria) y su hoja de estilos exclusiva `src/modules/tablon/integration.css`.
- Se conserva el encabezado propio de TablonApp, con Catálogo, Mis publicaciones, Ofertas, Calificaciones y Mi cuenta, así como el botón de Publicar aviso y todas las rutas originales.

## Integración del Catálogo (24/10/2026)

- Verificado: todos los imports locales de `src/` resuelven y `node --check src/modules/tablon/legacy.js` es correcto.
- **No verificado:** `npm install`, `npm run build` ni la ejecución en navegador (sin acceso a red en el entorno de integración). Pendiente de comprobar en la PC: `/catalogo` (buscar con Enter, abrir un aviso, ver perfil del vendedor), `/favoritos`, que el menú superior no se duplique y que el estilo del catálogo no altere Ofertas ni Calificaciones.

## Revisión del Catálogo contra los mockups 3.1–3.8 (24/10/2026)

**Corregido**
- Barra superior (rol Usuario): faltaba el botón **Publicar aviso** (lleva a `/publicar`). Ahora aparece junto a la insignia de rol. El visitante ve el buscador en `/catalogo` (mockup 3.4). La pestaña Catálogo sigue activa en el detalle y el perfil del vendedor.
- Catálogo (3.1): 12 resultados reales de 27 avisos de ejemplo; filtros funcionales (categoría, curso, rango de precio con control doble, estado), chips de «Filtros activos» que se quitan uno a uno, «Limpiar todo», orden (más recientes / precio) y paginación de 12 en 12. La búsqueda ignora tildes y mayúsculas.
- Sin resultados (3.2): ícono, texto, «Limpiar filtros», «Crear alerta de búsqueda» y la sección «Quizá te interese».
- Cargando (3.3): esqueletos del panel de filtros, chips, contador y 8 tarjetas.
- Detalle (3.4, 3.5, 3.6): rutas propias `/catalogo/aviso/:id`; estados de visitante, oferta activa propia (Ver el hilo / Retirar oferta / Ofertar deshabilitado) y aviso vendido (avisos similares, «Ver avisos de <curso>»). Un usuario que abre su propio aviso no ve «Ofertar».
- Favoritos (3.7): los avisos vendidos se conservan marcados como vendidos; «Quitar de favoritos», orden y estado vacío.
- Perfil del vendedor (3.8): ruta `/catalogo/vendedor/:id`, solo los avisos de ese vendedor, pestañas Todos/Activos/Vendidos funcionales.
- Sistema de diseño: se corrigieron `--color-text` (#2A211C) y `--color-error` (#B4322B), y se quitaron los placeholders rosados (#FF66AA).

**Observaciones sobre los mockups**
- En 3.1 el chip dice «S/ 40 – S/ 120», pero dos de las 12 tarjetas cuestan S/ 28 y S/ 35. Con filtros reales no pueden coexistir; el catálogo parte con el rango completo (S/ 0 – S/ 200) para mostrar los 12.
- Los conteos junto a cada categoría (48, 22, 17…) son los del mockup, no se calculan con los avisos de ejemplo.

**Verificación realizada:** el proyecto se empaquetó con esbuild y se recorrió en Chromium a 1920×1080 (capturas de las 8 vistas, filtros, orden, paginación, favoritos, retirar oferta, visitante, usuario dueño del aviso): sin errores de JavaScript. Se usó un sustituto mínimo de `react-router-dom` solo para la prueba, porque en ese entorno no había acceso a npm.
**Pendiente en la PC:** `npm install`, `npm run build` y `npm run dev` con las dependencias reales (React Router 6 y Vite).
