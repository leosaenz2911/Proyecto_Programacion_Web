let acuerdosData = [
    {
        id: "AC-101",
        producto: "Química General — Chang, 11.ª ed.",
        contraparte: "Marco Antonio Loayza",
        rol: "Comprador",
        monto: 72.00,
        estado: "Pendiente",
        lugar: "Biblioteca",
        fecha: "2026-10-15T10:00",
        codigo: null
    },
    {
        id: "AC-102",
        producto: "Calculadora Científica fx-991",
        contraparte: "Lucía Fernández",
        rol: "Vendedor",
        monto: 110.00,
        estado: "Acordado",
        lugar: "Cafetería del pabellón E",
        fecha: "2026-10-14T13:00",
        codigo: "U-7894"
    }
];

let filtroActual = "Todos";
let acuerdoSeleccionado = null;

document.addEventListener("DOMContentLoaded", () => {
    renderizarAcuerdos();
});

function filtrarAcuerdos(estado) {
    filtroActual = estado;
    const pills = document.querySelectorAll('#pillsAcuerdos .pill');
    pills.forEach(pill => {
        pill.classList.remove('active');
        if (pill.innerText.includes(estado)) pill.classList.add('active');
    });
    renderizarAcuerdos();
}

function renderizarAcuerdos() {
    const contenedor = document.getElementById("listaAcuerdos");
    contenedor.innerHTML = "";

    const filtrados = acuerdosData.filter(ac => filtroActual === "Todos" || ac.estado === filtroActual);

    if (filtrados.length === 0) {
        contenedor.innerHTML = `<div class="empty-state-card"><h2>No hay acuerdos</h2><p>No tienes acuerdos en estado ${filtroActual}.</p></div>`;
        return;
    }

    filtrados.forEach(ac => {
        let claseEstado = "status-yellow";
        if(ac.estado === "Acordado") claseEstado = "status-blue";
        if(ac.estado === "Entregado") claseEstado = "status-green";
        if(ac.estado === "Cancelado") claseEstado = "status-red";

        let botonesHTML = '';
        if (ac.estado === "Pendiente") {
            botonesHTML = `
                <button class="btn-solid-terracota" onclick="abrirModal('${ac.id}', 'coordinar')">Coordinar</button>
                <button class="btn-text-plain" onclick="abrirModal('${ac.id}', 'cancelar')">Cancelar</button>
            `;
        } else if (ac.estado === "Acordado") {
            botonesHTML = `
                <button class="btn-green-agreement" onclick="abrirModal('${ac.id}', 'confirmar')">Entregar</button>
                <button class="btn-text-plain" onclick="abrirModal('${ac.id}', 'cancelar')">Cancelar</button>
            `;
        }

        const tarjeta = `
            <div class="sent-card">
                <div class="sent-card-left">
                    <div class="pink-square"></div>
                    <div class="item-info">
                        <h3>${ac.producto}</h3>
                        <p>Acuerdo con: ${ac.contraparte}</p>
                        <p>📍 ${ac.lugar || 'Por definir'} · 🕒 ${ac.fecha ? ac.fecha.replace('T', ' ') : 'Por definir'}</p>
                    </div>
                </div>
                <div class="sent-card-right">
                    <div class="price-display">
                        <span class="main-val">S/ ${ac.monto.toFixed(2)}</span>
                    </div>
                    <span class="status-tag ${claseEstado}">${ac.estado}</span>
                    <div class="action-buttons-group">
                        ${botonesHTML}
                    </div>
                </div>
            </div>
        `;
        contenedor.innerHTML += tarjeta;
    });
}

