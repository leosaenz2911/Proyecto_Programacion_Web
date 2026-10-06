const datosSistema = {
  usuarioActual: "Diego Vargas",
  
  publicacionesRecibidas: [
    {
      idAviso: "A01",
      tituloAviso: "Física Universitaria con Física Moderna — Sears & Zemansky, 13.ª ed.",
      precioPublicado: 110.00,
      montoMinimo: 80.00,
      ofertas: [
        {
          id: 101,
          comprador: "Carlos Mendoza Silva",
          calificacion: "4.8 ★",
          montoOfertado: 95.00,
          fecha: "30/08/2026",
          estado: "Recibida",
          esMejorOferta: true,
          historial: [{ emisor: "Carlos Mendoza Silva", monto: 95.00, texto: "Hola, te ofrezco 95.", fecha: "30/08/2026 14:20" }]
        },
        {
          id: 102,
          comprador: "Lucía Fernández Vega",
          calificacion: "4.2 ★",
          montoOfertado: 85.00,
          fecha: "29/08/2026",
          estado: "Recibida",
          esMejorOferta: false,
          historial: [{ emisor: "Lucía Fernández Vega", monto: 85.00, texto: "¿Disponible?", fecha: "29/08/2026 10:15" }]
        }
      ]
    },
    {
      idAviso: "A02",
      tituloAviso: "Calculadora Financiera HP 10bII+",
      precioPublicado: 140.00,
      montoMinimo: 110.00,
      ofertas: [
        {
          id: 103,
          comprador: "Mateo Gutiérrez Ruiz",
          calificacion: "4.6 ★",
          montoOfertado: 120.00,
          fecha: "28/08/2026",
          estado: "Contraofertada",
          esMejorOferta: false,
          historial: [
            { emisor: "Mateo Gutiérrez Ruiz", monto: 120.00, texto: "Ofrezco 120.", fecha: "27/08/2026 18:00" },
            { emisor: "Diego Vargas", monto: 130.00, texto: "Lo dejo en 130.", fecha: "28/08/2026 09:30" }
          ]
        }
      ]
    },
    {
      idAviso: "A03",
      tituloAviso: "Tabla Periódica e Instrumentos Químicos",
      precioPublicado: 45.00,
      montoMinimo: 35.00,
      ofertas: [
        {
          id: 104,
          comprador: "Sofía Alva Castro",
          calificacion: "4.9 ★",
          montoOfertado: 40.00,
          fecha: "27/08/2026",
          estado: "Aceptada",
          esMejorOferta: false,
          historial: [{ emisor: "Sofía Alva Castro", monto: 40.00, texto: "Trato hecho.", fecha: "27/08/2026" }]
        }
      ]
    }
  ],

  ofertasEnviadas: [
    {
      id: 1,
      titulo: "Química General — Chang, 11.ª ed.",
      vendedor: "Marco Antonio Loayza Pinto",
      calificacion: "4.3 ★",
      fecha: "30/08/2026",
      precioPedido: 85.00,
      montoMinimo: 65.00,
      montoOfertado: 72.00,
      estado: "Enviada",
      historial: [{ emisor: "Diego Vargas", monto: 72.00, texto: "Hola, te ofrezco 72.", fecha: "30/08/2026 11:00" }]
    },
    {
      id: 2,
      titulo: "Estuche de dibujo técnico Staedtler",
      vendedor: "Paola Zegarra Ibáñez",
      calificacion: "4.4 ★",
      fecha: "29/08/2026",
      precioPedido: 55.00,
      montoMinimo: 40.00,
      contraofertaMonto: 48.00,
      montoOfertado: 42.00,
      estado: "Contraofertada",
      historial: [
        { emisor: "Diego Vargas", monto: 42.00, texto: "Te ofrezco 42.", fecha: "28/08/2026 15:40" },
        { emisor: "Paola Zegarra Ibáñez", monto: 48.00, texto: "Mínimo 48.", fecha: "29/08/2026 10:20" }
      ]
    },
    {
      id: 3,
      titulo: "Cálculo — Larson, tomo I",
      vendedor: "Iván Palomino Rojas",
      calificacion: "4.5 ★",
      fecha: "28/08/2026",
      precioPedido: 78.00,
      montoMinimo: 60.00,
      montoOfertado: 70.00,
      estado: "Aceptada",
      historial: [{ emisor: "Diego Vargas", monto: 70.00, texto: "Acepto.", fecha: "28/08/2026" }]
    },
    {
      id: 4,
      titulo: "Mochila para laptop 15\" acolchada",
      vendedor: "Alejandra Cornejo Ríos",
      calificacion: "",
      fecha: "25/08/2026",
      precioPedido: 65.00,
      montoMinimo: 50.00,
      montoOfertado: 40.00,
      estado: "Rechazada",
      historial: [{ emisor: "Diego Vargas", monto: 40.00, texto: "¿40?", fecha: "25/08/2026" }]
    }
  ]
};

