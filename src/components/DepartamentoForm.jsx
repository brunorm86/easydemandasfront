// src/components/DepartamentoForm.jsx
import React, { useState, useEffect } from 'react';
import { getEmpregados } from '../services/EmpregadoService';

const DepartamentoForm = ({ departamentoEditando, onSalvar, onCancelar }) => {
  const [departamento, setDepartamento] = useState({
    nome: '',
    sigla: '',
    responsavelId: ''
  });
  const [empregados, setEmpregados] = useState([]);

  useEffect(() => {
    carregarEmpregados();
  }, []);

  const carregarEmpregados = async () => {
    try {
      const data = await getEmpregados();
      setEmpregados(data);
    } catch (error) {
      console.error('Erro ao carregar empregados:', error);
    }
  };

  useEffect(() => {
    if (departamentoEditando) {
      setDepartamento({
        id: departamentoEditando.id,
        nome: departamentoEditando.nome,
        sigla: departamentoEditando.sigla || '',
        responsavelId: departamentoEditando.responsavelId || ''
      });
    } else {
      setDepartamento({
        nome: '',
        sigla: '',
        responsavelId: ''
      });
    }
  }, [departamentoEditando]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDepartamento({ ...departamento, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSalvar(departamento);
  };

  return (
    <div className="card glass-container">
      <h2 className="mb-4">
        {departamentoEditando ? 'Editar Departamento' : 'Adicionar Novo Departamento'}
      </h2>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="nome">Nome *</label>
            <input className="form-input" type="text" id="nome" name="nome" value={departamento.nome} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="sigla">Sigla</label>
            <input className="form-input" type="text" id="sigla" name="sigla" value={departamento.sigla} onChange={handleChange} />
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label" htmlFor="responsavelId">Empregado Responsável *</label>
            <select className="form-input" id="responsavelId" name="responsavelId" value={departamento.responsavelId} onChange={handleChange} required>
              <option value="" disabled>Selecione um empregado...</option>
              {empregados.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.pessoa?.nome} {emp.pessoa?.sobrenome} - {emp.cargo?.nome}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-4 mt-4" style={{ justifyContent: 'flex-end' }}>
          {departamentoEditando && (
            <button type="button" className="btn btn-secondary" onClick={onCancelar}>
              Cancelar
            </button>
          )}
          <button type="submit" className="btn btn-primary">
            {departamentoEditando ? 'Salvar Alterações' : 'Adicionar Departamento'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DepartamentoForm;
