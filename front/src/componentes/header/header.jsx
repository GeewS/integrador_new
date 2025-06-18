import { FiLogOut } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import logo from '../../assets/img/logo_integrador.png'

function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img src={logo} alt="Logo" />
      </div>
      <nav className={styles.nav}>
        <Link to="/home">Home</Link>
        <Link to="/ambientes">Ambientes</Link>
        <Link to="/sensores">Sensores</Link>
        <Link to="/historico">Histórico</Link>
        <Link to="/mapeamento">Mapeamento</Link>
      </nav>
      <div className={styles.logout}>
        <button onClick={handleLogout}>
          <FiLogOut size={24} title="Sair" />
        </button>
      </div>
    </header>
  );
}

export default Header;
