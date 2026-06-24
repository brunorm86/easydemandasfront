// src/components/ChamadosPage.jsx
import { useState, useEffect } from 'react';
import { getChamados, criarChamado, atualizarChamado, deletarChamado } from '../services/ChamadoService';
import { getEmpregados } from '../services/EmpregadoService';
import { getDepartamentos } from '../services/DepartamentoService';
import { useAuth } from '../contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { useNotification } from '../contexts/NotificationContext';

function ChamadosPage() {
  const { showNotification } = useNotification();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();
  const [chamados, setChamados] = useState([]);
  const [empregados, setEmpregados] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  
  // Wizard state
  const [currentStep, setCurrentStep] = useState(0); // 0 = list, 1=Titulo, 2=Desc, 3=Depto, 4=Custo, 5=Crit, 6=Obs, 7=Review

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
  const [novoEncaminhamento, setNovoEncaminhamento] = useState('');

  const [editandoId, setEditandoId] = useState(null);
  const [detalheId, setDetalheId] = useState(null);

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

  useEffect(() => {
    if (location.state?.editChamado) {
        handleEditar(location.state.editChamado);
        navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  const handleNext = () => {
    if (currentStep === 1 && !titulo) {
      showNotification('Preencha o título.', 'error');
      return;
    }
    if (currentStep === 2 && !descricao) {
      showNotification('Preencha a descrição.', 'error');
      return;
    }
    if (currentStep === 3) {
      if (editandoId && !departamentoId) {
        showNotification('Selecione o centro de custo.', 'error');
        return;
      }
      if (editandoId && !solicitanteId) {
        showNotification('Selecione o solicitante.', 'error');
        return;
      }
    }

    if (currentStep === 2 && !editandoId) {
      setCurrentStep(4);
      return;
    }

    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (currentStep === 4 && !editandoId) {
        setCurrentStep(2);
        return;
    }
    if (currentStep > 1) {
        setCurrentStep(prev => prev - 1);
    } else {
        setCurrentStep(0);
        limparForm();
    }
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    if (currentStep !== 7) {
        handleNext();
        return;
    }

    let finalDeptoId = departamentoId;
    if (!editandoId) {
        finalDeptoId = null;
    } else if (!departamentoId) {
        showNotification('Preencha os campos obrigatórios.', 'error');
        return;
    }

    if (!titulo || !descricao || (editandoId && !solicitanteId)) {
        showNotification('Preencha os campos obrigatórios.', 'error');
        return;
    }

    const dataAtual = new Date().toLocaleString('pt-BR');
    let logFinal = encaminhamentos;

    const userInfo = `${user.nome} (CPF: ${user.cpf || 'N/A'}) | ${user.cargo || 'S/Cargo'} | ${user.departamento || 'S/Depto'}`;

    if (!editandoId) {
        logFinal = `[${dataAtual}] - ${userInfo} - Chamado criado.`;
    } else {
        if (novoEncaminhamento) {
            const evento = `[${dataAtual}] - ${userInfo} - Novo evento: ${novoEncaminhamento}`;
            logFinal = logFinal ? `${logFinal}\n${evento}` : evento;
        }
    }

    const payload = {
        titulo,
        descricao,
        status,
        solicitanteId: solicitanteId ? parseInt(solicitanteId) : 0,
        detalhes: {
            departamentoId: finalDeptoId ? parseInt(finalDeptoId) : null,
            custo: custo ? parseFloat(custo) : null,
            nivelCriticidade,
            observacoes: observacoes || null,
            encaminhamentos: logFinal || null
        }
    };

    try {
      if (editandoId) {
        if (!hasRole(['Suporte', 'Gestor'])) {
          showNotification('Você não tem permissão para editar chamados.', 'error');
          return;
        }
        payload.id = editandoId;
        payload.detalhes.id = detalheId;
        payload.detalhes.chamadoId = editandoId;
        await atualizarChamado(payload);
        showNotification('Chamado atualizado com sucesso!', 'success');
      } else {
        await criarChamado(payload);
        showNotification('Chamado criado com sucesso!', 'success');
      }
      limparForm();
      setCurrentStep(0);
      carregarDados();
    } catch (error) {
      showNotification('Erro ao salvar chamado.', 'error');
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
      setNovoEncaminhamento('');
      setEditandoId(null);
      setDetalheId(null);
  };

  const handleEditar = (chamado) => {
    if (!hasRole(['Suporte', 'Gestor'])) {
      showNotification('Você não tem permissão para editar chamados.', 'error');
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
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
      return dep ? dep.nome : 'Não informado';
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

  const renderWizardStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="form-group animate-fade-in" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Título do Chamado *</label>
            <input className="form-input" type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} required placeholder="Ex: Problema na rede" autoFocus />
            <small style={{ color: 'var(--text-secondary)' }}>Dê um título claro e objetivo para o seu problema ou requisição.</small>
          </div>
        );
      case 2:
        return (
          <div className="form-group animate-fade-in" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Descrição Detalhada *</label>
            <textarea className="form-input" value={descricao} onChange={(e) => setDescricao(e.target.value)} required rows="5" placeholder="Detalhe o motivo do chamado, mensagens de erro, etc." autoFocus></textarea>
          </div>
        );
      case 3:
        if (!editandoId) return null;
        return (
          <div className="form-group animate-fade-in" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Centro de Custo (Departamento) *</label>
            <select className="form-input" value={departamentoId} onChange={(e) => setDepartamentoId(e.target.value)} required autoFocus>
                <option value="">Selecione um departamento</option>
                {departamentos.map(d => (
                    <option key={d.id} value={d.id}>{d.nome}</option>
                ))}
            </select>
            
            {editandoId && (
              <div style={{ marginTop: '15px' }}>
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
              <div style={{ marginTop: '15px' }}>
                <label className="form-label">Solicitante *</label>
                <select className="form-input" value={solicitanteId} onChange={(e) => setSolicitanteId(e.target.value)} required>
                    <option value="">Selecione um empregado</option>
                    {empregados.map(e => (
                        <option key={e.id} value={e.id}>{e.nome} {e.sobrenome} (ID: {e.id})</option>
                    ))}
                </select>
              </div>
            )}
          </div>
        );
      case 4:
        return (
          <div className="form-group animate-fade-in" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Custo Previsto (R$)</label>
            <input className="form-input" type="number" step="0.01" value={custo} onChange={(e) => setCusto(e.target.value)} placeholder="0.00" autoFocus />
            <small style={{ color: 'var(--text-secondary)' }}>Opcional. Informe caso haja um custo atrelado à requisição.</small>
          </div>
        );
      case 5:
        return (
          <div className="form-group animate-fade-in" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Nível de Criticidade *</label>
            <select className="form-input" value={nivelCriticidade} onChange={(e) => setNivelCriticidade(e.target.value)} required autoFocus>
                <option value="Baixo">Baixo</option>
                <option value="Medio">Médio</option>
                <option value="Alto">Alto</option>
                <option value="Critico">Crítico</option>
            </select>
            <small style={{ color: 'var(--text-secondary)' }}>Isso ajuda a priorizar o atendimento.</small>
          </div>
        );
      case 6:
        return (
          <div className="form-group animate-fade-in" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Observações</label>
            <textarea className="form-input" value={observacoes} onChange={(e) => setObservacoes(e.target.value)} rows="3" placeholder="Informações adicionais" autoFocus></textarea>
            
            {editandoId && hasRole(['Suporte', 'Gestor']) && (
              <div style={{ marginTop: '15px' }}>
                <label className="form-label">Histórico de Eventos</label>
                <div className="form-input" style={{ minHeight: '80px', maxHeight: '200px', overflowY: 'auto', background: 'var(--bg-color-secondary)', color: 'var(--text-color)', whiteSpace: 'pre-wrap', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', marginBottom: '10px' }}>
                    {encaminhamentos || 'Nenhum evento registrado.'}
                </div>
                
                <label className="form-label">Adicionar Novo Evento</label>
                <textarea className="form-input" value={novoEncaminhamento} onChange={(e) => setNovoEncaminhamento(e.target.value)} rows="2" placeholder="Descreva a ação tomada..."></textarea>
              </div>
            )}
          </div>
        );
      case 7:
        return (
          <div className="review-section animate-fade-in" style={{ gridColumn: '1 / -1', background: 'var(--bg-color)', padding: '15px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
             <h3 style={{ marginBottom: '15px', color: 'var(--primary-color)' }}>Revisão das Informações</h3>
             <ul style={{ listStyleType: 'none', padding: 0 }}>
               <li style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <span><strong>Título:</strong> {titulo}</span>
                 <button type="button" onClick={() => setCurrentStep(1)} className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.8rem' }}>Editar</button>
               </li>
               <li style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                 <span><strong>Descrição:</strong> <span style={{ whiteSpace: 'pre-wrap' }}>{descricao}</span></span>
                 <button type="button" onClick={() => setCurrentStep(2)} className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.8rem', marginLeft: '10px' }}>Editar</button>
               </li>
               {editandoId && (
                 <li style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <span><strong>Centro de Custo:</strong> {getNomeDepto(parseInt(departamentoId))}</span>
                   <button type="button" onClick={() => setCurrentStep(3)} className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.8rem' }}>Editar</button>
                 </li>
               )}
               {editandoId && (
                 <>
                   <li style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <span><strong>Status:</strong> {status}</span>
                     <button type="button" onClick={() => setCurrentStep(3)} className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.8rem' }}>Editar</button>
                   </li>
                   <li style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <span><strong>Solicitante:</strong> {getNomeEmpregado(parseInt(solicitanteId))}</span>
                     <button type="button" onClick={() => setCurrentStep(3)} className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.8rem' }}>Editar</button>
                   </li>
                 </>
               )}
               <li style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <span><strong>Custo Previsto:</strong> {custo ? `R$ ${parseFloat(custo).toFixed(2)}` : 'Não informado'}</span>
                 <button type="button" onClick={() => setCurrentStep(4)} className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.8rem' }}>Editar</button>
               </li>
               <li style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <span><strong>Criticidade:</strong> {nivelCriticidade}</span>
                 <button type="button" onClick={() => setCurrentStep(5)} className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.8rem' }}>Editar</button>
               </li>
               <li style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <span><strong>Observações:</strong> {observacoes || 'Nenhuma'}</span>
                 <button type="button" onClick={() => setCurrentStep(6)} className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.8rem' }}>Editar</button>
               </li>
               {editandoId && hasRole(['Suporte', 'Gestor']) && (
                   <li style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '5px' }}>
                         <span><strong>Histórico de Eventos:</strong></span>
                         <button type="button" onClick={() => setCurrentStep(6)} className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.8rem' }}>Editar</button>
                     </div>
                     <pre style={{ whiteSpace: 'pre-wrap', margin: 0, padding: '10px', background: 'var(--bg-color-secondary)', width: '100%', borderRadius: '4px', fontSize: '0.85rem' }}>{encaminhamentos || 'Nenhum evento'}{novoEncaminhamento ? `\n\n[Novo]: ${novoEncaminhamento}` : ''}</pre>
                   </li>
               )}
             </ul>
             <p style={{ marginTop: '15px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Verifique se todas as informações estão corretas antes de confirmar a abertura do chamado.
             </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="page-container glass-container animate-fade-in" style={{ padding: '20px', marginTop: '20px' }}>
      <div className="page-header">
        <h1 className="page-title text-gradient">Meus Chamados</h1>
        <p className="subtitle" style={{ color: 'var(--text-secondary)' }}>Cadastre e acompanhe os chamados do sistema</p>
      </div>

      {currentStep > 0 && (
        <div className="card form-card" style={{ background: 'var(--bg-color-secondary)', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
             <h2>{editandoId ? 'Editar Chamado' : 'Novo Chamado'}</h2>
             <span style={{ background: 'var(--primary-color)', color: 'white', padding: '4px 10px', borderRadius: '12px', fontSize: '0.85rem' }}>Passo {!editandoId && currentStep > 2 ? currentStep - 1 : currentStep} de {!editandoId ? 6 : 7}</span>
          </div>
          
          {/* Progress Bar */}
          <div style={{ width: '100%', background: 'var(--bg-color)', height: '8px', borderRadius: '4px', marginBottom: '20px', overflow: 'hidden' }}>
             <div style={{ width: `${((!editandoId && currentStep > 2 ? currentStep - 1 : currentStep) / (!editandoId ? 6 : 7)) * 100}%`, background: 'var(--primary-color)', height: '100%', transition: 'width 0.3s ease' }}></div>
          </div>

          <form onSubmit={handleSalvar} className="form-grid">
            
            {renderWizardStep()}

            <div className="form-actions" style={{ gridColumn: '1 / -1', marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={handleBack}
              >
                {currentStep === 1 ? 'Cancelar' : 'Voltar'}
              </button>

              <button type="submit" className="btn btn-primary">
                {currentStep === 7 ? (editandoId ? 'Confirmar Edição' : 'Confirmar e Abrir Chamado') : 'Avançar'}
              </button>
            </div>
          </form>
        </div>
      )}

      {currentStep === 0 && (
        <div className="card list-card" style={{ background: 'var(--bg-color-secondary)', borderRadius: '12px', padding: '20px' }}>
          <div className="page-header" style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <h2 style={{ margin: 0 }}>Chamados Abertos / Histórico</h2>
            </div>
            
            <div className="flex gap-2" style={{ alignItems: 'center' }}>
              <button 
                  className="btn btn-primary" 
                  onClick={() => { limparForm(); setCurrentStep(1); }}
                  style={{ marginRight: '15px', fontWeight: 'bold' }}
              >
                  + Abrir chamado
              </button>

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
                          {chamado.status !== 'Aberto' && (
                            <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', marginRight: '5px' }} onClick={() => handleEditar(chamado)}>
                              Editar
                            </button>
                          )}
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
      )}
    </div>
  );
}

export default ChamadosPage;
