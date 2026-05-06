// src/components/PessoaForm.jsx
import React, { useState, useEffect } from 'react';

const PessoaForm = ({ pessoaEditando, onSalvar, onCancelar }) => {
  const [pessoa, setPessoa] = useState({
    nome: '',
    sobrenome: '',
    email: '',
    telefone: '',
    endereco: '',
    cpf: '',
    dataNascimento: ''
  });

  // Quando receber um produto para editar, preenche o formulário
  useEffect(() => {
    if (pessoaEditando) {
      setPessoa({
        nome: pessoaEditando.nome || '',
        sobrenome: pessoaEditando.sobrenome || '',
        email: pessoaEditando.email || '',
        telefone: pessoaEditando.telefone || '',
        endereco: pessoaEditando.endereco || '',
        cpf: pessoaEditando.cpf || '',
        dataNascimento: pessoaEditando.dataNascimento ? pessoaEditando.dataNascimento.split('T')[0] : ''
      });
    } else {
      setPessoa({
        nome: '',
        sobrenome: '',
        email: '',
        telefone: '',
        endereco: '',
        cpf: '',
        dataNascimento: ''
      });
    }
  }, [pessoaEditando]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPessoa({ ...pessoa, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...pessoa };
    if (pessoaEditando) {
      payload.id = pessoaEditando.id;
    }
    onSalvar(payload);
    setPessoa({
      nome: '',
      sobrenome: '',
      email: '',
      telefone: '',
      endereco: '',
      cpf: '',
      dataNascimento: ''
    });
  };

  return (
    <div className="card glass-container">
      <h2 className="mb-4">
        {pessoaEditando ? 'Editar Pessoa' : 'Adicionar Nova Pessoa'}
      </h2>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="nome">Nome *</label>
            <input className="form-input" type="text" id="nome" name="nome" value={pessoa.nome} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="sobrenome">Sobrenome *</label>
            <input className="form-input" type="text" id="sobrenome" name="sobrenome" value={pessoa.sobrenome} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input className="form-input" type="email" id="email" name="email" value={pessoa.email} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="telefone">Telefone *</label>
            <input className="form-input" type="text" id="telefone" name="telefone" value={pessoa.telefone} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="endereco">Endereço *</label>
            <input className="form-input" type="text" id="endereco" name="endereco" value={pessoa.endereco} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="cpf">CPF *</label>
            <input className="form-input" type="text" id="cpf" name="cpf" value={pessoa.cpf} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="dataNascimento">Data de Nascimento *</label>
            <input className="form-input" type="date" id="dataNascimento" name="dataNascimento" value={pessoa.dataNascimento} onChange={handleChange} required />
          </div>
        </div>

        <div className="flex gap-4 mt-4" style={{ justifyContent: 'flex-end' }}>
          {pessoaEditando && (
            <button type="button" className="btn btn-secondary" onClick={onCancelar}>
              Cancelar
            </button>
          )}
          <button type="submit" className="btn btn-primary">
            {pessoaEditando ? 'Salvar Alterações' : 'Adicionar Pessoa'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PessoaForm;