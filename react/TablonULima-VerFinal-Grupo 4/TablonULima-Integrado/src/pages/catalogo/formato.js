// Utilidades de formato del Catálogo (montos «S/ 1,250.00», iniciales, búsqueda sin tildes).

export const soles = n =>
  'S/ ' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// «Cálculo» → «calculo»: la búsqueda no distingue tildes ni mayúsculas.
export const norm = s =>
  (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

export function iniciales(nombre = '') {
  const p = nombre.trim().split(/\s+/);
  const segunda = p.length >= 4 ? p[2] : p[1];
  return ((p[0]?.[0] || '') + (segunda?.[0] || '')).toUpperCase();
}

export const estrellas = rating => '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));
