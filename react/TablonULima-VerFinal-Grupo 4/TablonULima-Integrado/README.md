# Tablón ULima — Proyecto React integrado

Esta entrega combina los dos ZIP originales en **una sola aplicación React y Vite**, manteniendo separadas las historias para reducir cambios de comportamiento:

- `src/pages/auth`, `src/components/auth`, `src/context`, `src/services`: registro, inicio/cierre de sesión, recuperación de contraseña y perfil, procedentes de **React - Grupo 4**.
- `src/components/Ofertas`: HU de **Ofertas** del primer ZIP.
- `src/pages/ratings`: HU de **Calificaciones** del primer ZIP.
- `src/pages/catalogo`: **Catálogo de Carlos** (catálogo, filtros, detalle, perfil del vendedor y favoritos), procedente de `Proyecto_Programacion_Web-Carlos`.
- `src/modules/tablon/TablonApp.jsx`, `legacy.js`, `tablon.css`: HU2 **Mis publicaciones, crear aviso, fotografías, filtros, edición, estados y eliminación**, procedentes de **TablonULima-React(1)**.
- `src/App.jsx`: rutas compartidas y montaje de los módulos sin duplicar el menú; `src/modules/tablon/tablon.css` mantiene los estilos originales del tablón encapsulados.

## Windows / VS Code

1. Extrae este ZIP y abre **TablonULima-Integrado** en VS Code.
2. Abre **Terminal > Nueva terminal** dentro de esa carpeta.
3. Ejecuta `npm install` (requiere Node.js).
4. Ejecuta `npm run dev` y abre el enlace indicado por Vite (normalmente `http://localhost:5173`).
5. Para compilar: `npm run build`. Para revisar la sintaxis del módulo original: `npm run check`.

## Rutas disponibles

| Ruta | Módulo |
| --- | --- |
| `/` | Portada del grupo |
| `/catalogo` | Catálogo (módulo de Carlos): búsqueda, detalle de aviso y perfil del vendedor |
| `/favoritos` | Favoritos del catálogo (solo rol USUARIO) |
| `/mis-publicaciones` | Listado de avisos, filtros, acciones y eliminación |
| `/publicar` | Crear o editar aviso (requiere usuario) |
| `/fotografias` | Carga y gestión de fotografías |
| `/login`, `/registro`, `/recuperar` | Autenticación original |
| `/mi-cuenta` | Cuenta y datos personales originales |
| `/ofertas` | HU de Ofertas |
| `/calificaciones` | HU de Calificaciones |
| `/admin` | Rol administrador |
| `/tablon`, `/tablon/publicaciones`, `/tablon/publicar` | Alias de compatibilidad (`/tablon/catalogo` redirige a `/catalogo`) |

## Alcance y límites

- Los dos módulos de autenticación usan las mismas claves de `localStorage` (`tablon_users`, `tablon_session`), por lo que se conserva la sesión compartida. Los cambios de sesión en el tablón se reflejan también en el contexto React del grupo.
- Se han conservado las validaciones y operaciones originales; no se inventó una API o BD. Las publicaciones se almacenan en el navegador. Las ofertas y calificaciones mantienen el funcionamiento y los datos demostrativos del proyecto base; **no se conectan automáticamente con los avisos** del otro ZIP.
- La ruta `/tablon` conserva la portada alternativa para comprobar íntegra la experiencia del segundo ZIP.
- No se incluyen `node_modules` ni `dist` en el ZIP; deben generarse con los comandos anteriores.

## Ajuste de navegación (23/10/2026)

Se eliminó el menú provisional marrón de la parte superior (`integration-nav`), que duplicaba las pestañas que ya existen en el encabezado original del tablón.

El cambio se limita a `src/App.jsx` y a la limpieza del CSS que solo daba estilos a esa barra. Los enlaces a Ofertas y Calificaciones siguen disponibles desde las pestañas originales del tablón, y las rutas de React Router permanecen intactas.

## Integración del Catálogo (24/10/2026)

El catálogo del ZIP anterior era solo un marcador ("Aquí se integra la HU-3"). Ahora `/catalogo` y `/favoritos` usan el módulo `src/pages/catalogo`:

- `CatalogoPage.jsx` + `components/`: los componentes originales (Catalogo, AvisoCard, FiltrosSidebar, DetalleAviso, PerfilVendedor, Favoritos). Se descartaron el Header, NavBar y Footer propios porque el proyecto ya tiene los compartidos.
- `CatalogoContext.jsx`: estado compartido (avisos, favoritos, búsqueda). `CatalogoProvider` se monta en `main.jsx`.
- `catalogo.css`: los estilos originales, encapsulados bajo `.catalogo-app` para no afectar a Auth, Ofertas, Calificaciones ni Publicaciones.
- Cambios mínimos fuera del módulo: `App.jsx` (rutas), `main.jsx` (provider), `layout/Header.jsx` (el buscador ahora alimenta el catálogo), `utils/constants.js` (pestaña Favoritos → `/favoritos`) y `modules/tablon/legacy.js` (las pestañas/botones que iban a la vista antigua del catálogo ahora van a `/catalogo`).
- En el detalle del aviso, un USUARIO con sesión ve "Ofertar" (lleva a `/ofertas`) y "Guardar en favoritos"; un visitante ve el aviso de iniciar sesión.
- Los avisos del catálogo siguen siendo los datos de ejemplo de `avisos.js`; no están conectados con "Mis publicaciones".

## Mejora de Calificaciones — HU-6 (25/10/2026)

`src/pages/ratings` se rehízo siguiendo los mockups 6.1, 6.2 y 6.3 y se conectó con el resto de la aplicación:

- **Mis calificaciones (6.3):** pestañas Emitidas · 8 / Recibidas · 11, con foto de cada producto (las mismas del Catálogo), acuerdos pendientes de calificar, comentarios, destacados, «Editable hasta…» / «Plazo de edición vencido», Editar y Eliminar (con confirmación; al eliminar, el acuerdo vuelve a pendiente), «Ver las N calificaciones restantes» y estados vacíos.
- **Calificar (6.1):** foto y datos del acuerdo, puntaje con texto según las estrellas, destacados, comentario de hasta 300 caracteres (rechaza teléfonos y correos), plazo de edición de 7 días y «Calificar después».
- **Perfil público (6.2):** reputación, distribución de puntajes, filtros por puntaje, comentarios con la foto del producto y «Reportar usuario» (motivo y descripción de al menos 30 caracteres). Se abre desde el título de una calificación emitida, desde el autor de una recibida o con «Ver mi perfil público».
- **Conexión con Acuerdos:** al marcar un acuerdo como «Entregado» en `/acuerdos`, aparece en Calificaciones como pendiente, con su foto.
- **Datos:** Rosa María Quispe Ríos parte con los datos de los mockups (4.8 ★, 12 acuerdos); una cuenta nueva ve los estados vacíos. El estado (`ratingsStore.js`) se conserva al cambiar de pestaña y se reinicia al recargar, igual que Ofertas y Acuerdos.
- **Archivos:** `Historia6.jsx` (lista), `RateForm.jsx`, `PublicProfile.jsx`, `ratingsUi.jsx`, `ratingsData.js`, `ratingsStore.js` y `css_historia6.css` (clases con prefijo `hu6-`, sin afectar a otros módulos). Fuera de la carpeta no se tocó ningún archivo.
