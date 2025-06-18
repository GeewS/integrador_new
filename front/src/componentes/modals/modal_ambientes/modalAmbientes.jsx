import React, { useState, useEffect } from 'react';
import styles from './modalAmbientes.module.css';
import axios from 'axios';

const AmbienteModal = ({ ambiente = {}, fechar }) => {
  const isEditing = Boolean(ambiente?.id);

  // Estado do formulário
  const [formData, setFormData] = useState({
    sig: '',
    descricao: '',
    ni: '',
    responsavel: ''
  });

  // Estado dos erros de validação
  const [errors, setErrors] = useState({});

  // Preenche os campos em modo de edição
  useEffect(() => {
    if (ambiente) {
      setFormData({
        sig: ambiente.sig || '',
        descricao: ambiente.descricao || '',
        ni: ambiente.ni || '',
        responsavel: ambiente.responsavel || ''
      });
    }
  }, [ambiente]);

  // Gera o cabeçalho com token de autenticação
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  };

  // Atualiza os dados do formulário conforme digitação
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Limpa o erro ao digitar novamente
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // Validação dos campos
  const validate = () => {
    const newErrors = {};

    if (!/^\d+$/.test(formData.sig)) {
      newErrors.sig = 'O SIG deve conter apenas números.';
    }

    if (!formData.descricao || /^\d+$/.test(formData.descricao)) {
      newErrors.descricao = 'A descrição deve conter letras.';
    }

    if (!formData.ni || !/^[\w\s]+$/.test(formData.ni)) {
      newErrors.ni = 'O campo NI deve ser alfanumérico.';
    }

    if (!/^[A-Za-zÀ-ÿ\s]+$/.test(formData.responsavel)) {
      newErrors.responsavel = 'O nome do responsável deve conter apenas letras.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Envia o formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return; 

    try {
      if (isEditing) {
        await axios.put(
          `http://localhost:8000/api/ambiente/${ambiente.id}`,
          formData,
          getAuthHeaders()
        );
      } else {
        await axios.post(
          'http://localhost:8000/api/ambientes',
          formData,
          getAuthHeaders()
        );
      }

      fechar(); 
    } catch (error) {
      console.error('Erro ao salvar ambiente:', error);
      alert('Erro ao salvar. Verifique os dados e tente novamente.');
    }
  };

  return (
    <div className={styles.overlay}>
      <section className={styles.modal}>
        <button className={styles.closeButton} onClick={fechar}>×</button>
        <h2 className={styles.modalTitle}>
          {isEditing ? 'Editar Ambiente' : 'Registrar Ambiente'}
        </h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label htmlFor="sig">Sig</label>
          <input
            type="text"
            name="sig"
            placeholder="Sig"
            value={formData.sig}
            onChange={handleChange}
          />
          {errors.sig && <p className={styles.error}>{errors.sig}</p>}

          <label htmlFor="descrição">Descrição</label>
          <input
            type="text"
            name="descricao"
            placeholder="Descrição"
            value={formData.descricao}
            onChange={handleChange}
          />
          {errors.descricao && <p className={styles.error}>{errors.descricao}</p>}

          <label htmlFor="NI">NI</label>
          <input
            type="text"
            name="ni"
            placeholder="NI"
            value={formData.ni}
            onChange={handleChange}
          />
          {errors.ni && <p className={styles.error}>{errors.ni}</p>}

          <label htmlFor="responsavel">Responsável</label>
          <input
            type="text"
            name="responsavel"
            placeholder="Responsável"
            value={formData.responsavel}
            onChange={handleChange}
          />
          {errors.responsavel && <p className={styles.error}>{errors.responsavel}</p>}

          <button type="submit" className={styles.submitButton}>
            {isEditing ? 'Atualizar' : 'Salvar'}
          </button>
        </form>
      </section>
    </div>
  );
};

export default AmbienteModal;
