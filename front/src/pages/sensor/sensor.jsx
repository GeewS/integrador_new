import React, { useState, useEffect } from 'react';
import styles from './sensor.module.css';
import { FaTrash, FaEdit, FaSearch, FaDownload, FaPlus } from 'react-icons/fa';
import axios from 'axios';
import { saveAs } from 'file-saver';
import Header from '../../componentes/header/header';
import Footer from '../../componentes/footer/footer';
import SensorModal from '../../componentes/modals/modal_sensores/modalSensores';

const Sensores = () => {
  // Estados para sensores, filtros, paginação e modal
  const [sensores, setSensores] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [modalAberta, setModalAberta] = useState(false);
  const [sensorSelecionado, setSensorSelecionado] = useState(null);

  const itensPorPagina = 10;

  // Headers para autenticação nas requisições
  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  // Busca sensores da API, aplicando filtros e paginação localmente
  const buscarSensores = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/sensores', getAuthHeaders());
      let dados = res.data;

      if (filtroTipo) dados = dados.filter(s => s.sensor === filtroTipo);
      if (filtroStatus) dados = dados.filter(s => s.status === filtroStatus);

      setTotalPaginas(Math.ceil(dados.length / itensPorPagina));
      setSensores(dados.slice((pagina - 1) * itensPorPagina, pagina * itensPorPagina));
    } catch (err) {
      console.error('Erro ao buscar sensores:', err);
    }
  };

  // Atualiza a lista sempre que a página ou modal mudam
  useEffect(() => {
    buscarSensores();
  }, [pagina, modalAberta]);

  // Exclui sensor após confirmação do usuário
  const excluirSensor = async (id) => {
    if (!window.confirm('Deseja realmente excluir este sensor?')) return;
    try {
      await axios.delete(`http://localhost:8000/api/sensor/${id}`, getAuthHeaders());
      buscarSensores();
    } catch (err) {
      console.error('Erro ao excluir sensor:', err);
    }
  };

  // Baixa arquivo Excel com dados dos sensores
  const baixarExcel = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/exportar/sensores/', {
        ...getAuthHeaders(),
        responseType: 'blob'
      });
      saveAs(response.data, 'sensores.xlsx');
    } catch (error) {
      console.error('Erro ao baixar Excel:', error);
    }
  };

  // Reseta filtros e atualiza lista
  const limparFiltros = () => {
    setFiltroTipo('');
    setFiltroStatus('');
    setPagina(1);
    buscarSensores();
  };

  return (
    <>
      <Header />
      <main className={styles.container}>
        <h1>Sensores</h1>

        {/* Controles de filtro, pesquisa, cadastro e exportação */}
        <section className={styles.topControls} aria-label="Filtros e ações">
          <div className={styles.filterGroup}>
            <label htmlFor="filtroTipo">Tipo de Sensor:</label>
            <select
              id="filtroTipo"
              value={filtroTipo}
              onChange={e => setFiltroTipo(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="temperatura">Temperatura</option>
              <option value="luminosidade">Luminosidade</option>
              <option value="umidade">Umidade</option>
              <option value="contador">Contador</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="filtroStatus">Status:</label>
            <select
              id="filtroStatus"
              value={filtroStatus}
              onChange={e => setFiltroStatus(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </select>
          </div>

          <button onClick={() => { setPagina(1); buscarSensores(); }} aria-label="Pesquisar sensores">
            <FaSearch />
          </button>

          <button onClick={limparFiltros} aria-label="Limpar filtros">
            Apagar Filtros
          </button>

          <button onClick={() => { setSensorSelecionado(null); setModalAberta(true); }} aria-label="Registrar novo sensor">
            <FaPlus /> Registrar
          </button>

          <button onClick={baixarExcel} aria-label="Baixar lista de sensores em Excel">
            <FaDownload /> Download
          </button>
        </section>


        {/* Tabela com sensores */}
        <section aria-label="Lista de sensores">
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Ações</th>
                <th>ID</th>
                <th>Sensor</th>
                <th>Mac Address</th>
                <th>Unidade Medida</th>
                <th>Latitude</th>
                <th>Longitude</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {sensores.map(sensor => (
                <tr key={sensor.id}>
                  <td>
                    <button
                      onClick={() => { setSensorSelecionado(sensor); setModalAberta(true); }}
                      aria-label={`Editar sensor ${sensor.id}`}
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => excluirSensor(sensor.id)}
                      aria-label={`Excluir sensor ${sensor.id}`}
                    >
                      <FaTrash />
                    </button>
                  </td>
                  <td>{sensor.id}</td>
                  <td>{sensor.sensor}</td>
                  <td>{sensor.mac_address}</td>
                  <td>{sensor.unidade_med}</td>
                  <td>{sensor.latitude}</td>
                  <td>{sensor.longitude}</td>
                  <td>{sensor.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Paginação */}
        <nav className={styles.pagination} aria-label="Paginação dos sensores">
          <button onClick={() => setPagina(p => Math.max(p - 1, 1))} aria-label="Página anterior">
            Anterior
          </button>
          <span aria-live="polite" aria-atomic="true">
            Página {pagina} de {totalPaginas}
          </span>
          <button onClick={() => setPagina(p => Math.min(p + 1, totalPaginas))} aria-label="Próxima página">
            Próxima
          </button>
        </nav>

        {/* Modal de cadastro/edição */}
        {modalAberta && (
          <SensorModal
            sensor={sensorSelecionado}
            fechar={() => {
              setModalAberta(false);
              setSensorSelecionado(null);
              buscarSensores();
            }}
          />
        )}
      </main>
      <Footer />
    </>
  );
};

export default Sensores;
