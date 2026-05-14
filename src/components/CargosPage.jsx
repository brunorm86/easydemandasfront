import { useState, useEffect } from 'react';
import { getCargos, createCargo, updateCargo, deleteCargo } from '../services/CargoService';

function CargosPage() {
  const [cargos, setCargos] = useState([]);
  const [nome, setNome] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [erro, setErro] = useState('');

  const carregarCargos = async () => {
    try {
      const data = await getCargos();
      setCargos(data);
      setErro('');
    } catch (error) {
      setErro('Não foi possível carregar os cargos.');
      console.error(error);
    }
  };

  useEffect(() => {
    carregarCargos();
  }, []);

  const handleSalvar = async (e) => {
    e.preventDefault();
    if (!nome) return;

    try {
      if (editandoId) {
        await updateCargo(editandoId, { id: editandoId, nome });
      } else {
        await createCargo({ nome });
      }
      setNome('');
      setEditandoId(null);
      carregarCargos();
    } catch (error) {
      setErro('Erro ao salvar cargo.');
      console.error(error);
    }
  };

  const handleEditar = (cargo) => {
    setNome(cargo.nome);
    setEditandoId(cargo.id);
  };

  const handleExcluir = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este cargo?')) {
      try {
        await deleteCargo(id);
        carregarCargos();
      } catch (error) {
        setErro('Erro ao excluir cargo. Pode estar em uso.');
        console.error(error);
      }
    }
  };

  return (
    <div className="page-container glass-container animate-fade-in" style={{ padding: '20px', marginTop: '20px' }}>
      <div className="page-header">
        <h1 className="page-title text-gradient">Gestão de Cargos</h1>
        <p className="subtitle" style={{ color: 'var(--text-secondary)' }}>Cadastre os cargos disponíveis para os Empregados</p>
      </div>

      {erro && <div className="error-message" style={{ color: 'var(--danger-color)', marginBottom: '10px' }}>{erro}</div>}

      <div className="card form-card" style={{ background: 'var(--bg-color-secondary)', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
        <h2 style={{ marginBottom: '15px' }}>{editandoId ? 'Editar Cargo' : 'Novo Cargo'}</h2>
        <form onSubmit={handleSalvar} className="form-grid">
          <div className="form-group">
            <label className="form-label">Nome do Cargo</label>
            <input
              className="form-input"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              placeholder="Ex: Desenvolvedor Senior"
            />
          </div>
          <div className="form-actions" style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '1px' }}>
            <button type="submit" className="btn btn-primary" style={{ marginRight: '10px' }}>
              {editandoId ? 'Atualizar Cargo' : 'Adicionar Cargo'}
            </button>
            {editandoId && (
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => { setEditandoId(null); setNome(''); }}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="card list-card" style={{ background: 'var(--bg-color-secondary)', borderRadius: '12px', padding: '20px' }}>
        <h2 style={{ marginBottom: '15px' }}>Cargos Cadastrados</h2>
        {cargos.length === 0 ? (
          <p className="empty-state">Nenhum cargo cadastrado ainda.</p>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {cargos.filter(c => c.id !== 9999).map((cargo) => (
                  <tr key={cargo.id}>
                    <td>{cargo.id}</td>
                    <td>{cargo.nome}</td>
                    <td className="action-buttons">
                      <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={() => handleEditar(cargo)}>
                        Editar
                      </button>
                      <button className="btn btn-danger" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={() => handleExcluir(cargo.id)}>
                        Excluir
                      </button>
                    </td>
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

export default CargosPage;
