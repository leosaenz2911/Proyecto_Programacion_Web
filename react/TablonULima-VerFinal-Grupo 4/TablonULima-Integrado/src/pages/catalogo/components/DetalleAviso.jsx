import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { useCatalogo } from '../CatalogoContext.jsx';
import { VENDEDORES } from '../avisos.js';
import { ETIQUETAS_VISTA } from '../imagenes.js';
import { estrellas, iniciales, norm, soles } from '../formato.js';
import AvisoCard from './AvisoCard.jsx';

const ETIQUETA_FOTO = {
  'Libros de texto': 'portada del libro',
  Calculadoras: 'calculadora',
};

// Detalle del aviso. Cubre tres estados del mockup:
//  3.4 visitante sin sesión · 3.5 usuario con oferta activa propia · 3.6 aviso vendido.
export default function DetalleAviso({ aviso }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { avisos, toggleFav, retirarOferta, verCurso } = useCatalogo();

  const [vista, setVista] = useState(0);
  useEffect(() => { setVista(0); }, [aviso.id]);

  const vendedor = VENDEDORES[aviso.vendedorId];
  const esUsuario = user?.rol === 'USUARIO';
  const vendido = Boolean(aviso.vendido);
  // Si el usuario en sesión es quien publicó el aviso, no puede ofertar ni guardarlo.
  const esPropio = Boolean(user) && norm(`${user.nombres} ${user.apellidos}`) === norm(vendedor.nombre);
  const oferta = esPropio ? null : aviso.ofertaActiva;

  const irALogin = () => navigate('/login', { state: { from: `/catalogo/aviso/${aviso.id}`, needLogin: true } });
  const proximamente = () => showToast('Esta vista pertenece a otra historia del grupo.', 'info');

  const delVendedor = avisos.filter(a => a.vendedorId === aviso.vendedorId);
  const activosVendedor = delVendedor.filter(a => !a.vendido);
  const activosMismoCurso = activosVendedor.filter(a => a.curso === aviso.curso);
  const similares = avisos.filter(a => !a.vendido && a.id !== aviso.id && a.curso && a.curso === aviso.curso).slice(0, 3);

  const etiquetaFoto = ETIQUETA_FOTO[aviso.categoria] || 'producto';

  const retirar = () => {
    retirarOferta(aviso.id);
    showToast('Retiraste tu oferta. Ya puedes enviar otro monto.');
  };

  const handleOfertar = () => {
    const nuevaOferta = {
      id: `OFT-${Date.now()}`,
      titulo: aviso.titulo,
      imagen: aviso.imagen || aviso.galeria?.[0] || "",
      vendedor: vendedor.nombre,
      calificacion: `${vendedor.rating.toFixed(1)} ★`,
      fecha: "Hoy",
      montoOfertado: aviso.minimo || aviso.precio,
      precioPedido: aviso.precio,
      montoMinimo: aviso.minimo,
      estado: "Enviada",
      historial: []
    };

    navigate('/ofertas', { state: { nuevaOferta } });
  };

  return (
    <div className="detail-section">
      <nav className="breadcrumb" aria-label="Ruta de navegación">
        <Link to="/catalogo">Catálogo</Link>
        <span aria-hidden="true"> &gt; </span>{aviso.categoria}
        {aviso.curso && <><span aria-hidden="true"> &gt; </span>{aviso.curso}</>}
      </nav>

      <div className="detail-layout">
        <div className="detail-left">
          <div className="detail-main-img">
            {aviso.imagen && <img className="detail-img" src={(!vendido && aviso.galeria?.[vista]) || aviso.imagen} alt={`${aviso.titulo} — ${ETIQUETAS_VISTA[vista]}`} />}
            {vendido ? <span className="pill-vendido pill-vendido-lg">Vendido</span> : <span>fotografía principal · {etiquetaFoto}</span>}
          </div>

          {vendido ? (
            <div className="detail-description-card">
              <h3>Avisos similares del mismo curso</h3>
              <div className="similar-grid">
                {similares.map(a => (
                  <AvisoCard key={a.id} aviso={a} onAbrir={x => navigate(`/catalogo/aviso/${x.id}`)} />
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="thumbnails-grid">
                {Array.from({ length: aviso.fotos }, (_, i) => {
                  const img = aviso.galeria?.[i] || aviso.imagen;
                  return (
                    <div
                      key={i}
                      className={`thumb${i === vista ? ' active' : ''}${img ? ' thumb-clicable' : ''}`}
                      style={img ? { backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
                      onClick={aviso.galeria ? () => setVista(i) : undefined}
                      onKeyDown={aviso.galeria ? e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setVista(i); } } : undefined}
                      role={aviso.galeria ? 'button' : undefined}
                      tabIndex={aviso.galeria ? 0 : undefined}
                      aria-label={aviso.galeria ? `Ver ${ETIQUETAS_VISTA[i].toLowerCase()}` : undefined}
                      aria-pressed={aviso.galeria ? i === vista : undefined}
                      title={aviso.galeria ? ETIQUETAS_VISTA[i] : undefined}
                    />
                  );
                })}
              </div>
              <div className="detail-description-card">
                <h3>Descripción</h3>
                <p>{aviso.descripcion}</p>
                <div className="specs-grid">
                  <div><span className="spec-label">CATEGORÍA</span><strong>{aviso.categoria}</strong></div>
                  <div><span className="spec-label">CURSO</span><strong>{aviso.curso || '—'}</strong></div>
                  <div><span className="spec-label">ESTADO</span><strong>{aviso.estado}</strong></div>
                  <div><span className="spec-label">PUBLICADO</span><strong>{aviso.publicado}</strong></div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="detail-right">
          <div className="action-card">
            {vendido ? (
              <span className="chip-badge chip-success">Vendido el {aviso.vendido}</span>
            ) : (
              <span className="chip-badge chip-info">Publicado</span>
            )}
            <h2 className={vendido ? 'is-sold' : undefined}>{aviso.titulo}</h2>
            <div className={`detail-price${vendido ? ' is-sold' : ''}`}>{soles(aviso.precio)}</div>

            {!vendido && (
              <>
                <div className="detail-min-price">Acepta ofertas desde {soles(aviso.minimo)}</div>
                {!oferta && (
                  <div className="detail-chips">
                    <span className="chip-badge chip-soft">{aviso.estado}</span>
                    {aviso.curso && <span className="chip-badge chip-neutral">{aviso.curso}</span>}
                  </div>
                )}
              </>
            )}

            {vendido && (
              <>
                <div className="guest-notice-box neutral">
                  Este aviso ya se cerró y no acepta ofertas. Puedes ver avisos parecidos del mismo curso o crear una alerta de búsqueda.
                </div>
                <button type="button" className="btn btn-primary btn-block" onClick={() => { verCurso(aviso.curso); navigate('/catalogo'); }}>
                  Ver avisos de {aviso.curso}
                </button>
                <button type="button" className="btn btn-secondary btn-block" onClick={() => (user ? showToast('Alerta creada. Te avisaremos cuando alguien publique algo parecido.') : irALogin())}>
                  Crear alerta de búsqueda
                </button>
              </>
            )}

            {!vendido && !user && (
              <>
                <div className="guest-notice-box">
                  Inicia sesión con tu correo institucional para ofertar o guardar este aviso en favoritos.
                </div>
                <button type="button" className="btn btn-primary btn-block" onClick={irALogin}>Ingresar para ofertar</button>
                <button type="button" className="btn btn-secondary btn-block" onClick={irALogin}>♥ Guardar en favoritos</button>
              </>
            )}

            {!vendido && esUsuario && esPropio && (
              <>
                <div className="guest-notice-box">Este es tu aviso. Las ofertas que recibas aparecerán en tu bandeja de Ofertas.</div>
                <button type="button" className="btn btn-primary btn-block" onClick={() => navigate('/mis-publicaciones')}>Ver en Mis publicaciones</button>
                <button type="button" className="btn btn-secondary btn-block" onClick={() => navigate('/ofertas')}>Ver ofertas recibidas</button>
              </>
            )}

            {!vendido && esUsuario && !esPropio && (
              <>
                {oferta && (
                  <div className="offer-box">
                    <div className="offer-box-head">
                      <span className="chip-badge chip-info-solid">Oferta enviada</span>
                      <span className="offer-date">{oferta.fecha}</span>
                    </div>
                    <div className="offer-amount"><strong>{soles(oferta.monto)}</strong> <span>tu oferta activa</span></div>
                    <p className="offer-note">El vendedor todavía no responde. Solo se admite una oferta activa por aviso.</p>
                    <div className="offer-actions">
                      <button type="button" className="btn btn-primary btn-sm" onClick={() => navigate('/ofertas')}>Ver el hilo</button>
                      <button type="button" className="btn btn-secondary btn-sm" onClick={retirar}>Retirar oferta</button>
                    </div>
                  </div>
                )}
                <button type="button" className="btn btn-primary btn-block" disabled={Boolean(oferta)} onClick={handleOfertar}>
                  Ofertar
                </button>
                {oferta && <p className="hint-text">Retira tu oferta actual para enviar otro monto.</p>}
                <button type="button" className={`btn btn-secondary btn-block${aviso.fav ? ' is-saved' : ''}`} onClick={() => toggleFav(aviso.id)} aria-pressed={aviso.fav}>
                  {aviso.fav ? (oferta ? '♥ Guardado en favoritos' : '♥ Quitar de favoritos') : '♡ Guardar en favoritos'}
                </button>
              </>
            )}
          </div>

          <div className="seller-mini-card">
            <span className="seller-lbl">VENDEDOR</span>
            <div className="seller-mini-header">
              <div className="avatar-initials">{iniciales(vendedor.nombre)}</div>
              <div>
                <strong>{vendedor.nombre}</strong>
                {oferta || vendido ? (
                  <p>{vendedor.rating.toFixed(1)} ★ · {vendedor.cerrados} acuerdos cerrados{oferta && <> · responde en {vendedor.respondeLargo}</>}</p>
                ) : (
                  <p>{vendedor.carrera} · {vendedor.ciclo} ciclo · en el tablón desde {vendedor.desde}</p>
                )}
              </div>
              {(oferta || vendido) && (
                <Link className="btn-link seller-link-right" to={`/catalogo/vendedor/${vendedor.id}`}>Ver perfil</Link>
              )}
            </div>
            {vendido && (
              <p className="seller-note">
                Tiene {activosVendedor.length} avisos activos, {activosMismoCurso.length} de ellos de {aviso.curso}.
              </p>
            )}
            {!oferta && !vendido && (
              <>
                <div className="seller-rating-line">
                  <strong className="rating-num">{vendedor.rating.toFixed(1)}</strong>
                  <span className="stars" aria-hidden="true">{estrellas(vendedor.rating)}</span>
                  <span className="rating-sep">· {vendedor.cerrados} acuerdos cerrados</span>
                  {vendedor.confiable && <span className="chip-badge chip-success-sm">Vendedor confiable</span>}
                </div>
                <Link className="btn-link" to={`/catalogo/vendedor/${vendedor.id}`}>
                  Ver perfil y sus otros {activosVendedor.filter(a => a.id !== aviso.id).length} avisos →
                </Link>
              </>
            )}
          </div>

          {!oferta && !vendido && (
            <div className="report-box">
              <span>¿Este aviso incumple las normas del tablón?</span>
              <button type="button" className="btn-link" onClick={proximamente}>Reportar aviso</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