let tabActual = 'recibidas'; 
let filtroSeleccionado = 'Todas';
let ofertaSeleccionadaId = null;
let ofertaEnModal = null; 

document.addEventListener("DOMContentLoaded", () => {
  activarTab('recibidas');
});

function activarTab(tab) {
  tabActual = tab;
  filtroSeleccionado = 'Todas';
  ofertaSeleccionadaId = null;

  const tabRecibidas = document.getElementById("tabRecibidasBtn");
  const tabEnviadas = document.getElementById("tabEnviadasBtn");

  if (tabRecibidas) tabRecibidas.classList.toggle("active", tab === 'recibidas');
  if (tabEnviadas) tabEnviadas.classList.toggle("active", tab === 'enviadas');

  const vistaRecibidas = document.getElementById("vistaRecibidas");
  const vistaEnviadas = document.getElementById("vistaEnviadas");

  if (vistaRecibidas) vistaRecibidas.classList.toggle("hidden", tab !== 'recibidas');
  if (vistaEnviadas) vistaEnviadas.classList.toggle("hidden", tab !== 'enviadas');

  const legend = document.getElementById("filterLegend");
  if (legend) {
    legend.innerText = tab === 'enviadas' 
      ? "Ofertas realizadas en tus compras" 
      : "Agrupadas por aviso · mejor oferta destacada";
  }

  renderizarTodo();
}

function coincideEstado(estadoOferta, filtro) {
  if (filtro === 'Todas') return true;
  const est = estadoOferta.toLowerCase().trim();
  const filt = filtro.toLowerCase().trim();
  return est === filt || est === filt.replace(/s$/, '') || est.replace(/s$/, '') === filt;
}
function obtenerConteos() {
  if (tabActual === 'recibidas') {
    let todasRecibidas = [];
    datosSistema.publicacionesRecibidas.forEach(p => todasRecibidas.push(...p.ofertas));
    
    return {
      'Todas': todasRecibidas.length,
      'Recibidas': todasRecibidas.filter(o => coincideEstado(o.estado, 'Recibidas')).length,
      'Contraofertadas': todasRecibidas.filter(o => coincideEstado(o.estado, 'Contraofertadas')).length,
      'Aceptadas': todasRecibidas.filter(o => coincideEstado(o.estado, 'Aceptadas')).length,
      'Rechazadas': todasRecibidas.filter(o => coincideEstado(o.estado, 'Rechazadas')).length
    };
  } else {
    const env = datosSistema.ofertasEnviadas;
    return {
      'Todas': env.length,
      'Enviadas': env.filter(o => coincideEstado(o.estado, 'Enviadas')).length,
      'Contraofertadas': env.filter(o => coincideEstado(o.estado, 'Contraofertadas')).length,
      'Aceptadas': env.filter(o => coincideEstado(o.estado, 'Aceptadas')).length,
      'Rechazadas': env.filter(o => coincideEstado(o.estado, 'Rechazadas')).length
    };
  }
}

function renderizarTodo() {
  actualizarContadoresTabs();
  renderizarPills();
  if (tabActual === 'recibidas') {
    renderizarOfertasRecibidas();
  } else {
    renderizarOfertasEnviadas();
  }
}

function actualizarContadoresTabs() {
  let recCount = 0;
  datosSistema.publicacionesRecibidas.forEach(p => recCount += p.ofertas.length);
  const elRec = document.getElementById("cantRecibidas");
  if (elRec) elRec.innerText = recCount;

  const elEnv = document.getElementById("cantEnviadas");
  if (elEnv) elEnv.innerText = datosSistema.ofertasEnviadas.length;
}

