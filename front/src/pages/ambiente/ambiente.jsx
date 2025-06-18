import React, { useState, useEffect } from 'react';
import styles from './ambiente.module.css';
import { FaTrash, FaEdit, FaSearch, FaDownload, FaPlus } from 'react-icons/fa';
import axios from 'axios';
import { saveAs } from 'file-saver';
import Header from '../../componentes/header/header';
import Footer from '../../componentes/footer/footer';
import AmbienteModal from '../../componentes/modals/modal_ambientes/modalAmbientes';

const Ambientes = () => {
  const [ambientes, setAmbientes] = useState([]);
  const [busca, setBusca] = useState('');
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [modalAberta, setModalAberta] = useState(false);
  const [ambienteSelecionado, setAmbienteSelecionado] = useState(null);

  const itensPorPagina = 10;

  // Recupera o token para autenticação nas requisições
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  };

  // Faz requisição e filtra ambientes, atualizando lista e paginação
  const buscarAmbientes = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/ambientes', getAuthHeaders());
      let dados = response.data;

      if (busca) {
        dados = dados.filter(a =>
          a.sig?.toString().toLowerCase().includes(busca.toLowerCase())
        );
      }

      setTotalPaginas(Math.ceil(dados.length / itensPorPagina));
      setAmbientes(dados.slice((pagina - 1) * itensPorPagina, pagina * itensPorPagina));
    } catch (error) {
      console.error('Erro ao buscar ambientes:', error);
    }
  };

  // Atualiza lista ao mudar de página ou ao abrir/fechar modal
  useEffect(() => {
    buscarAmbientes();
  }, [pagina, modalAberta]);

  // Exclui ambiente após confirmação do usuário
  const excluirAmbiente = async (id) => {
    if (!window.confirm('Deseja realmente excluir este ambiente?')) return;
    try {
      await axios.delete(`http://localhost:8000/api/ambiente/${id}`, getAuthHeaders());
      buscarAmbientes();
    } catch (err) {
      console.error('Erro ao excluir ambiente:', err);
    }
  };

  // Exporta lista em Excel
  const baixarExcel = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/exportar/ambientes/', {
        ...getAuthHeaders(),
        responseType: 'blob'
      });
      saveAs(response.data, 'ambientes.xlsx');
    } catch (error) {
      console.error('Erro ao baixar Excel:', error);
    }
  };

  return (
    <>
      <Header />
      <main className={styles.mainContent}>
        <section className={styles.container} aria-label="Seção de gerenciamento de ambientes">
          <h1 className={styles.pageTitle}>Ambientes</h1>

          {/* Controles superiores: busca, registro e exportação */}
          <div className={styles.topControls}>
              <div className={styles.filterGroup}>
                <label htmlFor="sigInput">Sig:</label>
                <input
                  id="sigInput"
                  type="text"
                  placeholder="Busque pelo sig do ambiente"
                  value={busca}
                  onChange={e => setBusca(e.target.value)}
                />
              </div>

              <button onClick={() => {
                setPagina(1); 
                buscarAmbientes();
              }} aria-label="Buscar ambiente">
                <FaSearch />
              </button>

              <button onClick={() => setModalAberta(true)} aria-label="Registrar novo ambiente">
                <FaPlus /> Registrar
              </button>

              <button onClick={baixarExcel} aria-label="Baixar lista em Excel">
                <FaDownload /> Download
              </button>
          </div>
          

          {/* Tabela principal de ambientes */}
          <section className={styles.tableSection} aria-label="Tabela de ambientes cadastrados">
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Ações</th>
                  <th>ID</th>
                  <th>Sig</th>
                  <th>Descrição</th>
                  <th>Ni</th>
                  <th>Responsável</th>
                </tr>
              </thead>
              <tbody>
                {ambientes.map(amb => (
                  <tr key={amb.id}>
                    <td>
                      <div className={styles.actionButtons} role="group" aria-label="Ações do ambiente">
                        <button
                          onClick={() => {
                            setAmbienteSelecionado(amb);
                            setModalAberta(true); 
                          }}
                          aria-label="Editar ambiente"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => excluirAmbiente(amb.id)}
                          aria-label={`Excluir ambiente ${amb.id}`}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                    <td>{amb.id}</td>
                    <td>{amb.sig}</td>
                    <td>{amb.descricao}</td>
                    <td>{amb.ni}</td>
                    <td>{amb.responsavel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Paginação */}
          <nav className={styles.pagination} aria-label="Navegação por páginas">
            <button onClick={() => setPagina(p => Math.max(p - 1, 1))}>
              Anterior
            </button>
            <span>Página {pagina} de {totalPaginas}</span>
            <button onClick={() => setPagina(p => Math.min(p + 1, totalPaginas))}>
              Próxima
            </button>
          </nav>

          {/* Modal de edição/criação */}
          {modalAberta && (
            <AmbienteModal
              ambiente={ambienteSelecionado}
              fechar={() => {
                setModalAberta(false);
                setAmbienteSelecionado(null); 
                buscarAmbientes(); 
              }}
            />
          )}
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Ambientes;
