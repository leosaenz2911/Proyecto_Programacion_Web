// Datos de ejemplo de Calificaciones (Mockups 6.1, 6.2 y 6.3 · usuaria Rosa María Quispe Ríos).
// Las fotos de los productos son las mismas del Catálogo (src/pages/catalogo/imagenes.js),
// por eso un aviso se ve igual en Catálogo, Ofertas, Acuerdos y Calificaciones.
import { IMAGENES_AVISO } from '../catalogo/imagenes.js';

export const ROSA_ID = 'USR-001';
export const DIAS_EDICION = 7;
export const TEXTOS_PUNTAJE = ['Malo', 'Regular', 'Aceptable', 'Bueno', 'Excelente'];
export const DESTACADOS = ['Puntualidad', 'Buena comunicación', 'Producto como se describía', 'Flexibilidad con el horario'];

// Personas con las que Rosa tiene acuerdos (carrera y reputación según el panel de usuarios, mockup 7.3).
export const PERFILES = {
  carla:     { nombre: 'Carla Huamaní Bravo',        carrera: 'Arquitectura',            ciclo: 'sexto',   desde: 'marzo de 2026', rating: 4.8, total: 7, acuerdos: 8 },
  ivan:      { nombre: 'Iván Palomino Rojas',        carrera: 'Economía',                ciclo: 'quinto',  desde: 'marzo de 2026', rating: 4.5, total: 9, acuerdos: 10 },
  alejandra: { nombre: 'Alejandra Cornejo Ríos',     carrera: 'Psicología',              ciclo: 'tercer',  desde: 'abril de 2026', rating: 4.6, total: 3, acuerdos: 4 },
  milagros:  { nombre: 'Milagros Flores Ttito',      carrera: 'Ing. de Sistemas',        ciclo: 'sexto',   desde: 'marzo de 2026', rating: 5.0, total: 6, acuerdos: 7 },
  mariana:   { nombre: 'Mariana Torres Díaz',        carrera: 'Ing. de Sistemas',        ciclo: 'octavo',  desde: 'marzo de 2026', rating: 4.9, total: 7, acuerdos: 8 },
  julio:     { nombre: 'Julio Salas Pérez',          carrera: 'Economía',                ciclo: 'quinto',  desde: 'abril de 2026', rating: 4.5, total: 3, acuerdos: 4 },
  valeria:   { nombre: 'Valeria Núñez Soto',         carrera: 'Arquitectura',            ciclo: 'tercer',  desde: 'mayo de 2026',  rating: 4.7, total: 4, acuerdos: 5 },
  andres:    { nombre: 'Andrés Castillo Paredes',    carrera: 'Ing. Industrial',         ciclo: 'séptimo', desde: 'marzo de 2026', rating: 4.9, total: 8, acuerdos: 9 },
  lucia:     { nombre: 'Lucía Ramírez Ccahuana',     carrera: 'Derecho',                 ciclo: 'sexto',   desde: 'marzo de 2026', rating: 4.7, total: 4, acuerdos: 5 },
  sebastian: { nombre: 'Sebastián Ochoa Núñez',      carrera: 'Economía',                ciclo: 'cuarto',  desde: 'abril de 2026', rating: 4.2, total: 3, acuerdos: 3 },
  paola:     { nombre: 'Paola Zegarra Ibáñez',       carrera: 'Arquitectura',            ciclo: 'quinto',  desde: 'marzo de 2026', rating: 4.4, total: 5, acuerdos: 6 },
  joaquin:   { nombre: 'Joaquín Tapia Salazar',      carrera: 'Arquitectura',            ciclo: 'segundo', desde: 'mayo de 2026',  rating: 4.5, total: 2, acuerdos: 2 },
  renzo:     { nombre: 'Renzo Cárdenas Vílchez',     carrera: 'Contabilidad',            ciclo: 'cuarto',  desde: 'abril de 2026', rating: 3.9, total: 2, acuerdos: 2 },
  sofia:     { nombre: 'Sofía Bermúdez Chávez',      carrera: 'Ing. Industrial',         ciclo: 'quinto',  desde: 'marzo de 2026', rating: 4.3, total: 4, acuerdos: 5 },
  marco:     { nombre: 'Marco Antonio Loayza Pinto', carrera: 'Comunicación',            ciclo: 'octavo',  desde: 'febrero de 2026', rating: 2.8, total: 5, acuerdos: 6 },
};

const FEMENINAS = new Set(['carla', 'alejandra', 'mariana', 'valeria', 'lucia', 'paola', 'sofia', 'milagros']);
export const esFemenina = id => FEMENINAS.has(id);

