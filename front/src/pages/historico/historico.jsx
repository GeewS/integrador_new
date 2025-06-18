import React, { useState, useEffect } from 'react';
import styles from './historico.module.css';
import { FaSearch, FaDownload } from 'react-icons/fa';
import axios from 'axios';
import { saveAs } from 'file-saver';
import Header from '../../componentes/header/header';
import Footer from '../../componentes/footer/footer';

const Historicos = () => {
  // Estados para dados, filtros, paginação e mapeamentos
  const [todosHistoricos, setTodosHistoricos] = useState([]);
  const [historicosFiltrados, setHistoricosFiltrados] = useState([]);
  const [historicosPaginados, setHistoricosPaginados] = useState([]);
  const [mapaSensores, setMapaSensores] = useState({});
  const [mapaAmbientes, setMapaAmbientes] = useState({});
  const [tiposSensores, setTiposSensores] = useState([]);
  const [filtroSensor, setFiltroSensor] = useState('');
  const [filtroData, setFiltroData] = useState('');
  const [filtroHora, setFiltroHora] = useState('');
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  const itensPorPagina = 10;

  // Cabeçalhos de autenticação para API
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  // Busca dados iniciais (historicos, sensores, ambientes)
  const fetchDados = async () => {
    try {
      const headers = getAuthHeaders().headers;

      const historicosRes = await axios.get('http://localhost:8000/api/historicos', { headers });
      setTodosHistoricos(historicosRes.data);
      setHistoricosFiltrados(historicosRes.data);

      const sensoresRes = await axios.get('http://localhost:8000/api/sensores', { headers });
      const sensoresMap = {};
      const tiposSet = new Set();
      sensoresRes.data.forEach(sensor => {
        sensoresMap[sensor.id] = sensor.sensor;
        tiposSet.add(sensor.sensor);
      });
      setMapaSensores(sensoresMap);
      setTiposSensores(Array.from(tiposSet));

      const ambientesRes = await axios.get('http://localhost:8000/api/ambientes', { headers });
      const ambientesMap = {};
      ambientesRes.data.forEach(amb => {
        ambientesMap[amb.id] = amb.descricao;
      });
      setMapaAmbientes(ambientesMap);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  };

  // Busca dados no carregamento
  useEffect(() => {
    fetchDados();
  }, []);

  // Atualiza paginação quando filtros ou página mudam
  useEffect(() => {
    const total = Math.ceil(historicosFiltrados.length / itensPorPagina);
    setTotalPaginas(total);

    const inicio = (pagina - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;
    setHistoricosPaginados(historicosFiltrados.slice(inicio, fim));
  }, [historicosFiltrados, pagina]);

  // Aplica filtros e reseta página
  const aplicarFiltros = () => {
    let dadosFiltrados = [...todosHistoricos];

    if (filtroSensor) {
      dadosFiltrados = dadosFiltrados.filter(h => mapaSensores[h.sensor] === filtroSensor);
    }

    if (filtroData) {
      dadosFiltrados = dadosFiltrados.filter(h => h.timestamp?.startsWith(filtroData));
    }

    if (filtroHora) {
      dadosFiltrados = dadosFiltrados.filter(h => h.timestamp?.includes(filtroHora));
    }

    setHistoricosFiltrados(dadosFiltrados);
    setPagina(1);
  };

  // Baixa arquivo Excel exportado
  const baixarExcel = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/exportar/ambientes/', {
        ...getAuthHeaders(),
        responseType: 'blob',
      });
      saveAs(response.data, 'historico.xlsx');
    } catch (error) {
      console.error('Erro ao baixar Excel:', error);
    }
  };

  // Limpa filtros e reseta página
  const limparFiltros = () => {
    setFiltroSensor('');
    setFiltroData('');
    setFiltroHora('');
    setHistoricosFiltrados(todosHistoricos);
    setPagina(1);
  };

  return (
    <>
      <Header />
      <main className={styles.container}>
        <h1 className={styles.heading}>Histórico</h1>

        {/* Controles de filtro e ações */}
        <section className={styles.topControls} aria-label="Filtros e ações">
          <div className={styles.filterGroup}>
            <label htmlFor="sensorSelect">Tipo de Sensor:</label>
            <select
            className={styles.sensorSelect}
              value={filtroSensor}
              onChange={e => setFiltroSensor(e.target.value)}
            >
              <option value="">Todos os sensores</option>
              {tiposSensores.map(tipo => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="dataFiltro">Data:</label>
            <input
              id="dataFiltro"
              type="date"
              value={filtroData}
              onChange={e => setFiltroData(e.target.value)}
            />
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="horaFiltro">Hora:</label>
            <input
              id="horaFiltro"
              type="time"
              value={filtroHora}
              onChange={e => setFiltroHora(e.target.value)}
            />
          </div>

          <button onClick={aplicarFiltros} aria-label="Buscar">
            <FaSearch />
          </button>

          <button onClick={limparFiltros} type="button">
            Apagar Filtros
          </button>

          <button onClick={baixarExcel} aria-label="Download Excel">
            <FaDownload /> Download
          </button>
        </section>

        {/* Tabela de históricos */}
        <section>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Sensor</th>
                <th>Ambiente</th>
                <th>Valor</th>
                <th>Data e Hora</th>
              </tr>
            </thead>
            <tbody>
              {historicosPaginados.map(historico => (
                <tr key={historico.id}>
                  <td>{historico.id}</td>
                  <td>{mapaSensores[historico.sensor] || 'Desconhecido'}</td>
                  <td>{mapaAmbientes[historico.ambiente] || 'Desconhecido'}</td>
                  <td>{historico.valor}</td>
                  <td>{historico.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Controle de paginação */}
        <nav className={styles.pagination} aria-label="Paginação">
          <button
            onClick={() => setPagina(p => Math.max(p - 1, 1))}
            disabled={pagina === 1}
          >
            Anterior
          </button>
          <span>
            Página {pagina} de {totalPaginas}
          </span>
          <button
            onClick={() => setPagina(p => Math.min(p + 1, totalPaginas))}
            disabled={pagina === totalPaginas}
          >
            Próxima
          </button>
        </nav>
      </main>
      <Footer />
    </>
  );
};

export default Historicos;
