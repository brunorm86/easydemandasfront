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
    <div className="page-container">
      <div className="page-header">
        <h1>Gestão de Cargos</h1>
        <p className="subtitle">Cadastre os cargos disponíveis para os Empregados</p>
      </div>

      {erro && <div className="error-message">{erro}</div>}

      <div className="card form-card">
        <h2>{editandoId ? 'Editar Cargo' : 'Novo Cargo'}</h2>
        <form onSubmit={handleSalvar} className="form-grid">
          <div className="form-group">
            <label>Nome do Cargo</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              placeholder="Ex: Desenvolvedor Senior"
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
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

      <div className="card list-card">
        <h2>Cargos Cadastrados</h2>
        {cargos.length === 0 ? (
          <p className="empty-state">Nenhum cargo cadastrado ainda.</p>
        ) : (
          <div className="table-responsive">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {cargos.map((cargo) => (
                  <tr key={cargo.id}>
                    <td>{cargo.id}</td>
                    <td>{cargo.nome}</td>
                    <td className="actions-cell">
                      <button className="btn btn-small btn-secondary" onClick={() => handleEditar(cargo)}>
                        Editar
                      </button>
                      <button className="btn btn-small btn-danger" onClick={() => handleExcluir(cargo.id)}>
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
