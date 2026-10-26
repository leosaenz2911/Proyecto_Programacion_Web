import { PRECIO_MAX } from './avisos.js';
import { norm, soles } from './formato.js';

export const FILTROS_VACIOS = {
  categorias: [],
  curso: 'Todos',
  precioMin: 0,
  precioMax: PRECIO_MAX,
  estados: [],
};

// Un aviso vendido ya no se ofrece en el catálogo (sigue visible en Favoritos y en el perfil del vendedor).
export function filtrarAvisos(avisos, termino, f) {
  const palabras = norm(termino).split(/\s+/).filter(Boolean);
  return avisos.filter(a => {
    if (a.vendido) return false;
    const pajar = norm(`${a.titulo} ${a.curso || ''} ${a.categoria}`);
    if (!palabras.every(p => pajar.includes(p))) return false;
    if (f.categorias.length && !f.categorias.includes(a.categoria)) return false;
    if (f.curso !== 'Todos' && a.curso !== f.curso) return false;
    if (a.precio < f.precioMin) return false;
    if (f.precioMax < PRECIO_MAX && a.precio > f.precioMax) return false; // el tope = «sin límite»
    if (f.estados.length && !f.estados.includes(a.estado)) return false;
    return true;
  });
}

export function ordenar(lista, orden) {
  const copia = [...lista];
  if (orden === 'asc') return copia.sort((a, b) => a.precio - b.precio);
  if (orden === 'desc') return copia.sort((a, b) => b.precio - a.precio);
  return copia.sort((a, b) => b.publicadoISO.localeCompare(a.publicadoISO) || b.id - a.id);
}

export function hayRangoPrecio(f) {
  return f.precioMin > 0 || f.precioMax < PRECIO_MAX;
}

// Chips de «Filtros activos» derivados del estado (cada uno sabe cómo quitarse).
export function chipsActivos(f) {
  const chips = [];
  f.categorias.forEach(c => chips.push({ clave: `cat-${c}`, etiqueta: c, tipo: 'categoria', valor: c }));
  if (f.curso !== 'Todos') chips.push({ clave: 'curso', etiqueta: f.curso, tipo: 'curso' });
  if (hayRangoPrecio(f)) {
    const tope = f.precioMax >= PRECIO_MAX ? `${soles(PRECIO_MAX).replace('.00', '')}+` : soles(f.precioMax).replace('.00', '');
    chips.push({ clave: 'precio', etiqueta: `${soles(f.precioMin).replace('.00', '')} – ${tope}`, tipo: 'precio' });
  }
  f.estados.forEach(e => chips.push({ clave: `est-${e}`, etiqueta: e, tipo: 'estado', valor: e }));
  return chips;
}
