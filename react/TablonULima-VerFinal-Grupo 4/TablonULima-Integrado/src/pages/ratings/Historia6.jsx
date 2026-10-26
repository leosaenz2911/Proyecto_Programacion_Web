import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useAcuerdo } from '../../context/AcuerdoContext';
import RateForm from './RateForm';
import PublicProfile from './PublicProfile';
import { Avatar, Estrellas, Miniatura } from './ratingsUi';
import { DATOS_ROSA, PERFILES, ROSA_ID, esFemenina, formatoFecha, idPorNombre, montoSoles, resenasDeEjemplo } from './ratingsData';
import { actualizar, useRatings } from './ratingsStore';
import './css_historia6.css';

const VISIBLES_RECIBIDAS = 5;
const LOGO = '/img/logo_ulima.png';

// «2026-10-15T10:00» → «15/10/2026»
const fechaDeAcuerdo = iso => (iso ? iso.slice(0, 10).split('-').reverse().join('/') : formatoFecha(new Date()));

export default function Historia6() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { acuerdos = [] } = useAcuerdo() || {};
  const userId = user?.id;
  const datos = useRatings(userId);

  const [vista, setVista] = useState('lista');          // lista | calificar | perfil
  const [tab, setTab] = useState('emitidas');
  const [activo, setActivo] = useState(null);           // acuerdo que se está calificando
  const [enEdicion, setEnEdicion] = useState(null);     // calificación que se está editando
  const [perfilId, setPerfilId] = useState(null);
  const [perfilNombre, setPerfilNombre] = useState(null);
  const [aEliminar, setAEliminar] = useState(null);
  const [verTodasRecibidas, setVerTodasRecibidas] = useState(false);

  const miNombre = user ? `${user.nombres} ${user.apellidos}` : '';

  // Los acuerdos que se marcan «Entregado» en Acuerdos aparecen aquí listos para calificar.
  const pendientes = useMemo(() => {
    const yaVistos = new Set([...datos.emitidas, ...datos.pendientes].map(a => a.id));
    const desdeAcuerdos = acuerdos
      .filter(a => a.estado === 'Entregado' && !yaVistos.has(a.id))
      .map(a => {
        const pid = idPorNombre(a.contraparte);
        return {
          id: a.id, avisoId: null, titulo: a.producto, imagen: a.imagen || LOGO, precio: a.monto, lugar: a.lugar,
          entregado: fechaDeAcuerdo(a.fecha),
          contraparte: { id: pid, nombre: pid ? PERFILES[pid].nombre : a.contraparte, rol: a.rol === 'Comprador' ? 'Vendedor' : 'Comprador' },
        };
      });
    return [...datos.pendientes, ...desdeAcuerdos];
  }, [datos, acuerdos]);

  const emitidas = datos.emitidas;
  const recibidas = datos.recibidas;
  const promedio = lista => (lista.length ? lista.reduce((a, r) => a + r.estrellas, 0) / lista.length : 0);

  // ---------- acciones ----------
  const abrirCalificar = acuerdo => { setActivo(acuerdo); setEnEdicion(null); setVista('calificar'); };
  const abrirEditar = cal => { setActivo(cal); setEnEdicion(cal); setVista('calificar'); };
  const volverLista = () => { setVista('lista'); setActivo(null); setEnEdicion(null); setPerfilId(null); };

  const publicar = ({ estrellas, texto, destacados, editableHasta }) => {
    if (enEdicion) {
      actualizar(userId, d => ({ ...d, emitidas: d.emitidas.map(c => (c.id === enEdicion.id ? { ...c, estrellas, texto, destacados } : c)) }));
      showToast(`Éxito. Actualizaste tu calificación para ${activo.contraparte.nombre}.`, 'success');
    } else {
      const nueva = { ...activo, estrellas, texto, destacados, editableHasta, editable: true, fecha: formatoFecha(new Date()) };
      actualizar(userId, d => ({ ...d, emitidas: [nueva, ...d.emitidas], pendientes: d.pendientes.filter(p => p.id !== activo.id) }));
      showToast(`Éxito. Tu calificación se publicó en el perfil de ${activo.contraparte.nombre}.`, 'success');
    }
    setTab('emitidas');
    volverLista();
  };

  const eliminar = cal => {
    const { estrellas, texto, destacados, editableHasta, editable, fecha, ...acuerdo } = cal; // vuelve a «pendiente»
    actualizar(userId, d => ({ ...d, emitidas: d.emitidas.filter(c => c.id !== cal.id), pendientes: [acuerdo, ...d.pendientes] }));
    showToast('Calificación eliminada. Puedes volver a calificar este acuerdo cuando quieras.', 'info');
    setAEliminar(null);
    volverLista();
  };

  const abrirPerfil = (id, nombre = null) => { setPerfilId(id || 'desconocido'); setPerfilNombre(nombre); setVista('perfil'); };

  // ---------- perfiles públicos ----------
  const armarPerfil = (id, nombreFallback) => {
    if (id === 'propio') {
      const esRosa = userId === ROSA_ID;
      const resenas = recibidas.map(r => ({
        ...r, autorNombre: PERFILES[r.autorId].nombre,
        meta: `${PERFILES[r.autorId].carrera} · ${esFemenina(r.autorId) ? 'compradora' : 'comprador'} · acuerdo ${r.id}`,
      }));
      return {
        nombre: miNombre, carrera: user.carrera, ciclo: (user.ciclo || '').toLowerCase(), desde: 'marzo de 2026',
        rating: promedio(recibidas), total: resenas.length, acuerdos: esRosa ? DATOS_ROSA.acuerdosCerrados : datos.acuerdosCerrados,
        resenas, completo: true, esPropio: true,
      };
    }
    const info = PERFILES[id] || { nombre: nombreFallback || 'Usuario del tablón', carrera: 'Estudiante de la Universidad de Lima', ciclo: null, desde: null, rating: 0, total: 0, acuerdos: 0 };
    const mias = PERFILES[id] ? emitidas.filter(c => c.contraparte.id === id) : [];
    const semilla = new Set(DATOS_ROSA.emitidas.map(c => c.id));
    const nuevas = mias.filter(c => !semilla.has(c.id));
    const total = info.total + nuevas.length;
    const rating = total ? (info.rating * info.total + nuevas.reduce((a, c) => a + c.estrellas, 0)) / total : 0;
    const deRosa = mias.map(c => ({
      id: c.id, titulo: c.titulo, imagen: c.imagen, estrellas: c.estrellas, fecha: c.fecha, texto: c.texto || 'Sin comentario.',
      autorNombre: miNombre, meta: `${user.carrera} · ${c.contraparte.rol.toLowerCase().startsWith('comprador') ? 'vendedor' : 'comprador'} · acuerdo ${c.id}`,
    }));
    const ejemplos = PERFILES[id] ? resenasDeEjemplo(id).map(r => ({
      ...r, autorNombre: PERFILES[r.autorId].nombre, meta: `${PERFILES[r.autorId].carrera} · acuerdo ${r.id}`,
    })) : [];
    return { ...info, rating, total, resenas: [...deRosa, ...ejemplos], completo: false, esPropio: false };
  };

  // ---------- vistas ----------
  if (vista === 'calificar' && activo) {
    return (
      <>
        <RateForm acuerdo={activo} calificacion={enEdicion} onPublicar={publicar} onCancelar={volverLista}
          onEliminar={() => setAEliminar(enEdicion)} />
        {aEliminar && <ConfirmarEliminar cal={aEliminar} onCancelar={() => setAEliminar(null)} onConfirmar={() => eliminar(aEliminar)} />}
      </>
    );
  }

  if (vista === 'perfil' && perfilId) {
    return (
      <PublicProfile perfil={armarPerfil(perfilId, perfilNombre)} onVolver={volverLista}
        onReportado={nombre => showToast(`Reporte enviado. Un administrador revisará el caso de ${nombre} en un plazo de 48 horas.`, 'success')} />
    );
  }

  const lista = tab === 'emitidas' ? emitidas : recibidas;
  const prom = promedio(lista);
  const recibidasVisibles = verTodasRecibidas ? recibidas : recibidas.slice(0, VISIBLES_RECIBIDAS);
  const confiable = tab === 'recibidas' && (userId === ROSA_ID ? DATOS_ROSA.acuerdosCerrados : datos.acuerdosCerrados) > 10 && prom >= 4.5;

  return (
    <section className="hu6-page">
      <div className="wrap wrap-hu6" style={{ paddingBottom: 48 }}>
        <div className="page-head" style={{ paddingBottom: 0 }}>
          <h1>Mis calificaciones</h1>
          <p className="hint" style={{ marginTop: 4 }}>
            {pendientes.length > 0 ? `${pendientes.length} acuerdo${pendientes.length > 1 ? 's' : ''} pendiente${pendientes.length > 1 ? 's' : ''} de calificar` : 'Estás al día con tus calificaciones'}
          </p>
        </div>

        <div className="hu6-tabs" role="tablist">
          <button type="button" role="tab" aria-selected={tab === 'emitidas'} className={tab === 'emitidas' ? 'active' : ''} onClick={() => setTab('emitidas')}>
            Emitidas · {emitidas.length + pendientes.length}
          </button>
          <button type="button" role="tab" aria-selected={tab === 'recibidas'} className={tab === 'recibidas' ? 'active' : ''} onClick={() => setTab('recibidas')}>
            Recibidas · {recibidas.length}
          </button>
        </div>

        <div className="hu6-grid">
          <div className="hu6-list">
            {tab === 'emitidas' && (
              <>
                {emitidas.length + pendientes.length === 0 && (
                  <EstadoVacio titulo="Todavía no has calificado a nadie" texto="Cuando confirmes una entrega podrás calificar a la otra parte." />
                )}

                {pendientes.length > 0 && <div className="eyebrow hu6-group">PENDIENTES DE CALIFICAR</div>}
                {pendientes.map(p => (
                  <article key={p.id} className="hu6-card hu6-pending">
                    <Miniatura src={p.imagen} alt={p.titulo} />
                    <div className="hu6-card-body">
                      <strong className="hu6-title static">{p.titulo}</strong>
                      <p className="hint">{p.id} · a {p.contraparte.nombre} · entregado el {p.entregado}</p>
                      <p className="hint">{montoSoles(p.precio)} · {p.lugar}</p>
                    </div>
                    <span className="hu6-badge hu6-badge-warn">Pendiente de calificar</span>
                    <button type="button" className="btn btn-primary" onClick={() => abrirCalificar(p)}>Calificar</button>
                  </article>
                ))}

                {emitidas.length > 0 && <div className="eyebrow hu6-group">CALIFICACIONES EMITIDAS</div>}
                {emitidas.map(c => (
                  <article key={c.id} className="hu6-card">
                    <Miniatura src={c.imagen} alt={c.titulo} />
                    <div className="hu6-card-body">
                      <div className="hu6-review-top">
                        <button type="button" className="hu6-title" onClick={() => abrirPerfil(c.contraparte.id, c.contraparte.nombre)}>{c.titulo}</button>
                        <Estrellas valor={c.estrellas} />
                      </div>
                      <p className="hint">{c.id} · a {c.contraparte.nombre} · {c.fecha}</p>
                      <p className="hu6-text" style={{ color: c.texto ? 'var(--ink)' : 'var(--muted)' }}>{c.texto || 'Sin comentario.'}</p>
                      {c.destacados?.length > 0 && (
                        <div className="hu6-tags">{c.destacados.map(d => <span key={d} className="hu6-tag">{d}</span>)}</div>
                      )}
                      <div className="hu6-card-foot">
                        {c.editable ? (
                          <>
                            <span className="hint">Editable hasta el {c.editableHasta}</span>
                            <span className="hu6-card-actions">
                              <button type="button" className="btn btn-secondary hu6-btn-sm" onClick={() => abrirEditar(c)}>Editar</button>
                              <button type="button" className="btn hu6-btn-danger-text hu6-btn-sm" onClick={() => setAEliminar(c)}>Eliminar</button>
                            </span>
                          </>
                        ) : <span className="hint">Plazo de edición vencido</span>}
                      </div>
                    </div>
                  </article>
                ))}
              </>
            )}

            {tab === 'recibidas' && (
              <>
                {recibidas.length === 0 && (
                  <EstadoVacio titulo="Todavía no has recibido calificaciones" texto="Cuando cierres acuerdos, las personas con quienes tratas podrán calificarte." />
                )}
                {recibidasVisibles.map(r => {
                  const autor = PERFILES[r.autorId];
                  return (
                    <article key={`${r.id}-${r.autorId}`} className="hu6-card">
                      <Miniatura src={r.imagen} alt={r.titulo} />
                      <div className="hu6-card-body">
                        <div className="hu6-review-top">
                          <Estrellas valor={r.estrellas} />
                          <span className="hu6-date">{r.fecha}</span>
                        </div>
                        <p className="hu6-text">{r.texto}</p>
                        <button type="button" className="hu6-author" onClick={() => abrirPerfil(r.autorId)}>
                          <Avatar nombre={autor.nombre} size={26} />
                          <span><strong>{autor.nombre}</strong> · {autor.carrera}</span>
                        </button>
                        <p className="hint" style={{ marginTop: 6 }}>{r.id} · {r.titulo}</p>
                      </div>
                    </article>
                  );
                })}
                {recibidas.length > VISIBLES_RECIBIDAS && !verTodasRecibidas && (
                  <button type="button" className="btn btn-secondary" style={{ alignSelf: 'flex-start' }} onClick={() => setVerTodasRecibidas(true)}>
                    Ver las {recibidas.length - VISIBLES_RECIBIDAS} calificaciones restantes
                  </button>
                )}
              </>
            )}
          </div>

          <aside className="card hu6-side">
            <div className="eyebrow">PESTAÑA «{tab.toUpperCase()}»</div>
            <div className="hu6-side-score">
              <span className="hu6-big">{lista.length ? prom.toFixed(1) : '0.0'}</span>
              <div>
                <Estrellas valor={prom} />
                <div className="hint">promedio de {lista.length} calificaciones</div>
              </div>
            </div>
            {confiable && <span className="badge-ok" style={{ marginTop: 0 }}>Vendedora confiable</span>}
            {tab === 'recibidas' ? (
              <>
                <p className="hint" style={{ marginTop: 14 }}>Las calificaciones recibidas no se pueden editar ni eliminar.</p>
                <button type="button" className="btn btn-secondary btn-block" style={{ marginTop: 14 }} onClick={() => abrirPerfil('propio')}>Ver mi perfil público</button>
              </>
            ) : (
              <p className="hint" style={{ marginTop: 14 }}>
                Puedes editar o eliminar una calificación hasta 7 días después de la entrega. Luego queda fija.
              </p>
            )}
          </aside>
        </div>
      </div>

      {aEliminar && <ConfirmarEliminar cal={aEliminar} onCancelar={() => setAEliminar(null)} onConfirmar={() => eliminar(aEliminar)} />}
    </section>
  );
}

