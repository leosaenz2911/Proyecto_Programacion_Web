import { useState, useEffect } from 'react';
import { useOferta } from '../../context/ofertaContext.jsx';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAcuerdo } from '../../context/AcuerdoContext.jsx';
const ulimaLogo = '/img/logo_ulima.png';
import './Ofertas.css';

const Ofertas = () => {
  const navigate = useNavigate(); 
  const location = useLocation();
  const { agregarAcuerdo } = useAcuerdo();
  const {
    usuarioActual,
    publicacionesRecibidas,
    ofertasEnviadas,
    actualizarEstadoOferta,
    retirarOfertaEnviada,
    agregarMensajeHistorial,
    agregarOfertaEnviada
  } = useOferta();

  const [tabActual, setTabActual] = useState('recibidas');
  const [filtroSeleccionado, setFiltroSeleccionado] = useState('Todas');
  const [ofertaSeleccionadaId, setOfertaSeleccionadaId] = useState(null);
  const [modalHiloData, setModalHiloData] = useState(null);
  const [modalContraData, setModalContraData] = useState(null);
  const [inputMontoContra, setInputMontoContra] = useState('');
  const [inputMensajeContra, setInputMensajeContra] = useState('');
  const [errorContra, setErrorContra] = useState('');
  const [mostrarAlertRetiro, setMostrarAlertRetiro] = useState(false);

  const procesarAcuerdo = (oferta, tituloAviso) => {
    actualizarEstadoOferta(oferta.id, 'Aceptada');
    
    const nuevoAcuerdo = {
      id: `ACU-${Date.now()}`,
      producto: tituloAviso || oferta.titulo, 
      contraparte: oferta.comprador || oferta.vendedor,
      rol: oferta.comprador ? 'Vendedor' : 'Comprador', 
      monto: oferta.montoOfertado,
      estado: 'Pendiente',
      lugar: 'Por coordinar',
      fecha: new Date().toISOString().slice(0, 16),
      imagen: oferta.imagen
    };

    agregarAcuerdo(nuevoAcuerdo);
    setModalHiloData(null); 
    navigate('/acuerdos');
  };


  const coincideEstado = (estadoOferta, filtro) => {
    if (filtro === 'Todas') return true;
    const est = String(estadoOferta || '').toLowerCase().trim();
    const filt = String(filtro || '').toLowerCase().trim();
    return est === filt || est === filt.replace(/s$/, '') || est.replace(/s$/, '') === filt;
  };

  const obtenerConteos = () => {
    if (tabActual === 'recibidas') {
      const todas = publicacionesRecibidas.flatMap(p => p.ofertas);
      return {
        'Todas': todas.length,
        'Recibidas': todas.filter(o => coincideEstado(o.estado, 'Recibidas')).length,
        'Contraofertadas': todas.filter(o => coincideEstado(o.estado, 'Contraofertadas')).length,
        'Aceptadas': todas.filter(o => coincideEstado(o.estado, 'Aceptadas')).length,
        'Rechazadas': todas.filter(o => coincideEstado(o.estado, 'Rechazadas')).length
      };
    } else {
      return {
        'Todas': ofertasEnviadas.length,
        'Enviadas': ofertasEnviadas.filter(o => coincideEstado(o.estado, 'Enviadas')).length,
        'Contraofertadas': ofertasEnviadas.filter(o => coincideEstado(o.estado, 'Contraofertadas')).length,
        'Aceptadas': ofertasEnviadas.filter(o => coincideEstado(o.estado, 'Aceptadas')).length,
        'Rechazadas': ofertasEnviadas.filter(o => coincideEstado(o.estado, 'Rechazadas')).length
      };
    }
  };

  const conteos = obtenerConteos();
  const cantRecibidas = publicacionesRecibidas.reduce((acc, p) => acc + p.ofertas.length, 0);
  const cantEnviadas = ofertasEnviadas.length;

  const toggleSeleccion = (id) => {
    setOfertaSeleccionadaId(prev => (prev === id ? null : id));
  };

  const abrirModalHilo = (oferta, tituloAviso, precioPedido, montoMinimo) => {
    setModalHiloData({ ...oferta, tituloAviso, precioPedido, montoMinimo });
  };

  const abrirModalContra = (oferta, tituloAviso, precioPedido, montoMinimo) => {
    setModalHiloData(null);
    const montoSugerido = (oferta.montoOfertado + 4.00).toFixed(2);
    setModalContraData({ ...oferta, tituloAviso, precioPedido, montoMinimo });
    setInputMontoContra(montoSugerido);
    setInputMensajeContra('');
    setErrorContra('');
  };

  const enviarContraoferta = () => {
    const val = parseFloat(inputMontoContra);
    const minAceptado = modalContraData?.montoMinimo || 50.00;

    if (isNaN(val) || val < minAceptado) {
      setErrorContra(`Corrige el monto. Sube tu oferta a S/ ${minAceptado.toFixed(2)} o más para poder enviarla.`);
      return;
    }

    agregarMensajeHistorial(modalContraData.id, {
      emisor: usuarioActual,
      monto: val,
      texto: inputMensajeContra || "Propuesta de contraoferta enviada.",
      fecha: "Hoy"
    });

    actualizarEstadoOferta(modalContraData.id, 'Contraofertada');
    setModalContraData(null);
    alert(`Éxito. Tu contraoferta de S/ ${val.toFixed(2)} se envió.`);
  };

  const handleRetirar = (id) => {
    if (window.confirm("¿Deseas retirar/eliminar esta oferta?")) {
      retirarOfertaEnviada(id);
      setMostrarAlertRetiro(true);
      setTimeout(() => setMostrarAlertRetiro(false), 3000);
    }
  };

  useEffect(() => {
    if (location.state && location.state.nuevaOferta) {
      agregarOfertaEnviada(location.state.nuevaOferta);
      
      setTabActual('enviadas');

      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  return (
    <>
      <main className="ofertas-page">
        <div className="ofertas-container">
          <h1 className="page-title">Ofertas</h1>

          <div className="primary-tabs">
            <button
              className={`tab-main ${tabActual === 'recibidas' ? 'active' : ''}`}
              onClick={() => { setTabActual('recibidas'); setFiltroSeleccionado('Todas'); setOfertaSeleccionadaId(null); }}
            >
              Recibidas · <span>{cantRecibidas}</span>
            </button>
            <button
              className={`tab-main ${tabActual === 'enviadas' ? 'active' : ''}`}
              onClick={() => { setTabActual('enviadas'); setFiltroSeleccionado('Todas'); setOfertaSeleccionadaId(null); }}
            >
              Enviadas · <span>{cantEnviadas}</span>
            </button>
          </div>

          <div className="filter-bar">
            <div className="filter-pills">
              {Object.keys(conteos).map(key => (
                <button
                  key={key}
                  className={`pill ${filtroSeleccionado === key ? 'active' : ''}`}
                  onClick={() => setFiltroSeleccionado(key)}
                >
                  {key} - {conteos[key]}
                </button>
              ))}
            </div>
            <span className="filter-legend">
              {tabActual === 'enviadas' ? "Ofertas realizadas en tus compras" : "Agrupadas por aviso · mejor oferta destacada"}
            </span>
          </div>

          {/* TAB RECIBIDAS */}
          {tabActual === 'recibidas' && (
            <div className="tab-view">
              {publicacionesRecibidas.map(pub => {
                const ofertasFiltradas = pub.ofertas.filter(o => coincideEstado(o.estado, filtroSeleccionado));
                if (ofertasFiltradas.length === 0) return null;

                return (
                  <div key={pub.idAviso} className="aviso-group-container">
                    <div className="aviso-header-banner">Aviso: {pub.tituloAviso}</div>
                    {ofertasFiltradas.map(o => {
                      const esSeleccionada = ofertaSeleccionadaId === o.id;
                      return (
                        <div
                          key={o.id}
                          className={`sent-card ${esSeleccionada ? 'highlighted-border' : ''}`}
                          onClick={(e) => e.target.tagName !== 'BUTTON' && toggleSeleccion(o.id)}
                        >
                          <div className="sent-card-left">
                            <img src={o.imagen} alt="Producto" className="product-thumb-img" onError={(e) => { e.target.src = ulimaLogo; }} />
                            <div className="item-info">
                              <h3>{o.comprador} <span className="rating-text">· {o.calificacion}</span></h3>
                              <p>Ofertada el {o.fecha} {o.esMejorOferta && <>· <strong className="best-offer-text">Mejor oferta</strong></>}</p>
                            </div>
                          </div>
                          <div className="sent-card-right">
                            <div className="price-display">
                              <span className="main-val">S/ {o.montoOfertado.toFixed(2)}</span>
                              <span className="sub-val">precio pedido S/ {pub.precioPublicado.toFixed(2)}</span>
                            </div>

                            {coincideEstado(o.estado, 'Recibida') && <span className="status-tag status-blue">Recibida</span>}
                            {coincideEstado(o.estado, 'Contraofertada') && <span className="status-plain-text">Contraofertada</span>}
                            {coincideEstado(o.estado, 'Aceptada') && <span className="status-plain-text">Aceptada</span>}
                            {coincideEstado(o.estado, 'Rechazada') && <span className="status-tag status-red">Rechazada</span>}

                            {esSeleccionada && (
                              <div className="action-buttons-group">
                                {coincideEstado(o.estado, 'Recibida') && (
                                  <>
                                    <button className="btn-solid-terracota" onClick={() => procesarAcuerdo(o, pub.tituloAviso)}>Aceptar</button>
                                    <button className="btn-outline-terracota" onClick={() => abrirModalContra(o, pub.tituloAviso, pub.precioPublicado, pub.montoMinimo)}>Contraofertar</button>
                                    <button className="btn-text-plain" onClick={() => { actualizarEstadoOferta(o.id, 'Rechazada'); alert("Acabas de rechazar la oferta"); }}>Rechazar</button>
                                  </>
                                )}
                                {(coincideEstado(o.estado, 'Contraofertada') || coincideEstado(o.estado, 'Rechazada')) && (
                                  <button className="btn-outline-terracota" onClick={() => abrirModalHilo(o, pub.tituloAviso, pub.precioPublicado, pub.montoMinimo)}>Ver hilo</button>
                                )}
                                {coincideEstado(o.estado, 'Aceptada') && (
                                  <button className="btn-green-agreement" onClick={() => navigate('/acuerdos')}>Ir al acuerdo</button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB ENVIADAS */}
          {tabActual === 'enviadas' && (
            <div className="tab-view">
              <div className="sent-offers-list">
                {ofertasEnviadas.filter(o => coincideEstado(o.estado, filtroSeleccionado)).map(o => {
                  const esSeleccionada = ofertaSeleccionadaId === o.id;
                  return (
                    <div
                      key={o.id}
                      className={`sent-card ${esSeleccionada ? 'highlighted-border' : ''}`}
                      onClick={(e) => e.target.tagName !== 'BUTTON' && toggleSeleccion(o.id)}
                    >
                      <div className="sent-card-left">
                        <img src={o.imagen} alt="Producto" className="product-thumb-img" onError={(e) => { e.target.src = ulimaLogo; }} />
                        <div className="item-info">
                          <h3>{o.titulo}</h3>
                          <p>Vendedor: {o.vendedor} {o.calificacion && `· ${o.calificacion}`} · {o.estado.toLowerCase()} el {o.fecha}</p>
                        </div>
                      </div>
                      <div className="sent-card-right">
                        <div className="price-display">
                          <span className="main-val">S/ {o.montoOfertado.toFixed(2)}</span>
                          {o.contraofertaMonto ? (
                            <span className="sub-val-orange">contraoferta S/ {o.contraofertaMonto.toFixed(2)}</span>
                          ) : (
                            <span className="sub-val">precio pedido S/ {o.precioPedido.toFixed(2)}</span>
                          )}
                        </div>

                        <span className={`status-tag status-${o.estado.toLowerCase().replace(' ', '')}`}>{o.estado}</span>

                        {esSeleccionada && (
                          <div className="action-buttons-group">
                            {coincideEstado(o.estado, 'Enviada') && (
                              <>
                                <button className="btn-outline-terracota" onClick={() => abrirModalHilo(o, o.titulo, o.precioPedido, o.montoMinimo)}>Ver hilo</button>
                                <button className="btn-text-plain" onClick={() => handleRetirar(o.id)}>Retirar</button>
                              </>
                            )}
                            {coincideEstado(o.estado, 'Contraofertada') && (
                              <>
                                <button className="btn-solid-terracota" onClick={() => abrirModalHilo(o, o.titulo, o.precioPedido, o.montoMinimo)}>Responder</button>
                                <button className="btn-text-plain" onClick={() => handleRetirar(o.id)}>Eliminar</button>
                              </>
                            )}
                            {coincideEstado(o.estado, 'Aceptada') && (
                              <>
                                <button className="btn-green-agreement" onClick={() => navigate('/acuerdos')}>Ir al acuerdo</button>
                                <button className="btn-text-plain" onClick={() => handleRetirar(o.id)}>Eliminar</button>
                              </>
                            )}
                            {coincideEstado(o.estado, 'Rechazada') && (
                              <>
                                <button className="btn-outline-terracota" onClick={() => abrirModalHilo(o, o.titulo, o.precioPedido, o.montoMinimo)}>Ver hilo</button>
                                <button className="btn-text-plain" onClick={() => handleRetirar(o.id)}>Eliminar</button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bottom-info-grid">
                <div className="rules-box">
                  <strong>Reglas de la negociación.</strong> Una sola oferta activa por aviso. Solo puedes retirar tu oferta mientras el vendedor no haya respondido. Toda oferta sin respuesta vence a los 7 días.
                </div>
                <div className="alerts-stack">
                  {mostrarAlertRetiro && (
                    <div className="alert-banner alert-neutral">
                      <span><strong>Oferta retirada.</strong> Puedes enviar una nueva cuando quieras.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* MODAL HILO */}
      {modalHiloData && (
        <div className="modal-backdrop">
          <div className="modal-card modal-hilo-card">
            <div className="modal-header">
              <div>
                <span className="subtitle-modal">Aviso: {modalHiloData.tituloAviso}</span>
                <h3>Negociación con {modalHiloData.comprador || modalHiloData.vendedor}</h3>
              </div>
              <button className="close-modal-btn" onClick={() => setModalHiloData(null)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="chat-history-box">
                {modalHiloData.historial.map((h, i) => {
                  const esMio = h.emisor === usuarioActual;
                  return (
                    <div key={i} className={`hilo-msg-card ${esMio ? 'es-mio' : ''}`}>
                      <div className="hilo-msg-header">
                        <span className="hilo-msg-user">{h.emisor}</span>
                        <span className="hilo-msg-tag">{esMio ? 'Tu propuesta' : 'Contraparte'}</span>
                      </div>
                      <div className="hilo-msg-monto">S/ {h.monto.toFixed(2)}</div>
                      <p className="hilo-msg-texto">«{h.texto}»</p>
                      <div className="hilo-msg-fecha">{h.fecha}</div>
                    </div>
                  );
                })}
              </div>

              <div className="hilo-actions-row">
                {coincideEstado(modalHiloData.estado, 'Aceptada') || coincideEstado(modalHiloData.estado, 'Rechazada') ? (
                  <button className="btn-outline-terracota" onClick={() => setModalHiloData(null)}>Cerrar</button>
                ) : (
                  <>
                    <button className="btn-green-agreement" onClick={() => procesarAcuerdo(modalHiloData, modalHiloData.tituloAviso)}>
                      Aceptar S/ {modalHiloData.montoOfertado.toFixed(2)}
                    </button>
                    <button className="btn-outline-terracota" onClick={() => abrirModalContra(modalHiloData, modalHiloData.tituloAviso, modalHiloData.precioPedido, modalHiloData.montoMinimo)}>
                      Nueva contraoferta
                    </button>
                    <button className="btn-text-plain" onClick={() => { actualizarEstadoOferta(modalHiloData.id, 'Rechazada'); setModalHiloData(null); alert("Acabas de rechazar la oferta"); }}>
                      Rechazar
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CONTRAOFERTA */}
      {modalContraData && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Enviar contraoferta</h3>
              <button className="close-modal-btn" onClick={() => setModalContraData(null)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="product-preview-box">
                <img src={modalContraData.imagen} alt="Producto" className="product-thumb-img" onError={(e) => { e.target.src = ulimaLogo; }} />
                <div>
                  <h4>{modalContraData.tituloAviso || modalContraData.titulo}</h4>
                  <p>Muy buen estado · Estado activo</p>
                </div>
              </div>

              <div className="comparison-bar-container">
                <div className="comp-col">
                  <span>Oferta recibida</span>
                  <strong>S/ {modalContraData.montoOfertado.toFixed(2)}</strong>
                </div>
                <div className="comp-col highlight-col">
                  <span>Tu contraoferta</span>
                  <strong>S/ {(parseFloat(inputMontoContra) || 0).toFixed(2)}</strong>
                </div>
                <div className="comp-col">
                  <span>Precio pedido</span>
                  <strong>S/ {modalContraData.precioPedido.toFixed(2)}</strong>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="inputMontoContra">MONTO QUE PROPONES</label>
                <input
                  type="number"
                  id="inputMontoContra"
                  step="1.00"
                  value={inputMontoContra}
                  onChange={(e) => setInputMontoContra(e.target.value)}
                />
                <span className="helper-text">
                  S/ {Math.abs((parseFloat(inputMontoContra) || 0) - modalContraData.montoOfertado).toFixed(2)} sobre la oferta recibida.
                </span>
              </div>

              <div className="form-group">
                <label htmlFor="inputMensajeContra">MENSAJE (OPCIONAL)</label>
                <textarea
                  id="inputMensajeContra"
                  rows="2"
                  placeholder="Escribe un mensaje corto..."
                  value={inputMensajeContra}
                  onChange={(e) => setInputMensajeContra(e.target.value)}
                />
              </div>

              {errorContra && <div className="alert-box-error">{errorContra}</div>}
            </div>
            <div className="modal-footer">
              <button className="btn-text-plain" onClick={() => setModalContraData(null)}>Cancelar</button>
              <button className="btn-solid-terracota" onClick={enviarContraoferta}>Enviar contraoferta</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Ofertas;