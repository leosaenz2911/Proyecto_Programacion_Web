import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AVISOS_DATA, PRECIO_MAX } from './avisos.js';
import { FILTROS_VACIOS, chipsActivos, filtrarAvisos, ordenar } from './filtrar.js';

// Estado del catálogo compartido entre /catalogo, /favoritos, el detalle, el perfil y la barra de búsqueda del Header.
const CatalogoContext = createContext(null);

export const TAM_PAGINA = 12;

// Estado inicial = mockup 3.1 (búsqueda «cálculo» con filtros de libros, Cálculo I y «Muy buen estado»).
const FILTROS_INICIALES = { ...FILTROS_VACIOS, categorias: ['Libros de texto'], curso: 'Cálculo I', estados: ['Muy buen estado'] };

const alternar = (lista, valor) => (lista.includes(valor) ? lista.filter(v => v !== valor) : [...lista, valor]);

export function CatalogoProvider({ children }) {
  const [avisos, setAvisos] = useState(AVISOS_DATA);
  const [busqueda, setBusqueda] = useState('cálculo');           // lo que se escribe
  const [filtro, setFiltro] = useState('cálculo');                // lo que ya se aplicó con Enter
  const [terminoMostrado, setTerminoMostrado] = useState('cálculo');
  const [cargando, setCargando] = useState(false);
  const [filtros, setFiltros] = useState(FILTROS_INICIALES);
  const [orden, setOrdenState] = useState('recientes');
  const [pagina, setPaginaState] = useState(1);
  const timerRef = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  // --- Búsqueda (simula la carga con esqueletos, 600 ms) ---
  function buscar() {
    const query = busqueda.trim();
    clearTimeout(timerRef.current);
    setCargando(true);
    timerRef.current = setTimeout(() => {
      setFiltro(query);
      setTerminoMostrado(query);
      setPaginaState(1);
      setCargando(false);
    }, 600);
  }

  function limpiarBusqueda() {
    clearTimeout(timerRef.current);
    setCargando(false);
    setBusqueda('');
    setFiltro('');
    setTerminoMostrado('');
    setPaginaState(1);
  }

  // --- Filtros ---
  const cambiarFiltros = parche => { setFiltros(prev => ({ ...prev, ...parche })); setPaginaState(1); };
  const toggleCategoria = c => { setFiltros(prev => ({ ...prev, categorias: alternar(prev.categorias, c) })); setPaginaState(1); };
  const toggleEstado = e => { setFiltros(prev => ({ ...prev, estados: alternar(prev.estados, e) })); setPaginaState(1); };
  const setCurso = curso => cambiarFiltros({ curso });
  const setPrecio = (precioMin, precioMax) => cambiarFiltros({ precioMin, precioMax });
  const limpiarFiltros = () => { setFiltros(FILTROS_VACIOS); setPaginaState(1); };

  function quitarChip(chip) {
    if (chip.tipo === 'categoria') toggleCategoria(chip.valor);
    else if (chip.tipo === 'estado') toggleEstado(chip.valor);
    else if (chip.tipo === 'curso') setCurso('Todos');
    else if (chip.tipo === 'precio') setPrecio(0, PRECIO_MAX);
  }

  // «Ver avisos de Física II»: deja solo ese curso como filtro y vacía la búsqueda.
  function verCurso(curso) {
    clearTimeout(timerRef.current);
    setCargando(false);
    setBusqueda('');
    setFiltro('');
    setTerminoMostrado('');
    setFiltros({ ...FILTROS_VACIOS, curso });
    setPaginaState(1);
  }

  const setOrden = o => { setOrdenState(o); setPaginaState(1); };
  const setPagina = p => { setPaginaState(p); window.scrollTo(0, 0); };

  // --- Avisos ---
  function toggleFav(id) {
    setAvisos(prev => prev.map(a => (a.id === id ? { ...a, fav: !a.fav, favTs: a.fav ? 0 : Date.now() } : a)));
  }

  const retirarOferta = id => setAvisos(prev => prev.map(a => (a.id === id ? { ...a, ofertaActiva: null } : a)));
  const getAviso = id => avisos.find(a => a.id === Number(id));

  // --- Derivados ---
  const resultados = useMemo(
    () => ordenar(filtrarAvisos(avisos, filtro, filtros), orden),
    [avisos, filtro, filtros, orden]
  );
  const chips = useMemo(() => chipsActivos(filtros), [filtros]);
  const totalPaginas = Math.max(1, Math.ceil(resultados.length / TAM_PAGINA));
  const paginaActual = Math.min(pagina, totalPaginas);
  const visibles = resultados.slice((paginaActual - 1) * TAM_PAGINA, paginaActual * TAM_PAGINA);

  const value = {
    avisos, getAviso, toggleFav, retirarOferta,
    busqueda, setBusqueda, filtro, terminoMostrado, cargando, buscar, limpiarBusqueda,
    filtros, chips, toggleCategoria, toggleEstado, setCurso, setPrecio, limpiarFiltros, quitarChip, verCurso,
    orden, setOrden,
    resultados, visibles, pagina: paginaActual, totalPaginas, setPagina,
  };
  return <CatalogoContext.Provider value={value}>{children}</CatalogoContext.Provider>;
}

export function useCatalogo() {
  const ctx = useContext(CatalogoContext);
  if (!ctx) throw new Error('useCatalogo debe usarse dentro de <CatalogoProvider>');
  return ctx;
}