// Para vincular un acuerdo del módulo Acuerdos (que guarda solo el nombre) con un perfil conocido.
export const idPorNombre = nombre => {
  const n = (nombre || '').toLowerCase();
  const hit = Object.entries(PERFILES).find(([, p]) => p.nombre.toLowerCase().startsWith(n) || n.startsWith(p.nombre.toLowerCase()));
  return hit ? hit[0] : null;
};

// Productos (avisos del Catálogo): id del aviso → título y foto.
const PRODUCTOS = {
  1: 'Cálculo de una variable — Stewart, 8.ª ed.',
  2: 'Cálculo — Larson, tomo I',
  4: 'Cálculo diferencial e integral — Purcell',
  13: 'Calculadora científica ClassWiz fx-991',
  14: 'Juego de escuadras y escalímetro Faber',
  15: 'Apuntes de Contabilidad General',
  16: 'Mandil de laboratorio talla M',
  17: 'Física para ciencias e ingeniería — Serway, tomo I',
  25: 'Estuche de dibujo técnico Staedtler',
  26: 'Apuntes de Estadística Aplicada',
  27: 'Mochila para laptop 15" acolchada',
};
const producto = id => ({ avisoId: id, titulo: PRODUCTOS[id], imagen: IMAGENES_AVISO[id] || '/img/logo_ulima.png' });

// Acuerdos entregados que Rosa todavía no califica.
const PENDIENTES = [
  { id: 'A-2044', ...producto(15), precio: 25, lugar: 'Biblioteca', entregado: '19/08/2026',
    contraparte: { id: 'paola', nombre: 'Paola Zegarra Ibáñez', rol: 'Compradora' } },
];

// Calificaciones que Rosa emitió (mockup 6.3).
const EMITIDAS = [
  { id: 'A-2201', ...producto(14), precio: 34, lugar: 'Patio del pabellón H', entregado: '01/09/2026',
    contraparte: { id: 'carla', nombre: 'Carla Huamaní Bravo', rol: 'Compradora' },
    estrellas: 5, fecha: '01/09/2026', texto: 'Llegó cinco minutos antes al patio del pabellón H y todo salió sin problemas.',
    destacados: ['Puntualidad', 'Buena comunicación'], editableHasta: '08/09/2026', editable: true },
  { id: 'A-2109', ...producto(2), precio: 70, lugar: 'Puerta 1', entregado: '26/08/2026',
    contraparte: { id: 'ivan', nombre: 'Iván Palomino Rojas', rol: 'Vendedor' },
    estrellas: 4, fecha: '26/08/2026', texto: 'Buen trato, aunque el libro tenía más marcas de las que decía el aviso.',
    destacados: [], editableHasta: '02/09/2026', editable: false },
  { id: 'A-1932', ...producto(27), precio: 58, lugar: 'Explanada central', entregado: '12/08/2026',
    contraparte: { id: 'alejandra', nombre: 'Alejandra Cornejo Ríos', rol: 'Vendedora' },
    estrellas: 5, fecha: '12/08/2026', texto: 'Muy clara con el horario y la mochila estaba impecable.',
    destacados: ['Producto como se describía'], editableHasta: '19/08/2026', editable: false },
  { id: 'A-2072', ...producto(17), precio: 100, lugar: 'Biblioteca', entregado: '05/08/2026',
    contraparte: { id: 'milagros', nombre: 'Milagros Flores Ttito', rol: 'Compradora' },
    estrellas: 5, fecha: '06/08/2026', texto: 'Muy puntual y amable, pagó el monto acordado sin pedir descuento.',
    destacados: ['Puntualidad'], editableHasta: '12/08/2026', editable: false },
  { id: 'A-2015', ...producto(4), precio: 55, lugar: 'Biblioteca', entregado: '28/07/2026',
    contraparte: { id: 'mariana', nombre: 'Mariana Torres Díaz', rol: 'Vendedora' },
    estrellas: 5, fecha: '28/07/2026', texto: 'El libro estaba en muy buen estado, tal como en las fotos.',
    destacados: ['Producto como se describía'], editableHasta: '04/08/2026', editable: false },
  { id: 'A-1960', ...producto(26), precio: 28, lugar: 'Puerta 1', entregado: '20/07/2026',
    contraparte: { id: 'julio', nombre: 'Julio Salas Pérez', rol: 'Vendedor' },
    estrellas: 4, fecha: '20/07/2026', texto: 'Los apuntes estaban completos, aunque el encuentro se movió una vez.',
    destacados: [], editableHasta: '27/07/2026', editable: false },
  { id: 'A-1890', ...producto(25), precio: 48, lugar: 'Cafetería del pabellón E', entregado: '10/07/2026',
    contraparte: { id: 'valeria', nombre: 'Valeria Núñez Soto', rol: 'Vendedora' },
    estrellas: 5, fecha: '10/07/2026', texto: 'Todo en orden, el estuche estaba como nuevo.',
    destacados: ['Buena comunicación'], editableHasta: '17/07/2026', editable: false },
];

