import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DESTACADOS, DIAS_EDICION, TEXTOS_PUNTAJE, hoyMasDias, montoSoles } from './ratingsData';
import { Miniatura, primerNombre } from './ratingsUi';

const DATOS_PERSONALES = /\S+@\S+\.\S+|\b\d{9}\b|\b\d{3}[\s-]\d{3}[\s-]\d{3}\b/;

export default function RateForm({ acuerdo, calificacion, onPublicar, onEliminar, onCancelar }) {
  const editando = Boolean(calificacion);
  const [estrellas, setEstrellas] = useState(calificacion?.estrellas || 0);
  const [hover, setHover] = useState(0);
  const [destacados, setDestacados] = useState(calificacion?.destacados || []);
  const [texto, setTexto] = useState(calificacion?.texto || '');
  const [error, setError] = useState('');
  const [intento, setIntento] = useState(false);

  const mostrado = hover || estrellas;
  const plazo = calificacion?.editableHasta || hoyMasDias(DIAS_EDICION);

  const alternar = d => setDestacados(prev => (prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]));

  const enviar = e => {
    e.preventDefault();
    setIntento(true);
    if (estrellas === 0) return;
    if (DATOS_PERSONALES.test(texto)) {
      setError('Tu comentario parece incluir un teléfono o correo. Quita los datos personales para publicar.');
      return;
    }
    setError('');
    onPublicar({ estrellas, texto: texto.trim(), destacados, editableHasta: plazo });
  };

  return (
    <section className="hu6-page">
      <div className="wrap wrap-hu6" style={{ paddingTop: 28, paddingBottom: 48 }}>
        <div className="hu6-narrow">
          <nav className="hint hu6-crumbs" aria-label="Ruta">
            <Link to="/acuerdos">Mis acuerdos</Link> › <span>{acuerdo.id}</span> › <strong>{editando ? 'Editar calificación' : 'Calificar'}</strong>
          </nav>

          <h1>{editando ? `Actualiza tu calificación a ${primerNombre(acuerdo.contraparte.nombre)}` : `¿Cómo te fue con ${primerNombre(acuerdo.contraparte.nombre)}?`}</h1>
          <p className="sub" style={{ margin: '8px 0 24px' }}>Tu calificación es pública y ayuda a que el tablón siga siendo confiable.</p>

          <div className="card hu6-product-card">
            <Miniatura src={acuerdo.imagen} alt={acuerdo.titulo} size={88} />
            <div>
              <h2 style={{ fontSize: 18, lineHeight: '24px' }}>{acuerdo.titulo}</h2>
              <p className="hint">Acuerdo {acuerdo.id} · entregado el {acuerdo.entregado} · {acuerdo.lugar}</p>
              <p className="hu6-price">{montoSoles(acuerdo.precio)} <span>{acuerdo.contraparte.rol.toLowerCase()}: {acuerdo.contraparte.nombre}</span></p>
            </div>
          </div>

          <form onSubmit={enviar} noValidate>
            <div className="field" style={{ marginBottom: 28 }}>
              <label>TU PUNTAJE</label>
              <div className="hu6-rate" role="radiogroup" aria-label="Puntaje">
                {[1, 2, 3, 4, 5].map(n => (
                  <button key={n} type="button" role="radio" aria-checked={estrellas === n} aria-label={`${n} de 5`}
                    className={n <= mostrado ? 'on' : ''}
                    onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)} onClick={() => setEstrellas(n)}>★</button>
                ))}
              </div>
              {mostrado > 0
                ? <span className="hint"><strong style={{ color: 'var(--ink)', fontSize: 15 }}>{mostrado} de 5</strong> — {TEXTOS_PUNTAJE[mostrado - 1]}</span>
                : <span className={intento ? 'error-msg' : 'hint'}>Selecciona un puntaje para publicar tu calificación.</span>}
            </div>

            <div className="field" style={{ marginBottom: 28 }}>
              <label>¿QUÉ DESTACARÍAS? (OPCIONAL)</label>
              <div className="chips">
                {DESTACADOS.map(d => (
                  <button key={d} type="button" className={`chip${destacados.includes(d) ? ' active' : ''}`} aria-pressed={destacados.includes(d)} onClick={() => alternar(d)}>{d}</button>
                ))}
              </div>
            </div>

            <div className="field" style={{ marginBottom: 8 }}>
              <label htmlFor="hu6Comentario">COMENTARIO</label>
              <textarea id="hu6Comentario" className={`hu6-textarea${error ? ' is-invalid' : ''}`} value={texto} maxLength={300}
                onChange={e => setTexto(e.target.value)} placeholder="Cuéntale brevemente qué pasó…" />
              {error
                ? <span className="error-msg">{error}</span>
                : <span className="hint">{texto.length}/300 caracteres. Evita datos personales.</span>}
            </div>

            <p className="hint" style={{ margin: '20px 0 28px' }}>
              Puedes editar tu calificación hasta el {plazo} ({DIAS_EDICION} días después de la entrega). Luego queda fija.
            </p>

            <div className="hu6-actions">
              {editando && <button type="button" className="btn hu6-btn-danger-text" onClick={onEliminar}>Eliminar calificación</button>}
              <span style={{ flex: 1 }} />
              <button type="button" className="btn btn-ghost" onClick={onCancelar}>{editando ? 'Cancelar' : 'Calificar después'}</button>
              <button type="submit" className="btn btn-primary" disabled={estrellas === 0}>{editando ? 'Actualizar calificación' : 'Publicar calificación'}</button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
