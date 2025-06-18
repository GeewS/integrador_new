import React, { useState, useEffect } from 'react';
import styles from './modalSensores.module.css';
import axios from 'axios';

const SensorModal = ({ sensor = {}, fechar }) => {
  const isEdicao = Boolean(sensor?.id); // Verifica se está no modo de edição

  // Estado dos dados do formulário
  const [form, setForm] = useState({
    sensor: '',
    mac_address: '',
    unidade_med: '',
    latitude: '',
    longitude: '',
    status: '',
  });

  // Estado para mensagens de erro por campo
  const [errors, setErrors] = useState({});

  // Mapeamento de tipo do sensor para unidade de medida
  const unidadePorTipo = {
    temperatura: '°C',
    luminosidade: 'lux',
    umidade: '%',
    contador: 'num',
  };

  // Preenche os campos se for edição
  useEffect(() => {
    if (sensor) {
      setForm({
        sensor: sensor.sensor || '',
        mac_address: sensor.mac_address || '',
        unidade_med: unidadePorTipo[sensor.sensor] || '',
        latitude: sensor.latitude || '',
        longitude: sensor.longitude || '',
        status: sensor.status || '',
      });
    }
  }, [sensor]);

  // Retorna o header com token para autenticação
  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });

  // Atualiza campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'sensor') {
      setForm(prev => ({
        ...prev,
        sensor: value,
        unidade_med: unidadePorTipo[value] || '',
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }

    // Limpa erro ao alterar valor
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // Valida os dados do formulário
  const validate = () => {
    const newErrors = {};

    if (!form.sensor) {
      newErrors.sensor = 'Selecione um tipo de sensor.';
    }

    if (
      !form.mac_address ||
      /^[a-zA-Z]+$/.test(form.mac_address) ||
      /^\d+$/.test(form.mac_address)
    ) {
      newErrors.mac_address = 'MAC Address deve conter letras e números.';
    }

    if (!parseFloat(form.latitude) || parseFloat(form.latitude) === 0) {
      newErrors.latitude = 'Latitude deve ser um número diferente de zero.';
    }

    if (!parseFloat(form.longitude) || parseFloat(form.longitude) === 0) {
      newErrors.longitude = 'Longitude deve ser um número diferente de zero.';
    }

    if (!form.status) {
      newErrors.status = 'Selecione o status.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submete os dados para API
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return; // Impede envio se houver erros

    try {
      if (isEdicao) {
        await axios.put(
          `http://localhost:8000/api/sensor/${sensor.id}`,
          form,
          getAuthHeaders()
        );
      } else {
        await axios.post(
          'http://localhost:8000/api/sensores',
          form,
          getAuthHeaders()
        );
      }

      fechar(); // Fecha modal após envio
    } catch (error) {
      console.error('Erro ao salvar sensor:', error);
      alert('Erro ao salvar. Verifique os dados e tente novamente.');
    }
  };

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className={styles.modal}>
        {/* Botão para fechar o modal */}
        <button
          type="button"
          className={styles.closeButton}
          onClick={fechar}
          aria-label="Fechar modal"
        >
          ×
        </button>

        {/* Título dinâmico do modal */}
        <h2 id="modal-title">{isEdicao ? 'Editar Sensor' : 'Registrar Sensor'}</h2>

        {/* Formulário com validação */}
        <form onSubmit={handleSubmit} noValidate>
          <label>
            Tipo do Sensor
            <select
              name="sensor"
              value={form.sensor}
              onChange={handleChange}
              className={styles.select}
              required
            >
              <option value="">Selecione</option>
              <option value="temperatura">Temperatura</option>
              <option value="luminosidade">Luminosidade</option>
              <option value="umidade">Umidade</option>
              <option value="contador">Contador</option>
            </select>
            {errors.sensor && <p className={styles.error}>{errors.sensor}</p>}
          </label>

          <label>
            MAC Address
            <input
              type="text"
              name="mac_address"
              placeholder="MAC Address"
              value={form.mac_address}
              onChange={handleChange}
              required
            />
            {errors.mac_address && <p className={styles.error}>{errors.mac_address}</p>}
          </label>

          <label>
            Unidade de Medida
            <input
              type="text"
              name="unidade_med"
              placeholder="Unidade de Medida"
              value={form.unidade_med}
              readOnly
            />
          </label>

          <label>
            Latitude
            <input
              type="number"
              step="any"
              name="latitude"
              placeholder="Latitude"
              value={form.latitude}
              onChange={handleChange}
              required
            />
            {errors.latitude && <p className={styles.error}>{errors.latitude}</p>}
          </label>

          <label>
            Longitude
            <input
              type="number"
              step="any"
              name="longitude"
              placeholder="Longitude"
              value={form.longitude}
              onChange={handleChange}
              required
            />
            {errors.longitude && <p className={styles.error}>{errors.longitude}</p>}
          </label>

          <label>
            Status
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className={styles.select}
              required
            >
              <option value="">Selecione</option>
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </select>
            {errors.status && <p className={styles.error}>{errors.status}</p>}
          </label>

          {/* Botão de envio */}
          <button type="submit" className={styles.submitButton}>
            {isEdicao ? 'Atualizar' : 'Salvar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SensorModal;
