// src/components/ChamadosPage.jsx
import { useState, useEffect } from 'react';
import { getChamados, criarChamado, atualizarChamado, deletarChamado } from '../services/ChamadoService';
import { getEmpregados } from '../services/EmpregadoService';
import { getDepartamentos } from '../services/DepartamentoService';
import { useAuth } from '../contexts/AuthContext';

function ChamadosPage() {
  const { hasRole } = useAuth();
  const [chamados, setChamados] = useState([]);
  const [empregados, setEmpregados] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  
  // Chamado data
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [status, setStatus] = useState('Aberto');
  const [solicitanteId, setSolicitanteId] = useState('');
  
  // DetalhesChamado data
  const [departamentoId, setDepartamentoId] = useState('');
  const [custo, setCusto] = useState('');
  const [nivelCriticidade, setNivelCriticidade] = useState('Baixo');
  const [observacoes, setObservacoes] = useState('');
  const [encaminhamentos, setEncaminhamentos] = useState('');

  const [editandoId, setEditandoId] = useState(null);
  const [detalheId, setDetalheId] = useState(null);
  const [erro, setErro] = useState('');

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
      setErro('');
    } catch (error) {
      setErro('Não foi possível carregar os dados.');
      console.error(error);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleSalvar = async (e) => {
    e.preventDefault();
    if (!titulo || !descricao || (editandoId && !solicitanteId) || !departamentoId) {
        setErro('Preencha os campos obrigatórios (Título, Descrição, Centro de Custo' + (editandoId ? ' e Solicitante' : '') + ').');
        return;
    }

    const payload = {
        titulo,
        descricao,
        status,
        solicitanteId: solicitanteId ? parseInt(solicitanteId) : 0,
        detalhes: {
            departamentoId: parseInt(departamentoId),
            custo: custo ? parseFloat(custo) : null,
            nivelCriticidade,
            observacoes: observacoes || null,
            encaminhamentos: encaminhamentos || null
        }
    };

    try {
      if (editandoId) {
        if (!hasRole(['Suporte', 'Gestor'])) {
          setErro('Você não tem permissão para editar chamados.');
          return;
        }
        payload.id = editandoId;
        payload.detalhes.id = detalheId;
        payload.detalhes.chamadoId = editandoId;
        await atualizarChamado(payload);
      } else {
        await criarChamado(payload);
      }
      limparForm();
      carregarDados();
    } catch (error) {
      setErro('Erro ao salvar chamado.');
      console.error(error);
    }
  };

  const limparForm = () => {
      setTitulo('');
      setDescricao('');
      setStatus('Aberto');
      setSolicitanteId('');
      setDepartamentoId('');
      setCusto('');
      setNivelCriticidade('Baixo');
      setObservacoes('');
      setEncaminhamentos('');
      setEditandoId(null);
      setDetalheId(null);
  };

  const handleEditar = (chamado) => {
    if (!hasRole(['Suporte', 'Gestor'])) {
      setErro('Você não tem permissão para editar chamados.');
      return;
    }
    setTitulo(chamado.titulo);
    setDescricao(chamado.descricao);
    setStatus(chamado.status);
    setSolicitanteId(chamado.solicitanteId);
    
    if (chamado.detalhes) {
        setDetalheId(chamado.detalhes.id);
        setDepartamentoId(chamado.detalhes.departamentoId);
        setCusto(chamado.detalhes.custo || '');
        setNivelCriticidade(chamado.detalhes.nivelCriticidade || 'Baixo');
        setObservacoes(chamado.detalhes.observacoes || '');
        setEncaminhamentos(chamado.detalhes.encaminhamentos || '');
    }
    
    setEditandoId(chamado.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExcluir = async (id) => {
    if (!hasRole(['Suporte', 'Gestor'])) {
      setErro('Você não tem permissão para excluir chamados.');
      return;
    }
    if (window.confirm('Tem certeza que deseja excluir este chamado?')) {
      try {
        await deletarChamado(id);
        carregarDados();
      } catch (error) {
        setErro('Erro ao excluir chamado.');
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

  const [sortField, setSortField] = useState(null); // 'titulo' | 'data'
  const [sortDir, setSortDir] = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const getSortedChamados = () => {
    if (!sortField) return chamados;
    
    return [...chamados].sort((a, b) => {
      let valA, valB;
      
      if (sortField === 'titulo') {
        valA = a.titulo.toLowerCase();
        valB = b.titulo.toLowerCase();
      } else {
        valA = a.dataAbertura;
        valB = b.dataAbertura;
      }
      
      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const sortIcon = (field) => {
    if (sortField !== field) return ' ⇅';
    return sortDir === 'asc' ? ' ▲' : ' ▼';
  };

  const sortedChamados = getSortedChamados();

  return (
    <div className="page-container glass-container animate-fade-in" style={{ padding: '20px', marginTop: '20px' }}>
      <div className="page-header">
        <h1 className="page-title text-gradient">Gestão de Chamados</h1>
        <p className="subtitle" style={{ color: 'var(--text-secondary)' }}>Cadastre e acompanhe os chamados do sistema</p>
      </div>

      {erro && <div className="error-message" style={{ color: 'var(--danger-color)', marginBottom: '10px' }}>{erro}</div>}

      <div className="card form-card" style={{ background: 'var(--bg-color-secondary)', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
        <h2 style={{ marginBottom: '15px' }}>{editandoId ? 'Editar Chamado' : 'Novo Chamado'}</h2>
        <form onSubmit={handleSalvar} className="form-grid">
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '5px', color: 'var(--primary-color)' }}>Informações Básicas</h3>
          </div>

          <div className="form-group">
            <label className="form-label">Título *</label>
            <input className="form-input" type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} required placeholder="Ex: Problema na rede" />
          </div>
          
          {editandoId && (
            <div className="form-group">
              <label className="form-label">Status *</label>
              <select className="form-input" value={status} onChange={(e) => setStatus(e.target.value)} required>
                  <option value="Aberto">Aberto</option>
                  <option value="Em Andamento">Em Andamento</option>
                  <option value="Concluído">Concluído</option>
                  <option value="Cancelado">Cancelado</option>
              </select>
            </div>
          )}

          {editandoId && (
            <div className="form-group">
              <label className="form-label">Solicitante *</label>
              <select className="form-input" value={solicitanteId} onChange={(e) => setSolicitanteId(e.target.value)} required>
                  <option value="">Selecione um empregado</option>
                  {empregados.map(e => (
                      <option key={e.id} value={e.id}>{e.nome} {e.sobrenome} (ID: {e.id})</option>
                  ))}
              </select>
            </div>
          )}

          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Descrição *</label>
            <textarea className="form-input" value={descricao} onChange={(e) => setDescricao(e.target.value)} required rows="3" placeholder="Detalhe o motivo do chamado"></textarea>
          </div>

          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '5px', marginTop: '15px', color: 'var(--primary-color)' }}>Detalhes do Chamado</h3>
          </div>

          <div className="form-group">
            <label className="form-label">Centro de Custo (Depto) *</label>
            <select className="form-input" value={departamentoId} onChange={(e) => setDepartamentoId(e.target.value)} required>
                <option value="">Selecione um departamento</option>
                {departamentos.map(d => (
                    <option key={d.id} value={d.id}>{d.nome}</option>
                ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Custo Previsto (R$)</label>
            <input className="form-input" type="number" step="0.01" value={custo} onChange={(e) => setCusto(e.target.value)} placeholder="0.00" />
          </div>

          <div className="form-group">
            <label className="form-label">Nível de Criticidade *</label>
            <select className="form-input" value={nivelCriticidade} onChange={(e) => setNivelCriticidade(e.target.value)} required>
                <option value="Baixo">Baixo</option>
                <option value="Medio">Médio</option>
                <option value="Alto">Alto</option>
                <option value="Critico">Crítico</option>
            </select>
          </div>

          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Observações</label>
            <textarea className="form-input" value={observacoes} onChange={(e) => setObservacoes(e.target.value)} rows="2"></textarea>
          </div>

          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Encaminhamentos</label>
            <textarea className="form-input" value={encaminhamentos} onChange={(e) => setEncaminhamentos(e.target.value)} rows="2"></textarea>
          </div>

          <div className="form-actions" style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
            <button type="submit" className="btn btn-primary" style={{ marginRight: '10px' }}>
              {editandoId ? 'Atualizar Chamado' : 'Abrir Chamado'}
            </button>
            {editandoId && (
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={limparForm}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="card list-card" style={{ background: 'var(--bg-color-secondary)', borderRadius: '12px', padding: '20px' }}>
        <div className="page-header" style={{ marginBottom: '15px' }}>
          <h2>Chamados Abertos / Histórico</h2>
          <div className="flex gap-2">
            <button 
              className={`btn ${sortField === 'titulo' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => handleSort('titulo')}
            >
              Título {sortIcon('titulo')}
            </button>
            <button 
              className={`btn ${sortField === 'data' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => handleSort('data')}
            >
              Data {sortIcon('data')}
            </button>
          </div>
        </div>
        
        {sortedChamados.length === 0 ? (
          <p className="empty-state">Nenhum chamado cadastrado ainda.</p>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Título</th>
                  <th>Data</th>
                  <th>Status</th>
                  <th>Solicitante</th>
                  <th>Centro de Custo</th>
                  <th>Criticidade</th>
                  {hasRole(['Suporte', 'Gestor']) && <th>Ações</th>}
                </tr>
              </thead>
              <tbody>
                {sortedChamados.map((chamado) => (
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
                    <td>{getNomeEmpregado(chamado.solicitanteId)}</td>
                    <td>
                      {getNomeDepto(chamado.detalhes?.departamentoId)}
                      {chamado.detalhes?.custo && <><br/><small style={{ color: 'var(--success-color)' }}>R$ {chamado.detalhes.custo}</small></>}
                    </td>
                    <td>
                      <span style={{
                          color: chamado.detalhes?.nivelCriticidade === 'Critico' ? 'var(--danger-color)' : 
                                 chamado.detalhes?.nivelCriticidade === 'Alto' ? '#f59e0b' : 'var(--text-secondary)'
                      }}>
                        {chamado.detalhes?.nivelCriticidade}
                      </span>
                    </td>
                    {hasRole(['Suporte', 'Gestor']) && (
                      <td className="action-buttons">
                        <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', marginRight: '5px' }} onClick={() => handleEditar(chamado)}>
                          Editar
                        </button>
                        <button className="btn btn-danger" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={() => handleExcluir(chamado.id)}>
                          Excluir
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChamadosPage;
