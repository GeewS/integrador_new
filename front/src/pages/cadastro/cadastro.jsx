import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import style from './cadastro.module.css';
import Logo from '../../assets/img/logo_integrador.png';

function Cadastro() {
  const navigate = useNavigate();

  // Estado para armazenar os dados do formulário
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });

  // Estados auxiliares para carregamento, mensagem de feedback e visualização de senha
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Atualiza os dados do formulário conforme o usuário digita
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Envia os dados para o backend e trata a resposta
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verifica se as senhas coincidem
    if (formData.password !== formData.confirmPassword) {
      setMessage('As senhas não conferem');
      return;
    }

    setLoading(true);     
    setMessage('');       

    try {
      // Requisição POST para criar um novo usuário
      const response = await fetch('http://localhost:8000/api/signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      if (response.ok) {
        setMessage('Cadastro realizado com sucesso!');
        setTimeout(() => navigate('/login'), 2000); 
      } else {
        const errorData = await response.json();
        setMessage(errorData.username ? errorData.username[0] : 'Erro no cadastro');
      }
    } catch (error) {
      setMessage('Erro ao conectar com o servidor');
    }

    setLoading(false);  
  };

  return (
    <main className={style.container}>
      <section className={style.box}>
        {/* Lado esquerdo com a logo */}
        <aside className={style.left} aria-label="Logo da aplicação">
          <img src={Logo} alt="Logo Smart Senai" className={style.logo} />
        </aside>

        {/* Lado direito com o formulário */}
        <section className={style.right}>
          <header>
            <h1 className={style.title}>Faça seu cadastro!</h1>
            <p className={style.subtitle}>Cadastre-se para utilizar o nosso sistema</p>
          </header>

          <form onSubmit={handleSubmit} className={style.form}>
            {/* Campo: Nome de usuário */}
            <div className={style.inputGroup}>
              <label htmlFor="username">Usuário</label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Usuário"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            {/* Campo: Senha */}
            <div className={style.inputGroup}>
              <label htmlFor="password">Senha</label>
              <div className={style.passwordWrapper}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="Senha"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  onClick={() => setShowPassword(!showPassword)}
                  className={style.eyeButton}
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
            </div>

            {/* Campo: Confirmar senha */}
            <div className={style.inputGroup}>
              <label htmlFor="confirmPassword">Confirmar Senha</label>
              <div className={style.passwordWrapper}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirmar Senha"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  aria-label={showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={style.eyeButton}
                >
                  {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
            </div>

            {/* Mensagem de feedback (erro ou sucesso) */}
            {message && <p className={style.message}>{message}</p>}

            {/* Botão de cadastro */}
            <button
              type="submit"
              className={style.submitButton}
              disabled={loading}
            >
              {loading ? 'Cadastrando...' : 'Cadastro'}
            </button>

            {/* Botão para redirecionar ao login */}
            <button
              type="button"
              className={style.loginButton}
              onClick={() => navigate('/login')}
            >
              Login
            </button>
          </form>
        </section>
      </section>
    </main>
  );
}

export default Cadastro;