function renderizarPills() {
  const container = document.getElementById("pillsContainer");
  if (!container) return;
  container.innerHTML = "";

  const conteos = obtenerConteos();

  Object.keys(conteos).forEach(key => {
    const btn = document.createElement("button");
    btn.className = `pill ${filtroSeleccionado === key ? 'active' : ''}`;
    btn.innerText = `${key} - ${conteos[key]}`;
    btn.onclick = () => {
      filtroSeleccionado = key;
      renderizarTodo();
    };
    container.appendChild(btn);
  });
}

function seleccionarOferta(id) {
  ofertaSeleccionadaId = (ofertaSeleccionadaId === id) ? null : id;
  renderizarTodo();
}

function obtenerHTMLColeccionVacia(esRecibidas) {
  const titulo = esRecibidas ? "Todavía no recibes ofertas" : "No has enviado ofertas";
  const desc = esRecibidas 
    ? "Cuando publiques un aviso, aquí verás las propuestas de los compradores." 
    : "Cuando encuentres algo que te sirva, envía tu monto y el vendedor podrá aceptarlo, rechazarlo o proponerte otro precio.";
  const btnText = esRecibidas ? "Ver mis publicaciones" : "Explorar catálogo";

  return `
    <div class="empty-state-card">
      <div class="empty-icon-box"></div>
      <h2>${titulo}</h2>
      <p>${desc}</p>
      <button class="btn-solid-terracota" onclick="alert('Navegando...')">${btnText}</button>
    </div>
  `;
}

function renderizarOfertasRecibidas() {
  const container = document.getElementById("vistaRecibidas");
  if (!container) return;
  container.innerHTML = "";

  let totalOfertas = 0;
  datosSistema.publicacionesRecibidas.forEach(p => totalOfertas += p.ofertas.length);

  if (totalOfertas === 0) {
    container.innerHTML = obtenerHTMLColeccionVacia(true);
    return;
  }

  let hayResultados = false;

  datosSistema.publicacionesRecibidas.forEach(pub => {
    const ofertasFiltradas = pub.ofertas.filter(o => coincideEstado(o.estado, filtroSeleccionado));
    if (ofertasFiltradas.length === 0) return;

    hayResultados = true;
    const grupoBox = document.createElement("div");
    grupoBox.className = "aviso-group-container";

    const headerAviso = document.createElement("div");
    headerAviso.className = "aviso-header-banner";
    headerAviso.innerText = `Aviso: ${pub.tituloAviso}`;
    grupoBox.appendChild(headerAviso);

    ofertasFiltradas.forEach(o => {
      const card = document.createElement("div");
      const esSeleccionada = ofertaSeleccionadaId === o.id;
      
      card.className = `sent-card ${esSeleccionada ? 'highlighted-border' : ''}`;
      card.onclick = (e) => {
        if (e.target.tagName !== 'BUTTON') {
          seleccionarOferta(o.id);
        }
      };

      let botonesHTML = '';
      let tagHTML = '';

      if (coincideEstado(o.estado, 'Recibida')) {
        tagHTML = `<span class="status-tag status-blue">Recibida</span>`;
        botonesHTML = `
          <button class="btn-solid-terracota" onclick="aceptarOfertaDirecto(event, ${o.id})">Aceptar</button>
          <button class="btn-outline-terracota" onclick="abrirModalContraoferta(event, ${o.id})">Contraofertar</button>
          <button class="btn-text-plain" onclick="rechazarOfertaDirecto(event, ${o.id})">Rechazar</button>
        `;
      } else if (coincideEstado(o.estado, 'Contraofertada')) {
        tagHTML = `<span class="status-plain-text">Contraofertada</span>`;
        botonesHTML = `<button class="btn-outline-terracota" onclick="abrirModalHiloRecibida(event, ${o.id})">Ver hilo</button>`;
      } else if (coincideEstado(o.estado, 'Aceptada')) {
        tagHTML = `<span class="status-plain-text">Aceptada</span>`;
        botonesHTML = `<button class="btn-green-agreement" onclick="irAlAcuerdo(event)">Ir al acuerdo</button>`;
      } else if (coincideEstado(o.estado, 'Rechazada')) {
        tagHTML = `<span class="status-tag status-red">Rechazada</span>`;
        botonesHTML = `<button class="btn-outline-terracota" onclick="abrirModalHiloRecibida(event, ${o.id})">Ver hilo</button>`;
      }

      card.innerHTML = `
        <div class="sent-card-left">
          <div class="pink-square"></div>
          <div class="item-info">
            <h3>${o.comprador} <span class="rating-text">· ${o.calificacion}</span></h3>
            <p>Ofertada el ${o.fecha} ${o.esMejorOferta ? '· <strong class="best-offer-text">Mejor oferta</strong>' : ''}</p>
          </div>
        </div>
        <div class="sent-card-right">
          <div class="price-display">
            <span class="main-val">S/ ${o.montoOfertado.toFixed(2)}</span>
            <span class="sub-val">precio pedido S/ ${pub.precioPublicado.toFixed(2)}</span>
          </div>
          ${tagHTML}
          ${esSeleccionada ? `<div class="action-buttons-group">${botonesHTML}</div>` : ''}
        </div>
      `;

      grupoBox.appendChild(card);
    });

    container.appendChild(grupoBox);
  });

  if (!hayResultados) {
    container.innerHTML = `<div style="padding: 24px; text-align: center; color: #718096;">No hay ofertas en la categoría "${filtroSeleccionado}".</div>`;
  }
}

