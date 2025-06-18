import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../componentes/header/header';
import Footer from '../../componentes/footer/footer';

import { FiMapPin, FiThermometer, FiFileText, FiMap } from 'react-icons/fi';

import styles from './home.module.css';
import cidade from '../../assets/img/smart_city.png';

function Home() {
  const navigate = useNavigate();

  // Pegar o token para validar o acesso
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className={styles.container}>
      <Header />

      <main className={styles.main}>
        {/* Seção de boas-vindas */}
        <section className={styles.welcomeSection}>
          <div className={styles.welcomeText}>
            <p>Bem-vindo ao sistema <br /> Smart Senai!</p>
          </div>
          <div>
            <img src={cidade} alt="Ilustração cidade inteligente" />
          </div>
        </section>

        {/* Seção de opções de navegação */}
        <section className={styles.optionsSection}>
          <h2 className={styles.optionsTitle}>Opções</h2>
          <div className={styles.cardGrid}>
            <div className={styles.card}>
              <FiMapPin className={styles.icon} />
              <button onClick={() => navigate('/ambientes')}>Ambientes</button>
            </div>
            <div className={styles.card}>
              <FiThermometer className={styles.icon} />
              <button onClick={() => navigate('/sensores')}>Sensores</button>
            </div>
            <div className={styles.card}>
              <FiFileText className={styles.icon} />
              <button onClick={() => navigate('/historico')}>Histórico</button>
            </div>
            <div className={styles.card}>
              <FiMap className={styles.icon} />
              <button onClick={() => navigate('/mapeamento')}>Mapeamento</button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Home;
