import React, { useState, useEffect } from 'react';
import { getCargos } from '../services/CargoService';
import { getDepartamentos } from '../services/DepartamentoService';
import { getPessoas } from '../services/PessoaService';

const EmpregadoForm = ({ empregadoEditando, onSalvar, onCancelar }) => {
  const [empregado, setEmpregado] = useState({
    pessoaId: '',
    cargoId: '',
    departamentoId: '',
    dataContratacao: ''
  });

  const [cargos, setCargos] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [pessoas, setPessoas] = useState([]);

  useEffect(() => {
    if (empregadoEditando) {
      setEmpregado(empregadoEditando);
    } else {
      setEmpregado({
        pessoaId: '',
        cargoId: '',
        departamentoId: '',
        dataContratacao: ''
      });
    }
  }, [empregadoEditando]);

  useEffect(() => {
    const carregarDependencias = async () => {
      try {
        const [cargosData, depsData, pessoasData] = await Promise.all([
          getCargos(),
          getDepartamentos(),
          getPessoas()
        ]);
        setCargos(cargosData);
        setDepartamentos(depsData);
        setPessoas(pessoasData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };
    carregarDependencias();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmpregado({ ...empregado, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...empregado,
      pessoaId: parseInt(empregado.pessoaId, 10),
      cargoId: parseInt(empregado.cargoId, 10),
      departamentoId: empregado.departamentoId ? parseInt(empregado.departamentoId, 10) : null
    };
    onSalvar(payload);
  };

  return (
    <div className="card glass-container">
      <h2 className="mb-4">
        {empregadoEditando ? 'Editar Empregado' : 'Adicionar Novo Empregado'}
      </h2>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="pessoaId">Pessoa Vinculada *</label>
            <select className="form-input" id="pessoaId" name="pessoaId" value={empregado.pessoaId} onChange={handleChange} required disabled={!!empregadoEditando}>
              <option value="">Selecione uma pessoa</option>
              {pessoas.map((p) => (
                <option key={p.id} value={p.id}>{p.nome} {p.sobrenome}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="cargoId">Cargo *</label>
            <select className="form-input" id="cargoId" name="cargoId" value={empregado.cargoId} onChange={handleChange} required>
              <option value="">Selecione um cargo</option>
              {cargos.map((c) => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="departamentoId">Departamento</label>
            <select className="form-input" id="departamentoId" name="departamentoId" value={empregado.departamentoId || ''} onChange={handleChange}>
              <option value="">Nenhum departamento</option>
              {departamentos.map((d) => (
                <option key={d.id} value={d.id}>{d.nome}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="dataContratacao">Data de Contratação *</label>
            <input className="form-input" type="date" id="dataContratacao" name="dataContratacao" value={empregado.dataContratacao} onChange={handleChange} required />
          </div>
        </div>

        <div className="flex gap-4 mt-4" style={{ justifyContent: 'flex-end' }}>
          {empregadoEditando && (
            <button type="button" className="btn btn-secondary" onClick={onCancelar}>
              Cancelar
            </button>
          )}
          <button type="submit" className="btn btn-primary">
            {empregadoEditando ? 'Salvar Alterações' : 'Adicionar Empregado'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmpregadoForm;
