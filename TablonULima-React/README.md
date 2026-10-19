# Tablón ULima — Proyecto React + Vite

Migración de los tres archivos originales de HTML, CSS y JavaScript a un proyecto React, conservando las pantallas y la experiencia visual del prototipo de Programación Web.

## Requisitos (Windows / VS Code)

- **Node.js 22.12 o posterior** (también funciona con Node.js 20.19 o posterior).
- Visual Studio Code.
- Conexión a Internet para la **primera** instalación de dependencias con npm.

## Pasos para ejecutarlo

1. Descomprime el ZIP.
2. En VS Code, selecciona **Archivo > Abrir carpeta** y abre la carpeta `TablonULima-React` (la que contiene `package.json`).
3. Abre la terminal integrada con **Terminal > Nuevo terminal** o `Ctrl + ñ`.
4. Ejecuta estos comandos, uno después de otro:

   ```powershell
   npm install
   npm run dev
   ```

5. Abre en Chrome o Edge la dirección que indique Vite, normalmente **http://localhost:5173/**.

Para detener el servidor, presiona **Ctrl + C** en la terminal.

### Verificar la instalación

```powershell
node -v
npm -v
npm run check
npm run build
```

`npm run build` genera la carpeta `dist/` para distribución. **No debes abrir `index.html` con doble clic**: Vite necesita servir el proyecto durante el desarrollo.

## Cuentas de demostración

| Perfil | Correo | Contraseña |
| --- | --- | --- |
| Usuario | 20201234@aloe.ulima.edu.pe | Rosa1234 |
| Administrador | 20150001@aloe.ulima.edu.pe | Admin1234 |
| Usuario bloqueado | 20189922@aloe.ulima.edu.pe | Marco1234 |

> Estos datos son únicamente de prueba: no son un sistema de autenticación seguro.

## Estructura

```text
TablonULima-React/
├── public/
│   └── img/
│       └── logo_ulima.svg       # Marcador de posición de marca (no oficial)
├── src/
│   ├── App.jsx                  # Todas las pantallas y sus eventos en JSX
│   ├── legacy.js                # Lógica original adaptada a módulos de React
│   ├── main.jsx                 # Entrada React (createRoot)
│   └── styles.css               # Estilos originales con ajustes
├── .gitignore
├── index.html
├── package.json
├── README.md
└── VERIFICACION.md
```

## Funcionalidades

- Inicio y cierre de sesión, registro, navegación y rutas protegidas según el rol.
- Perfil: edición de datos, foto de perfil, cambio de contraseña y recuperación **simulada**.
- Mis publicaciones: filtrado, búsqueda, estado vacío para cuentas nuevas y contadores.
- Nuevo aviso: datos del producto, vista previa, validación y guardar borrador.
- Fotos de avisos: formatos JPG/PNG, máximo seis archivos, 5 MB por archivo, reordenamiento, fotografía principal, cancelar y guardar.
- Acciones: pausar, reactivar, marcar vendido y eliminar publicaciones (con confirmación).
- Los nuevos avisos y cambios de estado se conservan en el almacenamiento local del navegador, incluidas las miniaturas comprimidas.

## Importante: alcance del prototipo

- No hay backend, base de datos ni envío de correos reales. Los datos se simulan con `localStorage`; las contraseñas están en texto plano **solo para esta demostración**. **No usar en producción ni con contraseñas reales.**
- Catálogo, favoritos, ofertas, acuerdos, reportes y otras pantallas ajenas a las historias implementadas permanecen como marcadores de posición del HTML original.
- El HTML pasó a componentes/elementos JSX de React. Para minimizar regresiones, la lógica de negocio del JS original se integró como una **capa de compatibilidad** (`legacy.js`) que todavía gestiona parte del DOM; no es una reescritura total basada en hooks.
- Las imágenes originales `img/logo_ulima.png` y `img/edificiof2.jpg` **no estaban entre los archivos subidos**. Se usan un SVG de reemplazo sencillo y un fondo degradado, respectivamente. Puedes sustituirlos luego por los recursos autorizados.
- Los iconos Font Awesome y la fuente Nunito Sans se cargan desde CDN; requieren Internet.

Para ver el detalle de las comprobaciones realizadas consulta `VERIFICACION.md`.
