import { useState } from 'react';
import { distribucion } from './ratingsData';
import { Avatar, Estrellas, Miniatura } from './ratingsUi';

const MOTIVOS = [
  'Conducta ofensiva o lenguaje inapropiado',
  'Posible estafa o pedido de pagos fuera del campus',
  'No se presentó al encuentro acordado',
  'Perfil falso o suplantación',
  'Otro motivo',
];
const VISIBLES = 5;

export default function PublicProfile({ perfil, onVolver, onReportado }) {
  const [filtro, setFiltro] = useState('todos');
  const [verTodas, setVerTodas] = useState(false);
  const [reportando, setReportando] = useState(false);
  const [motivo, setMotivo] = useState('');
  const [detalle, setDetalle] = useState('');
  const [errorReporte, setErrorReporte] = useState('');

  const dist = perfil.completo
    ? perfil.resenas.reduce((d, r) => ({ ...d, [r.estrellas]: d[r.estrellas] + 1 }), { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 })
    : distribucion(perfil.rating, perfil.total);
  const total = perfil.completo ? perfil.resenas.length : perfil.total;
  const promedio = perfil.completo
    ? (perfil.resenas.reduce((a, r) => a + r.estrellas, 0) / (perfil.resenas.length || 1))
    : perfil.rating;
  const promedioTxt = total ? promedio.toFixed(1) : '—';
  const confiable = perfil.acuerdos > 10 && promedio >= 4.5;

  const conteoFiltro = { todos: total, 5: dist[5], 4: dist[4], bajo: dist[3] + dist[2] + dist[1] };
  const lista = perfil.resenas.filter(r => filtro === 'todos' || (filtro === 'bajo' ? r.estrellas <= 3 : r.estrellas === filtro));
  const mostradas = verTodas ? lista : lista.slice(0, VISIBLES);
  const restantes = lista.length - mostradas.length;

  const enviarReporte = e => {
    e.preventDefault();
    if (!motivo || detalle.trim().length < 30) {
      setErrorReporte('Faltan datos. Selecciona un motivo y describe el problema con al menos 30 caracteres.');
      return;
    }
    setReportando(false); setMotivo(''); setDetalle(''); setErrorReporte('');
    onReportado(perfil.nombre);
  };

  return (
    <section className="hu6-page">
      <div className="wrap wrap-hu6" style={{ paddingTop: 28, paddingBottom: 48 }}>
        <nav className="hint hu6-crumbs" aria-label="Ruta">
          <button type="button" className="hu6-link" onClick={onVolver}>Calificaciones</button> › <strong>Perfil de {perfil.nombre}</strong>
        </nav>

        <div className="card hu6-profile-head">
          <span className="avatar" style={{ margin: 0 }}>{perfil.nombre.split(' ').slice(0, 2).map(n => n[0]).join('')}</span>
          <div style={{ flex: 1 }}>
            <h1 className="hu6-name">
              {perfil.nombre}
              {confiable && <span className="badge-ok" style={{ marginTop: 0 }}>{perfil.esPropio ? 'Vendedora confiable' : 'Usuario confiable'}</span>}
            </h1>
            <p className="sub" style={{ fontSize: 15 }}>
              {perfil.carrera}{perfil.ciclo ? ` · ${perfil.ciclo} ciclo` : ''}{perfil.desde ? ` · en el tablón desde ${perfil.desde}` : ''}
            </p>
            <p className="hu6-headline"><strong>{promedioTxt}</strong> {total > 0 && <Estrellas valor={promedio} />} <span className="hint">({total} calificaciones recibidas)</span></p>
          </div>
          <div className="hu6-stats">
            <div><b>{perfil.acuerdos}</b><span>acuerdos cerrados</span></div>
            <div><b>{perfil.acuerdos > 0 ? '100 %' : '—'}</b><span>entregas confirmadas</span></div>
          </div>
          {!perfil.esPropio && (
            <button type="button" className="btn hu6-btn-danger-text" onClick={() => setReportando(true)}>Reportar usuario</button>
          )}
        </div>

        <div className="hu6-profile-grid">
          <aside className="card hu6-dist">
            <div className="eyebrow">DISTRIBUCIÓN DE PUNTAJES</div>
            <div className="hu6-big">{promedioTxt}</div>
            {total > 0 && <Estrellas valor={promedio} grande />}
            <p className="hint" style={{ margin: '4px 0 16px' }}>{total} calificaciones recibidas</p>
            {[5, 4, 3, 2, 1].map(n => (
              <div key={n} className="hu6-bar-row">
                <span>{n} ★</span>
                <div className="hu6-bar"><i style={{ width: total ? `${(dist[n] / total) * 100}%` : 0 }} /></div>
                <b>{dist[n]}</b>
              </div>
            ))}
            <p className="hint" style={{ marginTop: 16 }}>
              {confiable ? 'Vendedora confiable: más de 10 acuerdos cerrados con un promedio mayor o igual a 4.5. ' : ''}
              La reputación se calcula solo con acuerdos entregados y confirmados por ambas partes.
            </p>
          </aside>

          <div>
            <div className="hu6-comments-head">
              <h2>{perfil.completo ? 'Comentarios recibidos' : 'Últimas calificaciones recibidas'}</h2>
              {perfil.completo && (
                <div className="hu6-pills" role="group" aria-label="Filtrar por puntaje">
                  {[['todos', 'Todos'], [5, '5 ★'], [4, '4 ★'], ['bajo', '3 ★ o menos']].map(([k, etiqueta]) => (
                    <button key={k} type="button" className={`hu6-pill${filtro === k ? ' active' : ''}`} onClick={() => { setFiltro(k); setVerTodas(false); }}>
                      {etiqueta} · {conteoFiltro[k]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {mostradas.length === 0 ? (
              <div className="card hu6-empty">
                <h3>Aún no hay calificaciones</h3>
                <p className="hint">Cuando se cierren acuerdos con esta persona, sus calificaciones aparecerán aquí.</p>
              </div>
            ) : (
              <div className="hu6-list">
                {mostradas.map(r => (
                  <article key={`${r.id}-${r.autorId}`} className="hu6-review">
                    {r.imagen && <Miniatura src={r.imagen} alt={r.titulo} size={56} />}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="hu6-review-top">
                        <Estrellas valor={r.estrellas} />
                        <span className="hu6-date">{r.fecha}</span>
                      </div>
                      <p className="hu6-text">{r.texto}</p>
                      <div className="hu6-author static">
                        <Avatar nombre={r.autorNombre} size={26} />
                        <span><strong>{r.autorNombre}</strong> · {r.meta}</span>
                      </div>
                    </div>
                  </article>
                ))}
                {restantes > 0 && (
                  <button type="button" className="btn btn-secondary" style={{ alignSelf: 'flex-start' }} onClick={() => setVerTodas(true)}>
                    Ver las {restantes} calificaciones restantes
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {reportando && (
        <div className="hu6-backdrop" onClick={() => setReportando(false)}>
          <form className="hu6-modal" onClick={e => e.stopPropagation()} onSubmit={enviarReporte} role="dialog" aria-modal="true" aria-label="Reportar usuario">
            <div className="hu6-modal-head"><h2>Reportar usuario</h2><button type="button" aria-label="Cerrar" onClick={() => setReportando(false)}>✕</button></div>
            <p className="hint" style={{ marginBottom: 12 }}>{perfil.nombre}</p>
            {errorReporte && <div className="alert alert-error"><strong>Faltan datos.</strong> {errorReporte.replace('Faltan datos. ', '')}</div>}
            <label>MOTIVO DEL REPORTE *</label>
            <div className="hu6-radios">
              {MOTIVOS.map(m => (
                <label key={m} className="check-label"><input type="radio" name="motivo" checked={motivo === m} onChange={() => setMotivo(m)} /> {m}</label>
              ))}
            </div>
            <div className="field" style={{ marginTop: 16 }}>
              <label htmlFor="hu6Detalle">DESCRIPCIÓN *</label>
              <textarea id="hu6Detalle" className="hu6-textarea" value={detalle} onChange={e => setDetalle(e.target.value)} placeholder="Cuéntanos qué pasó con el mayor detalle posible…" />
              <span className="hint">Mínimo 30 caracteres ({detalle.trim().length}/30). Tu reporte es anónimo para la otra parte. Un administrador lo revisará en un plazo de 48 horas.</span>
            </div>
            <div className="hu6-actions" style={{ justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-ghost" onClick={() => setReportando(false)}>Cancelar</button>
              <button type="submit" className="btn btn-primary">Enviar reporte</button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