function renderizarOfertasEnviadas() {
  const container = document.getElementById("listaEnviadasCards");
  if (!container) return;
  container.innerHTML = "";

  if (datosSistema.ofertasEnviadas.length === 0) {
    container.innerHTML = obtenerHTMLColeccionVacia(false);
    return;
  }

  const filtradas = datosSistema.ofertasEnviadas.filter(item => coincideEstado(item.estado, filtroSeleccionado));

  if (filtradas.length === 0) {
    container.innerHTML = `<div style="padding: 24px; text-align: center; color: #718096;">No hay ofertas en la categoría "${filtroSeleccionado}".</div>`;
    return;
  }

  filtradas.forEach(o => {
    const card = document.createElement("div");
    const esSeleccionada = ofertaSeleccionadaId === o.id;
    card.className = `sent-card ${esSeleccionada ? 'highlighted-border' : ''}`;
    
    card.onclick = (e) => {
      if (e.target.tagName !== 'BUTTON') {
        seleccionarOferta(o.id);
      }
    };

    let precioHTML = o.contraofertaMonto ? `
      <div class="price-display">
        <span class="main-val">S/ ${o.montoOfertado.toFixed(2)}</span>
        <span class="sub-val-orange">contraoferta S/ ${o.contraofertaMonto.toFixed(2)}</span>
      </div>
    ` : `
      <div class="price-display">
        <span class="main-val">S/ ${o.montoOfertado.toFixed(2)}</span>
        <span class="sub-val">precio pedido S/ ${o.precioPedido.toFixed(2)}</span>
      </div>
    `;

    let botonesHTML = '';
    if (coincideEstado(o.estado, 'Enviada')) {
      botonesHTML = `
        <button class="btn-outline-terracota" onclick="abrirModalHiloEnviada(event, ${o.id})">Ver hilo</button>
        <button class="btn-text-plain" onclick="retirarOferta(event, ${o.id})">Retirar</button>
      `;
    } else if (coincideEstado(o.estado, 'Contraofertada')) {
      botonesHTML = `
        <button class="btn-solid-terracota" onclick="abrirModalHiloEnviada(event, ${o.id})">Responder</button>
        <button class="btn-text-plain" onclick="retirarOferta(event, ${o.id})">Eliminar</button>
      `;
    } else if (coincideEstado(o.estado, 'Aceptada')) {
      botonesHTML = `
        <button class="btn-green-agreement" onclick="irAlAcuerdo(event)">Ir al acuerdo</button>
        <button class="btn-text-plain" onclick="retirarOferta(event, ${o.id})">Eliminar</button>
      `;
    } else {
      botonesHTML = `
        <button class="btn-outline-terracota" onclick="abrirModalHiloEnviada(event, ${o.id})">Ver hilo</button>
        <button class="btn-text-plain" onclick="retirarOferta(event, ${o.id})">Eliminar</button>
      `;
    }

    const claseTag = `status-${o.estado.toLowerCase().replace(' ', '')}`;

    card.innerHTML = `
      <div class="sent-card-left">
        <div class="pink-square"></div>
        <div class="item-info">
          <h3>${o.titulo}</h3>
          <p>Vendedor: ${o.vendedor} ${o.calificacion ? '· ' + o.calificacion : ''} · ${o.estado.toLowerCase()} el ${o.fecha}</p>
        </div>
      </div>
      <div class="sent-card-right">
        ${precioHTML}
        <span class="status-tag ${claseTag}">${o.estado}</span>
        ${esSeleccionada ? `<div class="action-buttons-group">${botonesHTML}</div>` : ''}
      </div>
    `;

    container.appendChild(card);
  });
}