function abrirModal(id, tipoAccion) {
    acuerdoSeleccionado = acuerdosData.find(a => a.id === id);
    const modal = document.getElementById("modalAcuerdo");
    const titulo = document.getElementById("modalTitulo");
    const contenido = document.getElementById("modalContenidoDinamico");
    const botones = document.getElementById("modalBotones");

    document.getElementById("modalProducto").innerText = acuerdoSeleccionado.producto;
    document.getElementById("modalInfo").innerText = `Con ${acuerdoSeleccionado.contraparte} · S/ ${acuerdoSeleccionado.monto.toFixed(2)}`;

    if (tipoAccion === 'coordinar') {
        titulo.innerText = "Proponer Lugar y Hora";
        contenido.innerHTML = `
            <div class="form-group">
                <label>PUNTO DE ENCUENTRO</label>
                <select id="inputLugar">
                    <option>Biblioteca (Primer piso)</option>
                    <option>Cafetería del pabellón E</option>
                    <option>Puerta 1</option>
                </select>
            </div>
            <div class="form-group">
                <label>FECHA Y HORA</label>
                <input type="datetime-local" id="inputFecha" value="${acuerdoSeleccionado.fecha || ''}">
            </div>
        `;
        botones.innerHTML = `
            <button class="btn-text-plain" onclick="cerrarModal()">Atrás</button>
            <button class="btn-solid-terracota" onclick="guardarCoordinacion()">Enviar Propuesta</button>
        `;
    } 
    else if (tipoAccion === 'confirmar') {
        titulo.innerText = "Confirmar Entrega";
        if (acuerdoSeleccionado.rol === "Vendedor") {
            contenido.innerHTML = `
                <div style="text-align: center; margin: 20px 0;">
                    <label style="font-size: 0.8rem; font-weight: bold; color: #718096;">TU CÓDIGO DE ENTREGA</label>
                    <h2 style="color: #C05621; letter-spacing: 4px; font-size: 2rem; margin-top: 10px;">${acuerdoSeleccionado.codigo}</h2>
                    <p style="font-size: 0.8rem; color: #718096; margin-top: 8px;">Muéstrale este código al comprador al entregar el material.</p>
                </div>
            `;
            botones.innerHTML = `<button class="btn-text-plain" onclick="cerrarModal()">Cerrar</button>`;
        } else {
            contenido.innerHTML = `
                <div class="form-group">
                    <label>INGRESAR CÓDIGO DEL VENDEDOR</label>
                    <input type="text" id="inputCodigo" placeholder="Ej. U-7894">
                </div>
            `;
            botones.innerHTML = `
                <button class="btn-text-plain" onclick="cerrarModal()">Cancelar</button>
                <button class="btn-green-agreement" onclick="validarCodigo()">Validar y Cerrar Acuerdo</button>
            `;
        }
    }
    else if (tipoAccion === 'cancelar') {
        titulo.innerText = "Cancelar Acuerdo";
        contenido.innerHTML = `
            <div class="form-group">
                <label>MOTIVO DE CANCELACIÓN</label>
                <textarea id="inputMotivo" rows="3" placeholder="Ej. Ya no necesito el libro..."></textarea>
                <p style="font-size: 0.75rem; color: #718096; margin-top: 4px;">El aviso volverá a estar público para otras ofertas.</p>
            </div>
        `;
        botones.innerHTML = `
            <button class="btn-text-plain" onclick="cerrarModal()">Atrás</button>
            <button class="btn-solid-terracota" style="background: #E53E3E;" onclick="confirmarCancelacion()">Cancelar Acuerdo</button>
        `;
    }

    modal.classList.remove("hidden");
}

function cerrarModal() {
    document.getElementById("modalAcuerdo").classList.add("hidden");
    acuerdoSeleccionado = null;
}

function guardarCoordinacion() {
    acuerdoSeleccionado.lugar = document.getElementById("inputLugar").value;
    acuerdoSeleccionado.fecha = document.getElementById("inputFecha").value;
    acuerdoSeleccionado.estado = "Acordado";
    acuerdoSeleccionado.codigo = "UL-" + Math.floor(Math.random() * 9000 + 1000);
    alert("Propuesta enviada y aceptada. Se generó el código de entrega.");
    cerrarModal();
    renderizarAcuerdos();
}

function validarCodigo() {
    const cod = document.getElementById("inputCodigo").value;
    if(cod === "") { alert("Ingresa un código."); return; }
    acuerdoSeleccionado.estado = "Entregado";
    alert("Código validado. Entrega confirmada con éxito. ¡No olvides calificar a tu compañero!");
    cerrarModal();
    renderizarAcuerdos();
}

function confirmarCancelacion() {
    const motivo = document.getElementById("inputMotivo").value;
    if(motivo === "") { alert("Debes ingresar un motivo."); return; }
    acuerdoSeleccionado.estado = "Cancelado";
    alert("El acuerdo ha sido cancelado.");
    cerrarModal();
    renderizarAcuerdos();
}
