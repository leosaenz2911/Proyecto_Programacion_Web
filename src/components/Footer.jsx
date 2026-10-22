export default function Footer() {
  return (
    <footer className="footer-bar">
      <div className="footer-left">
        Universidad de Lima · Campus Monterrico · Av. Javier Prado Este 4600
      </div>
      <div className="footer-right">
        <a href="#" onClick={(e) => e.preventDefault()}>Normas del tablón</a>
        <a href="#" onClick={(e) => e.preventDefault()}>Mesa de ayuda</a>
        <a href="mailto:tablon@ulima.edu.pe" className="footer-email">
          tablon@ulima.edu.pe
        </a>
      </div>
    </footer>
  );
}
