import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import style from './login.module.css';
import Logo from '../../assets/img/logo_integrador.png';

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Atualiza os campos conforme o usuário digita
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Envia os dados do formulário de login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:8000/api/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.access);
        localStorage.setItem('refresh', data.refresh);

        setMessage('Login realizado com sucesso!');
        setTimeout(() => {
          navigate('/home');
        }, 1500);
      } else {
        setMessage('Usuário ou senha inválidos');
      }
    } catch {
      setMessage('Erro ao conectar com o servidor');
    }

    setLoading(false);
  };

  return (
    <main className={style.container}>
      <section className={style.box}>
        {/* Área da logo */}
        <aside className={style.left}>
          <img src={Logo} alt="Logo Smart Senai" className={style.logo} />
        </aside>

        {/* Área do formulário */}
        <article className={style.right}>
          <header>
            <h1 className={style.title}>Bem-vindo de volta!</h1>
            <p className={style.subtitle}>
              Faça login para acessar o sistema Smart Senai
            </p>
          </header>

          <form onSubmit={handleSubmit} className={style.form}>
            <div className={style.inputGroup}>
              <label htmlFor="username">Usuário</label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Digite seu usuário"
                value={formData.username}
                onChange={handleChange}
                required
                autoComplete="username"
              />
            </div>

            <div className={style.inputGroup}>
              <label htmlFor="password">Senha</label>
              <div className={style.passwordWrapper}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="Digite sua senha"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  aria-describedby="passwordToggle"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={style.eyeButton}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  id="passwordToggle"
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
            </div>

            {message && <p className={style.message}>{message}</p>}

            <button
              type="submit"
              className={style.primaryButton}
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Login'}
            </button>

            <button
              type="button"
              className={style.secondaryButton}
              onClick={() => navigate('/cadastro')}
            >
              Cadastrar
            </button>
          </form>
        </article>
      </section>
    </main>
  );
}

export default Login;