function EstadoVacio({ titulo, texto }) {
  return (
    <div className="card hu6-empty">
      <div className="big-icon">★</div>
      <h2>{titulo}</h2>
      <p className="hint" style={{ margin: '6px 0 16px' }}>{texto}</p>
      <Link className="btn btn-primary" to="/acuerdos">Ver mis acuerdos</Link>
    </div>
  );
}

function ConfirmarEliminar({ cal, onCancelar, onConfirmar }) {
  return (
    <div className="hu6-backdrop" onClick={onCancelar}>
      <div className="hu6-modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Eliminar calificación">
        <div className="hu6-modal-head"><h2>Eliminar calificación</h2><button type="button" aria-label="Cerrar" onClick={onCancelar}>✕</button></div>
        <div className="hu6-modal-product">
          <Miniatura src={cal.imagen} alt={cal.titulo} size={56} />
          <div><strong>{cal.titulo}</strong><p className="hint">{cal.id} · a {cal.contraparte.nombre}</p></div>
        </div>
        <p style={{ margin: '14px 0' }}>Tu calificación dejará de verse en el perfil de {cal.contraparte.nombre}. El acuerdo volverá a «pendiente de calificar» y podrás calificar de nuevo.</p>
        <div className="hu6-actions" style={{ justifyContent: 'flex-end' }}>
          <button type="button" className="btn btn-ghost" onClick={onCancelar}>Volver</button>
          <button type="button" className="btn btn-danger" onClick={onConfirmar}>Eliminar calificación</button>
        </div>
      </div>
    </div>
  );
}