// Calificaciones que Rosa recibió (mockup 6.2: 11 en total, nueve de 5★ y dos de 4★ → promedio 4.8).
const RECIBIDAS = [
  { id: 'A-2201', ...producto(14), autorId: 'carla',     estrellas: 5, fecha: '01/09/2026', texto: 'Llegó cinco minutos antes al patio del pabellón H y las escuadras estaban impecables.' },
  { id: 'A-2150', ...producto(1),  autorId: 'andres',    estrellas: 5, fecha: '17/08/2026', texto: 'El libro estaba tal como lo describió y respondió rápido cada mensaje del hilo.' },
  { id: 'A-2088', ...producto(13), autorId: 'lucia',     estrellas: 5, fecha: '09/08/2026', texto: 'Aceptó mi contraoferta sin problema y coordinamos en un día.' },
  { id: 'A-2031', ...producto(15), autorId: 'sebastian', estrellas: 4, fecha: '02/08/2026', texto: 'Todo bien, aunque tuvimos que reprogramar el encuentro una vez.' },
  { id: 'A-1975', ...producto(16), autorId: 'milagros',  estrellas: 5, fecha: '21/07/2026', texto: 'Me esperó en la Biblioteca aunque llegué tarde por una clase. Muy amable.' },
  { id: 'A-1942', ...producto(16), autorId: 'ivan',      estrellas: 5, fecha: '14/07/2026', texto: 'Excelente trato, el mandil estaba limpio y de la talla indicada.' },
  { id: 'A-1921', ...producto(13), autorId: 'paola',     estrellas: 5, fecha: '08/07/2026', texto: 'Muy ordenada con los horarios y el producto era igual a las fotos.' },
  { id: 'A-1890', ...producto(14), autorId: 'joaquin',   estrellas: 4, fecha: '30/06/2026', texto: 'Buena vendedora, solo tardó un poco en responder el primer mensaje.' },
  { id: 'A-1864', ...producto(15), autorId: 'renzo',     estrellas: 5, fecha: '22/06/2026', texto: 'Los apuntes estaban completos y bien ordenados.' },
  { id: 'A-1839', ...producto(1),  autorId: 'sofia',     estrellas: 5, fecha: '15/06/2026', texto: 'Puntual y amable, todo tal como se describía.' },
  { id: 'A-1811', ...producto(17), autorId: 'marco',     estrellas: 5, fecha: '06/06/2026', texto: 'Coordinamos rápido en la Puerta 1, sin ningún inconveniente.' },
];

export const DATOS_ROSA = { pendientes: PENDIENTES, emitidas: EMITIDAS, recibidas: RECIBIDAS, acuerdosCerrados: 12 };
export const DATOS_VACIOS = { pendientes: [], emitidas: [], recibidas: [], acuerdosCerrados: 0 };

// Reseñas de ejemplo para los perfiles de las demás personas (la que escribió Rosa se añade aparte).
const POOL = [
  { estrellas: 5, texto: 'Todo salió como lo acordamos, muy recomendable.' },
  { estrellas: 5, texto: 'Respondió rápido y llegó puntual al encuentro.' },
  { estrellas: 4, texto: 'Buen trato, solo cambiamos la hora a último minuto.' },
];
export const resenasDeEjemplo = perfilId => {
  const base = perfilId.length % POOL.length;
  const autores = ['lucia', 'andres', 'milagros', 'paola'].filter(a => a !== perfilId);
  return [0, 1].map(i => ({
    id: `A-${2100 + base * 7 + i}`, autorId: autores[(base + i) % autores.length],
    ...POOL[(base + i) % POOL.length], fecha: i === 0 ? '12/08/2026' : '29/07/2026',
  }));
};

// Reparte N calificaciones entre dos niveles contiguos para que el promedio coincida con el del perfil.
export const distribucion = (promedio, total) => {
  const d = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  if (!total) return d;
  const bajo = Math.min(4, Math.floor(promedio));
  const alto = bajo + 1;
  const nAlto = Math.round(total * (promedio - bajo));
  d[alto] = nAlto; d[bajo] = total - nAlto;
  return d;
};

export const formatoFecha = fecha => {
  const dd = String(fecha.getDate()).padStart(2, '0');
  const mm = String(fecha.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${fecha.getFullYear()}`;
};
export const hoyMasDias = n => { const f = new Date(); f.setDate(f.getDate() + n); return formatoFecha(f); };
export const montoSoles = n => `S/ ${Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
