// Datos de ejemplo del Catálogo (Mockups Tema 3 · vistas 3.1 a 3.8).
// Fechas DD/MM/AAAA, montos en soles. `publicadoISO` solo sirve para ordenar por «Más recientes».

import { IMAGENES_AVISO, GALERIA_AVISO } from './imagenes.js';

export const PRECIO_MAX = 200;

// Los conteos son los del mockup (total del catálogo del campus), no de esta muestra.
export const CATEGORIAS = [
  { valor: 'Libros de texto', cuenta: 48 },
  { valor: 'Calculadoras', cuenta: 22 },
  { valor: 'Instrumentos de dibujo', cuenta: 17 },
  { valor: 'Apuntes y guías', cuenta: 31 },
  { valor: 'Laptops y accesorios', cuenta: 9 },
  { valor: 'Uniformes y mandiles', cuenta: 14 },
  { valor: 'Material de laboratorio', cuenta: 6 },
];

export const ESTADOS = ['Como nuevo', 'Muy buen estado', 'Buen estado', 'Con marcas de uso'];

export const VENDEDORES = {
  rosa: {
    id: 'rosa', nombre: 'Rosa María Quispe Ríos', carrera: 'Administración', ciclo: 'cuarto',
    desde: '03/2026', desdeLargo: 'marzo de 2026', rating: 4.8, calificaciones: 11,
    cerrados: 12, responde: '1 d', respondeLargo: '1 día', confiable: true,
    resenas: [
      { estrellas: 5, fecha: '17/08/2026', texto: 'Llegó puntual a la Biblioteca y el libro estaba tal como lo describió.', autor: 'Andrés Castillo Paredes · Ing. Industrial' },
      { estrellas: 5, fecha: '09/08/2026', texto: 'Aceptó mi contraoferta sin problema y coordinamos rápido por el hilo.', autor: 'Lucía Ramírez Ccahuana · Derecho' },
      { estrellas: 4, fecha: '02/08/2026', texto: 'Todo bien, aunque tuvimos que reprogramar el encuentro una vez.', autor: 'Sebastián Ochoa Núñez · Economía' },
    ],
  },
  carlos: { id: 'carlos', nombre: 'Carlos Rossi', carrera: 'Ingeniería Industrial', ciclo: 'sexto', desde: '02/2026', desdeLargo: 'febrero de 2026', rating: 4.6, calificaciones: 5, cerrados: 6, responde: '2 d', respondeLargo: '2 días', confiable: false, resenas: [] },
  mariana: { id: 'mariana', nombre: 'Mariana Torres Díaz', carrera: 'Ingeniería de Sistemas', ciclo: 'octavo', desde: '03/2026', desdeLargo: 'marzo de 2026', rating: 4.9, calificaciones: 7, cerrados: 8, responde: '1 d', respondeLargo: '1 día', confiable: true, resenas: [] },
  julio: { id: 'julio', nombre: 'Julio Salas Pérez', carrera: 'Economía', ciclo: 'quinto', desde: '04/2026', desdeLargo: 'abril de 2026', rating: 4.5, calificaciones: 3, cerrados: 4, responde: '2 d', respondeLargo: '2 días', confiable: false, resenas: [] },
  valeria: { id: 'valeria', nombre: 'Valeria Núñez Soto', carrera: 'Arquitectura', ciclo: 'tercer', desde: '05/2026', desdeLargo: 'mayo de 2026', rating: 4.7, calificaciones: 4, cerrados: 5, responde: '1 d', respondeLargo: '1 día', confiable: false, resenas: [] },
};

const base = (id, titulo, precio, categoria, curso, estado, vendedorId, publicadoISO, extra = {}) => ({
  id, titulo, precio, categoria, curso, estado, vendedorId, publicadoISO,
  publicado: publicadoISO.split('-').reverse().join('/'),
  minimo: Math.round(precio * 0.8),
  fotos: 4,
  imagen: IMAGENES_AVISO[id] || null,
  galeria: GALERIA_AVISO[id] || null,
  descripcion: 'Cuidado durante el ciclo, sin daños importantes. Revisa las fotografías para ver el estado real y coordina la entrega en el campus.',
  vendido: null,        // 'DD/MM/AAAA' cuando ya se vendió
  ofertaActiva: null,   // { monto, fecha } si el usuario en sesión ya ofertó
  fav: false,
  favTs: 0,             // orden de «Guardados recientemente» (mayor = más reciente)
  ...extra,
});

