import { useNavigate } from 'react-router-dom';
import ulimaLogo from '../../assets/UlimaLogo.png';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="top-bar">
      <div className="top-bar-left">
        <div className="logo-container" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <img src={ulimaLogo} alt="Logo ULima" className="logo-img" />
          <span className="logo-text">Tablón ULima</span>
        </div>
        <div className="search-box">
          <input type="text" placeholder="Buscar libros, calculadoras, apuntes..." />
        </div>
      </div>
      <div className="top-bar-right">
        <button className="btn-publish">Publicar aviso</button>
        <span className="badge-role">USUARIO</span>
        <div className="user-profile">
          <span className="avatar-circle">DV</span>
          <span className="user-name">Diego Vargas ▾</span>
        </div>
      </div>
    </header>
  );
};

export default Header;