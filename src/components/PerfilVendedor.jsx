import AvisoCard from "./AvisoCard.jsx";

const RESENAS = [
  {
    estrellas: "★★★★★",
    fecha: "17/08/2026",
    texto: "Llegó puntual a la Biblioteca y el libro estaba tal como lo describió.",
    autor: "Andrés Castillo Paredes · Ing. Industrial",
  },
  {
    estrellas: "★★★★★",
    fecha: "09/08/2026",
    texto: "Aceptó mi contraoferta sin problema y coordinamos rápido por el hilo.",
    autor: "Lucía Ramírez Ccahuana · Derecho",
  },
  {
    estrellas: "★★★★☆",
    fecha: "02/08/2026",
    texto: "Todo bien, aunque tuvimos que reprogramar el encuentro una vez.",
    autor: "Sebastián Ochoa Núñez · Economía",
  },
];

export default function PerfilVendedor({ avisos }) {
  return (
    <section className="seller-profile-section view-section">
      <div className="breadcrumb">Catálogo &gt; Perfil de Rosa María Quispe Ríos</div>

      <div className="seller-card-header">
        <div className="seller-main-info">
          <div className="avatar-pink"></div>
          <div className="seller-details">
            <div className="seller-title-row">
              <h2>Rosa María Quispe Ríos</h2>
              <span className="chip-badge chip-success">Vendedora confiable</span>
            </div>
            <p className="seller-meta">
              Administración · cuarto ciclo · en el tablón desde marzo de 2026
            </p>
            <div className="rating-row">
              <strong className="rating-value">4.8</strong>
              <span className="stars">★★★★★</span>
              <span className="rating-count">(11 calificaciones recibidas)</span>
            </div>
          </div>
        </div>

        <div className="seller-metrics-group">
          <div className="metric-item">
            <span className="metric-num">12</span>
            <span className="metric-lbl">acuerdos cerrados</span>
          </div>
          <div className="metric-item">
            <span className="metric-num">5</span>
            <span className="metric-lbl">avisos activos</span>
          </div>
          <div className="metric-item">
            <span className="metric-num">1 d</span>
            <span className="metric-lbl">responde en</span>
          </div>
          <button className="btn-link btn-report">Reportar usuario</button>
        </div>
      </div>

      <div className="seller-section-block">
        <div className="section-title-bar">
          <h3>Avisos publicados</h3>
          <div className="pills-filter">
            <button className="pill-btn active">Todos · 6</button>
            <button className="pill-btn">Activos · 5</button>
            <button className="pill-btn">Vendidos · 1</button>
          </div>
        </div>

        <div className="cards-grid">
          {avisos.map((aviso) => (
            <AvisoCard key={aviso.id} aviso={aviso} mostrarCurso={false} />
          ))}
        </div>
      </div>

      <div className="seller-section-block">
        <h3>Últimas calificaciones recibidas</h3>
        <div className="reviews-grid">
          {RESENAS.map((r) => (
            <div key={r.fecha} className="review-card">
              <div className="review-header">
                <span className="stars-gold">{r.estrellas}</span>
                <span className="review-date">{r.fecha}</span>
              </div>
              <p className="review-text">{r.texto}</p>
              <div className="review-author">{r.autor}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