export const AVISOS_DATA = [
  base(1, 'Cálculo de una variable — Stewart, 8.ª ed.', 95, 'Libros de texto', 'Cálculo I', 'Muy buen estado', 'rosa', '2026-08-18', {
    minimo: 78, fav: true, favTs: 5,
    descripcion: 'Usado un ciclo en Cálculo I con el profesor Mendoza. Tapa firme, sin hojas sueltas, algunas anotaciones a lápiz en los capítulos 3 y 4. Incluye el separador original y la tabla de derivadas que reparten en clase.',
  }),
  base(2, 'Cálculo — Larson, tomo I', 78, 'Libros de texto', 'Cálculo I', 'Muy buen estado', 'carlos', '2026-08-17'),
  base(3, 'Solucionario de Cálculo I anillado', 45, 'Libros de texto', 'Cálculo I', 'Muy buen estado', 'carlos', '2026-08-16'),
  base(4, 'Cálculo diferencial e integral — Purcell', 62, 'Libros de texto', 'Cálculo I', 'Muy buen estado', 'mariana', '2026-08-15'),
  base(5, 'Cálculo aplicado a la economía', 55, 'Libros de texto', 'Cálculo I', 'Muy buen estado', 'julio', '2026-08-14'),
  base(6, 'Problemas resueltos de límites y derivadas', 40, 'Libros de texto', 'Cálculo I', 'Muy buen estado', 'valeria', '2026-08-13'),
  base(7, 'Cálculo vectorial — Marsden y Tromba', 105, 'Libros de texto', 'Cálculo I', 'Muy buen estado', 'mariana', '2026-08-12'),
  base(8, 'Cuaderno de prácticas de Cálculo I', 28, 'Libros de texto', 'Cálculo I', 'Muy buen estado', 'carlos', '2026-08-11'),
  base(9, 'Cálculo con geometría analítica — Swokowski', 88, 'Libros de texto', 'Cálculo I', 'Muy buen estado', 'julio', '2026-08-10'),
  base(10, 'Guía de ejercicios de Cálculo I', 35, 'Libros de texto', 'Cálculo I', 'Muy buen estado', 'valeria', '2026-08-09'),
  base(11, 'Cálculo I — separatas encuadernadas', 42, 'Libros de texto', 'Cálculo I', 'Muy buen estado', 'julio', '2026-08-08'),
  base(12, 'Fundamentos de cálculo — Apostol, tomo I', 118, 'Libros de texto', 'Cálculo I', 'Muy buen estado', 'mariana', '2026-08-07'),

  base(13, 'Calculadora científica ClassWiz fx-991', 120, 'Calculadoras', 'Física II', 'Como nuevo', 'rosa', '2026-08-22', {
    minimo: 95, fotos: 3,
    descripcion: 'Usada dos ciclos en Física II. Pantalla sin rayones, incluye tapa y manual. Funciona con pila nueva; entrego con estuche de tela.',
    ofertaActiva: { monto: 100, fecha: '28/08/2026' },
  }),
  base(14, 'Escuadras y escalímetro Faber', 38, 'Instrumentos de dibujo', 'Dibujo Técnico', 'Buen estado', 'rosa', '2026-08-06'),
  base(15, 'Apuntes de Contabilidad General', 25, 'Apuntes y guías', 'Contabilidad General', 'Con marcas de uso', 'rosa', '2026-08-05'),
  base(16, 'Mandil de laboratorio talla M', 45, 'Uniformes y mandiles', 'Química General', 'Buen estado', 'rosa', '2026-08-04'),
  base(17, 'Física para ciencias e ingeniería — Serway, tomo I', 110, 'Libros de texto', 'Física II', 'Buen estado', 'rosa', '2026-07-20', {
    vendido: '05/08/2026',
  }),

  base(18, 'Serway Física, tomo II', 98, 'Libros de texto', 'Física II', 'Buen estado', 'carlos', '2026-08-19'),
  base(19, 'Problemas de Física II resueltos', 45, 'Apuntes y guías', 'Física II', 'Con marcas de uso', 'mariana', '2026-08-18'),
  base(20, 'Separatas de Física II — ciclo completo', 30, 'Apuntes y guías', 'Física II', 'Buen estado', 'julio', '2026-08-17'),

  base(21, 'Set de portaobjetos y cubreobjetos', 22, 'Material de laboratorio', 'Química General', 'Como nuevo', 'valeria', '2026-08-20'),
  base(22, 'Mandil blanco de laboratorio talla S', 40, 'Uniformes y mandiles', 'Química General', 'Buen estado', 'julio', '2026-08-19'),
  base(23, 'Guía de prácticas de Química General', 18, 'Apuntes y guías', 'Química General', 'Con marcas de uso', 'mariana', '2026-08-18'),
  base(24, 'Química General — Chang, 11.ª ed.', 85, 'Libros de texto', 'Química General', 'Buen estado', 'carlos', '2026-08-01', {
    vendido: '21/08/2026', fav: true, favTs: 2,
  }),

  base(25, 'Estuche de dibujo técnico Staedtler', 52, 'Instrumentos de dibujo', 'Dibujo Técnico', 'Como nuevo', 'valeria', '2026-08-21', { fav: true, favTs: 4 }),
  base(26, 'Apuntes de Estadística Aplicada', 30, 'Apuntes y guías', 'Estadística Aplicada', 'Buen estado', 'julio', '2026-08-21', { fav: true, favTs: 3 }),
  base(27, 'Mochila para laptop 15" acolchada', 65, 'Laptops y accesorios', null, 'Buen estado', 'valeria', '2026-08-20', { fav: true, favTs: 1 }),
];

