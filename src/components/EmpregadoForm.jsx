// src/components/EmpregadoForm.jsx
import React, { useState, useEffect } from 'react';

const EmpregadoForm = ({ empregadoEditando, onSalvar, onCancelar }) => {
  const [empregado, setEmpregado] = useState({
    nome: '',
    sobrenome: '',
    email: '',
    telefone: '',
    endereco: '',
    cpf: '',
    dataNascimento: '',
    cargo: '',
    dataContratacao: ''
  });

  useEffect(() => {
    if (empregadoEditando) {
      setEmpregado(empregadoEditando);
    } else {
      setEmpregado({
        nome: '',
        sobrenome: '',
        email: '',
        telefone: '',
        endereco: '',
        cpf: '',
        dataNascimento: '',
        cargo: '',
        dataContratacao: ''
      });
    }
  }, [empregadoEditando]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmpregado({ ...empregado, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSalvar(empregado);
  };

  return (
    <div className="card glass-container">
      <h2 className="mb-4">
        {empregadoEditando ? 'Editar Empregado' : 'Adicionar Novo Empregado'}
      </h2>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="nome">Nome *</label>
            <input className="form-input" type="text" id="nome" name="nome" value={empregado.nome} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="sobrenome">Sobrenome *</label>
            <input className="form-input" type="text" id="sobrenome" name="sobrenome" value={empregado.sobrenome} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="email">E-mail *</label>
            <input className="form-input" type="email" id="email" name="email" value={empregado.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="telefone">Telefone *</label>
            <input className="form-input" type="text" id="telefone" name="telefone" value={empregado.telefone} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="endereco">Endereço *</label>
            <input className="form-input" type="text" id="endereco" name="endereco" value={empregado.endereco} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="cpf">CPF *</label>
            <input className="form-input" type="text" id="cpf" name="cpf" value={empregado.cpf} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="dataNascimento">Data Nascimento *</label>
            <input className="form-input" type="date" id="dataNascimento" name="dataNascimento" value={empregado.dataNascimento} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="cargo">Cargo *</label>
            <input className="form-input" type="text" id="cargo" name="cargo" value={empregado.cargo} onChange={handleChange} required />
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