function aceptarOfertaDirecto(event, id) {
  if (event) event.stopPropagation();
  actualizarEstadoEnotif(id, 'Aceptada', "Has aceptado la oferta");
}

function rechazarOfertaDirecto(event, id) {
  if (event) event.stopPropagation();
  actualizarEstadoEnotif(id, 'Rechazada', "Acabas de rechazar la oferta");
}

function actualizarEstadoEnotif(id, nuevoEstado, mensajeAnuncio) {
  datosSistema.publicacionesRecibidas.forEach(pub => {
    pub.ofertas.forEach(o => {
      if (o.id === id) {
        o.estado = nuevoEstado;
        o.esMejorOferta = false;
      }
    });
  });

  datosSistema.ofertasEnviadas.forEach(o => {
    if (o.id === id) {
      o.estado = nuevoEstado;
    }
  });

  cerrarModalHilo();
  alert(mensajeAnuncio); 
  renderizarTodo();
}

function retirarOferta(event, id) {
  if (event) event.stopPropagation();
  if (confirm("¿Deseas retirar/eliminar esta oferta?")) {
    datosSistema.ofertasEnviadas = datosSistema.ofertasEnviadas.filter(o => o.id !== id);
    
    const alertRet = document.getElementById("alertRetiro");
    if (alertRet) {
      alertRet.classList.remove("hidden");
      setTimeout(() => alertRet.classList.add("hidden"), 3000);
    }
    
    renderizarTodo();
  }
}

function abrirModalHiloRecibida(event, id) {
  if (event) event.stopPropagation();
  
  let pubFound = null;
  let ofertaFound = null;

  datosSistema.publicacionesRecibidas.forEach(p => {
    const f = p.ofertas.find(o => o.id === id);
    if (f) {
      pubFound = p;
      ofertaFound = f;
    }
  });

  if (!ofertaFound) return;
  ofertaEnModal = { 
    ...ofertaFound, 
    tituloAviso: pubFound.tituloAviso, 
    precioPedido: pubFound.precioPublicado, 
    montoMinimo: pubFound.montoMinimo 
  };

  renderizarModalHilo(ofertaEnModal);
}

function abrirModalHiloEnviada(event, id) {
  if (event) event.stopPropagation();
  
  const ofertaFound = datosSistema.ofertasEnviadas.find(o => o.id === id);
  if (!ofertaFound) return;

  ofertaEnModal = {
    ...ofertaFound,
    tituloAviso: ofertaFound.titulo,
    precioPedido: ofertaFound.precioPedido || 85.00,
    montoMinimo: ofertaFound.montoMinimo || 60.00
  };

  renderizarModalHilo(ofertaEnModal);
}

function renderizarModalHilo(oferta) {
  const modal = document.getElementById("modalHilo");
  const subTitle = document.getElementById("hiloAvisoSub");
  const mainTitle = document.getElementById("modalTitulo");
  const chatBox = document.getElementById("chatHistory");
  const footerAcciones = document.getElementById("hiloFooterAcciones");

  if (subTitle) subTitle.innerText = `Aviso: ${oferta.tituloAviso}`;
  if (mainTitle) mainTitle.innerText = `Negociación con ${oferta.comprador || oferta.vendedor}`;

  if (chatBox) {
    chatBox.innerHTML = "";
    oferta.historial.forEach(h => {
      const esMio = h.emisor === datosSistema.usuarioActual;
      chatBox.innerHTML += `
        <div class="hilo-msg-card ${esMio ? 'es-mio' : ''}">
          <div class="hilo-msg-header">
            <span class="hilo-msg-user">${h.emisor}</span>
            <span class="hilo-msg-tag">${esMio ? 'Tu propuesta' : 'Contraparte'}</span>
          </div>
          <div class="hilo-msg-monto">S/ ${h.monto.toFixed(2)}</div>
          <p class="hilo-msg-texto">«${h.texto}»</p>
          <div class="hilo-msg-fecha">${h.fecha}</div>
        </div>
      `;
    });
  }

  if (footerAcciones) {
    if (coincideEstado(oferta.estado, 'Aceptada') || coincideEstado(oferta.estado, 'Rechazada')) {
      footerAcciones.innerHTML = `<button class="btn-outline-terracota" onclick="cerrarModalHilo()">Cerrar</button>`;
    } else {
      footerAcciones.innerHTML = `
        <button class="btn-green-agreement" onclick="aceptarOfertaDirecto(null, ${oferta.id})">Aceptar S/ ${oferta.montoOfertado.toFixed(2)}</button>
        <button class="btn-outline-terracota" onclick="abrirModalContraoferta(null, ${oferta.id})">Nueva contraoferta</button>
        <button class="btn-text-plain" onclick="rechazarOfertaDirecto(null, ${oferta.id})">Rechazar</button>
      `;
    }
  }

  if (modal) modal.classList.remove("hidden");
}

