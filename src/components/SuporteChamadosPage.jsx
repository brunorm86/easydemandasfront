// src/components/SuporteChamadosPage.jsx
import { useState, useEffect } from 'react';
import { getChamados, deletarChamado } from '../services/ChamadoService';
import { getEmpregados } from '../services/EmpregadoService';
import { getDepartamentos } from '../services/DepartamentoService';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../contexts/NotificationContext';

function SuporteChamadosPage() {
  const { showNotification } = useNotification();
  const { hasRole } = useAuth();
  const navigate = useNavigate();
  
  const [chamados, setChamados] = useState([]);
  const [empregados, setEmpregados] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);

  // Filtros
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDeptoOrigem, setFilterDeptoOrigem] = useState('');
  const [filterCentroCusto, setFilterCentroCusto] = useState('');
  const [filterCriticidade, setFilterCriticidade] = useState('');
  const [filterEmpregado, setFilterEmpregado] = useState('');

  const carregarDados = async () => {
    try {
      const [chamadosData, empregadosData, deptosData] = await Promise.all([
        getChamados(),
        getEmpregados(),
        getDepartamentos()
      ]);
      setChamados(chamadosData);
      setEmpregados(empregadosData);
      setDepartamentos(deptosData);
    } catch (error) {
      showNotification('Não foi possível carregar os dados.', 'error');
      console.error(error);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleExcluir = async (id) => {
    if (!hasRole(['Suporte', 'Gestor'])) {
      showNotification('Você não tem permissão para excluir chamados.', 'error');
      return;
    }
    if (window.confirm('Tem certeza que deseja excluir este chamado?')) {
      try {
        await deletarChamado(id);
        showNotification('Chamado excluído com sucesso!', 'success');
        carregarDados();
      } catch (error) {
        showNotification('Erro ao excluir chamado.', 'error');
        console.error(error);
      }
    }
  };

  const getNomeEmpregado = (id) => {
      const emp = empregados.find(e => e.id === id);
      return emp ? `${emp.nome} ${emp.sobrenome}` : 'Desconhecido';
  };

  const getNomeDepto = (id) => {
      const dep = departamentos.find(d => d.id === id);
      return dep ? dep.nome : 'Desconhecido';
  };

  const limparFiltros = () => {
      setFilterStatus('');
      setFilterDeptoOrigem('');
      setFilterCentroCusto('');
      setFilterCriticidade('');
      setFilterEmpregado('');
  };

  const chamadosFiltrados = chamados.filter(chamado => {
      let match = true;
      
      // Status
      if (filterStatus && chamado.status !== filterStatus) {
          match = false;
      }
      
      // Empregado de Origem (Solicitante)
      if (filterEmpregado && chamado.solicitanteId.toString() !== filterEmpregado) {
          match = false;
      }
      
      // Centro de Custo (DetalhesChamado.DepartamentoId)
      if (filterCentroCusto && chamado.detalhes?.departamentoId?.toString() !== filterCentroCusto) {
          match = false;
      }
      
      // Criticidade
      if (filterCriticidade && chamado.detalhes?.nivelCriticidade !== filterCriticidade) {
          match = false;
      }

      // Departamento de Origem (Solicitante.DepartamentoId)
      if (filterDeptoOrigem) {
          const emp = empregados.find(e => e.id === chamado.solicitanteId);
          if (!emp || emp.departamentoId?.toString() !== filterDeptoOrigem) {
              match = false;
          }
      }

      return match;
  });

  return (
    <div className="page-container glass-container animate-fade-in" style={{ padding: '20px', marginTop: '20px' }}>
      <div className="page-header">
        <h1 className="page-title text-gradient">Filtro Avançado de Chamados</h1>
        <p className="subtitle" style={{ color: 'var(--text-secondary)' }}>Central de busca exclusiva para Suporte</p>
      </div>

      {/* Painel de Filtros */}
      <div className="card form-card" style={{ background: 'var(--bg-color-secondary)', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h2>Filtros</h2>
            <button onClick={limparFiltros} className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>Limpar Filtros</button>
        </div>
        
        <div className="form-grid">
            <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-input" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                    <option value="">Todos</option>
                    <option value="Aberto">Aberto</option>
                    <option value="Em Andamento">Em Andamento</option>
                    <option value="Concluído">Concluído</option>
                    <option value="Cancelado">Cancelado</option>
                </select>
            </div>

            <div className="form-group">
                <label className="form-label">Empregado de Origem</label>
                <select className="form-input" value={filterEmpregado} onChange={(e) => setFilterEmpregado(e.target.value)}>
                    <option value="">Todos</option>
                    {empregados.map(e => (
                        <option key={e.id} value={e.id}>{e.nome} {e.sobrenome}</option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label className="form-label">Departamento de Origem</label>
                <select className="form-input" value={filterDeptoOrigem} onChange={(e) => setFilterDeptoOrigem(e.target.value)}>
                    <option value="">Todos</option>
                    {departamentos.map(d => (
                        <option key={d.id} value={d.id}>{d.nome}</option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label className="form-label">Centro de Custo</label>
                <select className="form-input" value={filterCentroCusto} onChange={(e) => setFilterCentroCusto(e.target.value)}>
                    <option value="">Todos</option>
                    {departamentos.map(d => (
                        <option key={d.id} value={d.id}>{d.nome}</option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label className="form-label">Criticidade</label>
                <select className="form-input" value={filterCriticidade} onChange={(e) => setFilterCriticidade(e.target.value)}>
                    <option value="">Todas</option>
                    <option value="Baixo">Baixo</option>
                    <option value="Medio">Médio</option>
                    <option value="Alto">Alto</option>
                    <option value="Critico">Crítico</option>
                </select>
            </div>
        </div>
      </div>

      {/* Resultados */}
      <div className="card list-card" style={{ background: 'var(--bg-color-secondary)', borderRadius: '12px', padding: '20px' }}>
        <h2 style={{ marginBottom: '15px' }}>Resultados ({chamadosFiltrados.length})</h2>
        
        {chamadosFiltrados.length === 0 ? (
          <p className="empty-state">Nenhum chamado encontrado para os filtros selecionados.</p>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Título</th>
                  <th>Data</th>
                  <th>Status</th>
                  <th>Origem (Empregado / Depto)</th>
                  <th>Centro Custo</th>
                  <th>Criticidade</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {chamadosFiltrados.map((chamado) => {
                  const emp = empregados.find(e => e.id === chamado.solicitanteId);
                  const nomeDeptoOrigem = emp ? getNomeDepto(emp.departamentoId) : 'Desconhecido';

                  return (
                    <tr key={chamado.id}>
                        <td>{chamado.id}</td>
                        <td><strong>{chamado.titulo}</strong></td>
                        <td>{chamado.dataAbertura ? new Date(chamado.dataAbertura).toLocaleDateString() : 'N/A'}</td>
                        <td>
                        <span style={{
                            padding: '4px 8px', 
                            borderRadius: '4px', 
                            fontSize: '0.8rem',
                            fontWeight: 'bold',
                            background: chamado.status === 'Aberto' ? 'var(--primary-color)' : 
                                        chamado.status === 'Concluído' ? 'var(--success-color)' : 
                                        chamado.status === 'Cancelado' ? 'var(--danger-color)' : '#f59e0b',
                            color: '#fff'
                        }}>
                            {chamado.status}
                        </span>
                        </td>
                        <td>
                          {getNomeEmpregado(chamado.solicitanteId)}<br/>
                          <small style={{ color: 'var(--text-secondary)' }}>{nomeDeptoOrigem}</small>
                        </td>
                        <td>
                          {getNomeDepto(chamado.detalhes?.departamentoId)}
                        </td>
                        <td>
                        <span style={{
                            color: chamado.detalhes?.nivelCriticidade === 'Critico' ? 'var(--danger-color)' : 
                                    chamado.detalhes?.nivelCriticidade === 'Alto' ? '#f59e0b' : 'var(--text-secondary)'
                        }}>
                            {chamado.detalhes?.nivelCriticidade}
                        </span>
                        </td>
                        <td className="action-buttons">
                            <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', marginRight: '5px' }} onClick={() => navigate('/chamados', { state: { editChamado: chamado } })}>
                              Editar
                            </button>
                            <button className="btn btn-danger" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={() => handleExcluir(chamado.id)}>
                                Excluir
                            </button>
                        </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default SuporteChamadosPage;
