import React, { useState } from 'react';
import './estilosH4.css';

export default function MisAcuerdos() {
  const [filtroActivo, setFiltroActivo] = useState('Todos');
  const [modal, setModal] = useState({ abierto: false, tipo: '', id: null });
  
  const [acuerdos, setAcuerdos] = useState([
    {
      id: "AC-101", 
      producto: "Química General — Chang, 11.ª ed.",
      contraparte: "Marco Antonio Loayza", 
      rol: "Comprador", 
      monto: 72.00,
      estado: "Pendiente", 
      lugar: "Biblioteca (Primer piso)", 
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
  ]);

  const acuerdosFiltrados = acuerdos.filter(ac => filtroActivo === 'Todos' || ac.estado === filtroActivo);
  const acuerdoActual = acuerdos.find(a => a.id === modal.id);

  const cerrarModal = () => setModal({ abierto: false, tipo: '', id: null });

  const guardarCoordinacion = () => {
    setAcuerdos(acuerdos.map(ac => ac.id === modal.id ? { ...ac, estado: 'Acordado', codigo: 'UL-5521' } : ac));
    alert("Propuesta enviada. Código generado.");
    cerrarModal();
  };

  const validarCodigo = () => {
    setAcuerdos(acuerdos.map(ac => ac.id === modal.id ? { ...ac, estado: 'Entregado' } : ac));
    alert("Entrega confirmada con éxito.");
    cerrarModal();
  };

  const confirmarCancelacion = () => {
    setAcuerdos(acuerdos.map(ac => ac.id === modal.id ? { ...ac, estado: 'Cancelado' } : ac));
    alert("Acuerdo cancelado.");
    cerrarModal();
  };

  return (
    <main className="content-container">
      <h1 className="page-title">Mis Acuerdos de Entrega</h1>
      
      <div className="filter-bar">
        <div className="filter-pills">
          {['Todos', 'Pendiente', 'Acordado', 'Entregado', 'Cancelado'].map(filtro => (
            <button 
              key={filtro}
              className={`pill ${filtroActivo === filtro ? 'active' : ''}`}
              onClick={() => setFiltroActivo(filtro)}
            >
              {filtro === 'Todos' ? filtro : filtro + 's'}
            </button>
          ))}
        </div>
      </div>

      <div className="sent-offers-list">
        {acuerdosFiltrados.length === 0 ? (
          <div className="empty-state-card">
            <h2>No hay acuerdos</h2>
            <p>No tienes acuerdos en estado {filtroActivo}.</p>
          </div>
        ) : (
          acuerdosFiltrados.map(ac => {
            let claseEstado = ac.estado === "Acordado" ? "status-blue" : ac.estado === "Entregado" ? "status-green" : ac.estado === "Cancelado" ? "status-red" : "status-yellow";
            return (
              <div key={ac.id} className="sent-card">
                <div className="sent-card-left">
                  <div className="pink-square"></div>
                  <div className="item-info">
                    <h3>{ac.producto}</h3>
                    <p>Acuerdo con: {ac.contraparte}</p>
                    <p>📍 {ac.lugar} · 🕒 {ac.fecha.replace('T', ' ')}</p>
                  </div>
                </div>
                <div className="sent-card-right">
                  <div className="price-display">
                    <span className="main-val">S/ {ac.monto.toFixed(2)}</span>
                  </div>
                  <span className={`status-tag ${claseEstado}`}>{ac.estado}</span>
                  <div className="action-buttons-group">
                    {ac.estado === "Pendiente" && (
                      <>
                        <button className="btn-solid-terracota" onClick={() => setModal({ abierto: true, tipo: 'coordinar', id: ac.id })}>Coordinar</button>
                        <button className="btn-text-plain" onClick={() => setModal({ abierto: true, tipo: 'cancelar', id: ac.id })}>Cancelar</button>
                      </>
                    )}
                    {ac.estado === "Acordado" && (
                      <>
                        <button className="btn-green-agreement" onClick={() => setModal({ abierto: true, tipo: 'confirmar', id: ac.id })}>Entregar</button>
                        <button className="btn-text-plain" onClick={() => setModal({ abierto: true, tipo: 'cancelar', id: ac.id })}>Cancelar</button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {modal.abierto && acuerdoActual && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h3>{modal.tipo === 'coordinar' ? 'Proponer Lugar' : modal.tipo === 'confirmar' ? 'Confirmar Entrega' : 'Cancelar Acuerdo'}</h3>
              <button className="close-modal-btn" onClick={cerrarModal}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="product-preview-box">
                <div className="pink-square"></div>
                <div>
                  <h4>{acuerdoActual.producto}</h4>
                  <p>Con {acuerdoActual.contraparte}</p>
                </div>
              </div>

              {modal.tipo === 'coordinar' && (
                <>
                  <div className="form-group">
                    <label>PUNTO DE ENCUENTRO</label>
                    <select defaultValue={acuerdoActual.lugar}>
                      <option>Biblioteca (Primer piso)</option>
                      <option>Cafetería del pabellón E</option>
                      <option>Puerta 1</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>FECHA Y HORA</label>
                    <input type="datetime-local" defaultValue={acuerdoActual.fecha} />
                  </div>
                </>
              )}

              {modal.tipo === 'confirmar' && acuerdoActual.rol === 'Vendedor' && (
                <div style={{ textAlign: 'center', margin: '20px 0' }}>
                  <label>TU CÓDIGO DE ENTREGA</label>
                  <h2 style={{ color: '#C05621', letterSpacing: '4px' }}>{acuerdoActual.codigo}</h2>
                </div>
              )}

              {modal.tipo === 'confirmar' && acuerdoActual.rol === 'Comprador' && (
                <div className="form-group">
                  <label>INGRESAR CÓDIGO</label>
                  <input type="text" placeholder="Ej. U-7894" />
                </div>
              )}

              {modal.tipo === 'cancelar' && (
                <div className="form-group">
                  <label>MOTIVO DE CANCELACIÓN</label>
                  <textarea rows="3" placeholder="Ej. Ya no lo necesito..."></textarea>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-text-plain" onClick={cerrarModal}>Atrás</button>
              {modal.tipo === 'coordinar' && <button className="btn-solid-terracota" onClick={guardarCoordinacion}>Guardar</button>}
              {modal.tipo === 'confirmar' && acuerdoActual.rol === 'Comprador' && <button className="btn-green-agreement" onClick={validarCodigo}>Validar Código</button>}
              {modal.tipo === 'confirmar' && acuerdoActual.rol === 'Vendedor' && <button className="btn-text-plain" onClick={cerrarModal}>Cerrar</button>}
              {modal.tipo === 'cancelar' && <button className="btn-solid-terracota" style={{ background: '#E53E3E', color: 'white', border: 'none' }} onClick={confirmarCancelacion}>Confirmar</button>}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
