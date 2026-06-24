// src/components/SuporteChamadosPage.jsx
import { useState, useEffect } from 'react';
import { getChamados, deletarChamado, atualizarChamado } from '../services/ChamadoService';
import { getEmpregados } from '../services/EmpregadoService';
import { getDepartamentos } from '../services/DepartamentoService';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../contexts/NotificationContext';

function SuporteChamadosPage() {
  const { showNotification } = useNotification();
  const { user, hasRole } = useAuth();
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

  // Atendimento State
  const [atendimentoChamado, setAtendimentoChamado] = useState(null);
  const [atendimentoStep, setAtendimentoStep] = useState(1);
  const [atendimentoDeptoId, setAtendimentoDeptoId] = useState('');
  const [atendimentoObservacoes, setAtendimentoObservacoes] = useState('');

  const chamadosAbertos = chamados.filter(c => c.status === 'Aberto');

  const carregarDados = async () => {
    try {
      const [chamadosData, empregadosData, deptosData] = await Promise.all([
        getChamados(true),
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

  const handleSalvarAtendimento = async (e) => {
    e.preventDefault();
    if (!atendimentoDeptoId) {
        showNotification('Selecione o centro de custo.', 'error');
        return;
    }

    const dataAtual = new Date().toLocaleString('pt-BR');
    const nomeDepto = getNomeDepto(parseInt(atendimentoDeptoId));
    const userInfo = `${user.nome} (CPF: ${user.cpf || 'N/A'}) | ${user.cargo || 'S/Cargo'} | ${user.departamento || 'S/Depto'}`;
    let logAtendimento = `[${dataAtual}] - ${userInfo} - Chamado atendido. Centro de Custo: ${nomeDepto}.`;
    if (atendimentoObservacoes) {
        logAtendimento += ` Observações: ${atendimentoObservacoes}`;
    }

    const encaminhamentosAnteriores = atendimentoChamado.detalhes?.encaminhamentos || '';
    const novosEncaminhamentos = encaminhamentosAnteriores 
        ? `${encaminhamentosAnteriores}\n${logAtendimento}` 
        : logAtendimento;

    const payload = {
        ...atendimentoChamado,
        status: 'Em Andamento',
        detalhes: {
            ...atendimentoChamado.detalhes,
            departamentoId: parseInt(atendimentoDeptoId),
            encaminhamentos: novosEncaminhamentos,
            observacoes: atendimentoObservacoes || atendimentoChamado.detalhes?.observacoes
        }
    };

    try {
        await atualizarChamado(payload);
        showNotification('Chamado atendido com sucesso! Status atualizado para Em Andamento.', 'success');
        setAtendimentoChamado(null);
        setAtendimentoStep(1);
        setAtendimentoDeptoId('');
        setAtendimentoObservacoes('');
        carregarDados();
    } catch (error) {
        showNotification('Erro ao atender chamado.', 'error');
        console.error(error);
    }
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

      {atendimentoChamado && (
          <div className="card form-card animate-fade-in" style={{ background: 'var(--bg-color-secondary)', borderRadius: '12px', padding: '20px', marginBottom: '20px', border: '2px solid var(--primary-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <h2>Atendimento de Chamado #{atendimentoChamado.id}</h2>
                  <span style={{ background: 'var(--primary-color)', color: 'white', padding: '4px 10px', borderRadius: '12px', fontSize: '0.85rem' }}>Passo {atendimentoStep} de 2</span>
              </div>
              
              <div style={{ width: '100%', background: 'var(--bg-color)', height: '8px', borderRadius: '4px', marginBottom: '20px', overflow: 'hidden' }}>
                 <div style={{ width: `${(atendimentoStep / 2) * 100}%`, background: 'var(--primary-color)', height: '100%', transition: 'width 0.3s ease' }}></div>
              </div>

              <form onSubmit={atendimentoStep === 2 ? handleSalvarAtendimento : (e) => { e.preventDefault(); setAtendimentoStep(2); }}>
                  {atendimentoStep === 1 && (
                      <div className="animate-fade-in" style={{ background: 'var(--bg-color)', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
                          <h3 style={{ marginBottom: '15px', color: 'var(--primary-color)' }}>Revisão do Chamado</h3>
                          <p><strong>Título:</strong> {atendimentoChamado.titulo}</p>
                          <p><strong>Descrição:</strong> <span style={{ whiteSpace: 'pre-wrap' }}>{atendimentoChamado.descricao}</span></p>
                          <p><strong>Solicitante:</strong> {getNomeEmpregado(atendimentoChamado.solicitanteId)}</p>
                          <p><strong>Criticidade:</strong> {atendimentoChamado.detalhes?.nivelCriticidade}</p>
                          <p><strong>Observações:</strong> {atendimentoChamado.detalhes?.observacoes || 'Nenhuma'}</p>
                          <div className="form-actions" style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                              <button type="button" className="btn btn-secondary" onClick={() => setAtendimentoChamado(null)}>Cancelar</button>
                              <button type="submit" className="btn btn-primary">Avançar para Centro de Custo</button>
                          </div>
                      </div>
                  )}

                  {atendimentoStep === 2 && (
                      <div className="animate-fade-in" style={{ background: 'var(--bg-color)', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
                          <h3 style={{ marginBottom: '15px', color: 'var(--primary-color)' }}>Definir Centro de Custo</h3>
                          <div className="form-group">
                              <label className="form-label">Centro de Custo (Departamento) *</label>
                              <select className="form-input" value={atendimentoDeptoId} onChange={(e) => setAtendimentoDeptoId(e.target.value)} required autoFocus>
                                  <option value="">Selecione para onde o chamado será encaminhado</option>
                                  {departamentos.map(d => (
                                      <option key={d.id} value={d.id}>{d.nome}</option>
                                  ))}
                              </select>
                              <small style={{ color: 'var(--text-secondary)', display: 'block', marginTop: '5px' }}>Obrigatório. Define quem pagará pelos custos do chamado. O chamado passará a ficar "Em Andamento".</small>
                          </div>
                          <div className="form-group" style={{ marginTop: '15px' }}>
                              <label className="form-label">Observações</label>
                              <textarea className="form-input" value={atendimentoObservacoes} onChange={(e) => setAtendimentoObservacoes(e.target.value)} rows="3" placeholder="Informações adicionais"></textarea>
                          </div>
                          <div className="form-actions" style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                              <button type="button" className="btn btn-secondary" onClick={() => setAtendimentoStep(1)}>Voltar</button>
                              <button type="submit" className="btn btn-primary">Confirmar Atendimento</button>
                          </div>
                      </div>
                  )}
              </form>
          </div>
      )}

      {/* Fila de Atendimento */}
      <div className="card list-card" style={{ background: 'var(--bg-color-secondary)', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <h2 style={{ marginBottom: '15px', color: 'var(--primary-color)' }}>Fila de Atendimento ({chamadosAbertos.length})</h2>
          {chamadosAbertos.length === 0 ? (
              <p className="empty-state">Parabéns! Não há chamados na fila de atendimento.</p>
          ) : (
              <div className="table-container">
                  <table className="table">
                      <thead>
                          <tr>
                              <th>ID</th>
                              <th>Título</th>
                              <th>Data</th>
                              <th>Solicitante</th>
                              <th>Criticidade</th>
                              <th>Ação</th>
                          </tr>
                      </thead>
                      <tbody>
                          {chamadosAbertos.map(chamado => (
                              <tr key={chamado.id}>
                                  <td>{chamado.id}</td>
                                  <td><strong>{chamado.titulo}</strong></td>
                                  <td>{chamado.dataAbertura ? new Date(chamado.dataAbertura).toLocaleDateString() : 'N/A'}</td>
                                  <td>{getNomeEmpregado(chamado.solicitanteId)}</td>
                                  <td>
                                      <span style={{ color: chamado.detalhes?.nivelCriticidade === 'Critico' ? 'var(--danger-color)' : chamado.detalhes?.nivelCriticidade === 'Alto' ? '#f59e0b' : 'var(--text-secondary)' }}>
                                          {chamado.detalhes?.nivelCriticidade}
                                      </span>
                                  </td>
                                  <td>
                                      <button className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={() => { setAtendimentoChamado(chamado); setAtendimentoStep(1); setAtendimentoDeptoId(''); setAtendimentoObservacoes(''); window.scrollTo({top:0, behavior:'smooth'}); }}>Atender</button>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          )}
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
                            {chamado.status !== 'Aberto' && (
                                <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', marginRight: '5px' }} onClick={() => navigate('/chamados', { state: { editChamado: chamado } })}>
                                  Editar
                                </button>
                            )}
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