function cerrarModalHilo() {
  const modal = document.getElementById("modalHilo");
  if (modal) modal.classList.add("hidden");
}

function abrirModalContraoferta(event, id) {
  if (event) event.stopPropagation();

  cerrarModalHilo(); 

  let oferta = ofertaEnModal;
  if (!oferta || oferta.id !== id) {
    datosSistema.publicacionesRecibidas.forEach(p => {
      const f = p.ofertas.find(o => o.id === id);
      if (f) oferta = { ...f, tituloAviso: p.tituloAviso, precioPedido: p.precioPublicado, montoMinimo: p.montoMinimo };
    });
  }

  ofertaEnModal = oferta;

  const modalContra = document.getElementById("modalContraoferta");
  if (!modalContra) return;

  document.getElementById("contraTituloAviso").innerText = oferta.tituloAviso || oferta.titulo;
  document.getElementById("contraOfertaRecibida").innerText = `S/ ${oferta.montoOfertado.toFixed(2)}`;
  document.getElementById("contraPrecioPedido").innerText = `S/ ${oferta.precioPedido.toFixed(2)}`;

  const inputMonto = document.getElementById("inputMontoContra");
  if (inputMonto) {
    inputMonto.value = (oferta.montoOfertado + 4.00).toFixed(2);
  }

  document.getElementById("contraMensajeErr").classList.add("hidden");
  actualizarVisualContraoferta();

  modalContra.classList.remove("hidden");
}

function actualizarVisualContraoferta() {
  const val = parseFloat(document.getElementById("inputMontoContra").value) || 0;
  const targetTuOferta = document.getElementById("contraTuOferta");
  const txtDiff = document.getElementById("contraDiferenciaText");

  if (targetTuOferta) targetTuOferta.innerText = `S/ ${val.toFixed(2)}`;

  if (txtDiff && ofertaEnModal) {
    const diffRecibida = val - ofertaEnModal.montoOfertado;
    const diffPedido = ofertaEnModal.precioPedido - val;
    txtDiff.innerText = `S/ ${Math.abs(diffRecibida).toFixed(2)} ${diffRecibida >= 0 ? 'sobre' : 'bajo'} la oferta recibida y S/ ${Math.abs(diffPedido).toFixed(2)} ${diffPedido >= 0 ? 'bajo' : 'sobre'} tu precio pedido.`;
  }
}

function enviarContraofertaForm() {
  const montoInput = parseFloat(document.getElementById("inputMontoContra").value);
  const msgInput = document.getElementById("inputMensajeContra").value;
  const msgErr = document.getElementById("contraMensajeErr");

  const minAceptado = ofertaEnModal.montoMinimo || 50.00;

  if (isNaN(montoInput) || montoInput < minAceptado) {
    msgErr.innerText = `Corrige el monto. Sube tu oferta a S/ ${minAceptado.toFixed(2)} o más para poder enviarla.`;
    msgErr.classList.remove("hidden");
    return;
  }

  msgErr.classList.add("hidden");

  ofertaEnModal.historial.push({
    emisor: datosSistema.usuarioActual,
    monto: montoInput,
    texto: msgInput || "Propuesta de contraoferta enviada.",
    fecha: "Hoy"
  });

  actualizarEstadoEnotif(ofertaEnModal.id, 'Contraofertada', `Éxito. Tu contraoferta de S/ ${montoInput.toFixed(2)} se envió.`);
  cerrarModalContraoferta();
}

function cerrarModalContraoferta() {
  const modalContra = document.getElementById("modalContraoferta");
  if (modalContra) modalContra.classList.add("hidden");
}

function irAlAcuerdo(event) {
  if (event) event.stopPropagation();
  alert("Navegando a la pantalla de Acuerdo...");
}