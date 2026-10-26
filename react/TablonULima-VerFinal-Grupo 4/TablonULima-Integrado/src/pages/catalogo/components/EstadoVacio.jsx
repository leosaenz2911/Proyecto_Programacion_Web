// Estado vacío compartido (Sistema de diseño): ícono, título, texto explicativo y botones de acción.
export default function EstadoVacio({ titulo, texto, children }) {
  return (
    <div className="empty-state-box">
      <div className="empty-icon-bg" aria-hidden="true" />
      <h2>{titulo}</h2>
      <p>{texto}</p>
      {children && <div className="empty-actions">{children}</div>}
    </div>
  );
}
