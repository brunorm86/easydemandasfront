// src/components/EmpregadoForm.jsx
import React, { useState, useEffect } from 'react';
import { getCargos } from '../services/CargoService';
import { getDepartamentos } from '../services/DepartamentoService';

const EMPREGADO_VAZIO = {
  nome: '',
  sobrenome: '',
  email: '',
  telefone: '',
  endereco: '',
  cpf: '',
  dataNascimento: '',
  cargoId: '',
  departamentoId: '',
  dataContratacao: ''
};

const EmpregadoForm = ({ empregadoEditando, onSalvar, onCancelar }) => {
  const [empregado, setEmpregado] = useState(EMPREGADO_VAZIO);
  const [cargos, setCargos] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);

  useEffect(() => {
    if (empregadoEditando) {
      setEmpregado({
        ...empregadoEditando,
        cargoId: empregadoEditando.cargoId || '',
        departamentoId: empregadoEditando.departamentoId || '',
        dataNascimento: empregadoEditando.dataNascimento || '',
        dataContratacao: empregadoEditando.dataContratacao || ''
      });
    } else {
      setEmpregado(EMPREGADO_VAZIO);
    }
  }, [empregadoEditando]);

  useEffect(() => {
    const carregarDependencias = async () => {
      try {
        const [cargosData, depsData] = await Promise.all([
          getCargos(),
          getDepartamentos()
        ]);
        setCargos(cargosData);
        setDepartamentos(depsData);
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
        {/* Seção: Dados Pessoais */}
        <p style={{ color: 'var(--primary-color)', fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Dados Pessoais
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="nome">Nome *</label>
            <input className="form-input" type="text" id="nome" name="nome" value={empregado.nome} onChange={handleChange} required placeholder="Ex: João" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="sobrenome">Sobrenome *</label>
            <input className="form-input" type="text" id="sobrenome" name="sobrenome" value={empregado.sobrenome} onChange={handleChange} required placeholder="Ex: Silva" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="email">E-mail *</label>
            <input className="form-input" type="email" id="email" name="email" value={empregado.email} onChange={handleChange} required placeholder="exemplo@empresa.com" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="telefone">Telefone *</label>
            <input className="form-input" type="text" id="telefone" name="telefone" value={empregado.telefone} onChange={handleChange} required placeholder="(00) 90000-0000" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="cpf">CPF *</label>
            <input className="form-input" type="text" id="cpf" name="cpf" value={empregado.cpf} onChange={handleChange} required placeholder="000.000.000-00" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="dataNascimento">Data de Nascimento *</label>
            <input className="form-input" type="date" id="dataNascimento" name="dataNascimento" value={empregado.dataNascimento} onChange={handleChange} required />
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label" htmlFor="endereco">Endereço *</label>
            <input className="form-input" type="text" id="endereco" name="endereco" value={empregado.endereco} onChange={handleChange} required placeholder="Rua, número, bairro, cidade" />
          </div>
        </div>

        {/* Seção: Vínculo Empregatício */}
        <p style={{ color: 'var(--primary-color)', fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Vínculo Empregatício
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="cargoId">Cargo *</label>
            <select className="form-input" id="cargoId" name="cargoId" value={empregado.cargoId} onChange={handleChange} required>
              <option value="">Selecione um cargo</option>
              {cargos.filter(c => c.id !== 9999).map((c) => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="dataContratacao">Data de Contratação *</label>
            <input className="form-input" type="date" id="dataContratacao" name="dataContratacao" value={empregado.dataContratacao} onChange={handleChange} required />
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label" htmlFor="departamentoId">Departamento</label>
            <select className="form-input" id="departamentoId" name="departamentoId" value={empregado.departamentoId || ''} onChange={handleChange}>
              <option value="">Nenhum departamento</option>
              {departamentos.filter(d => d.id !== 9999).map((d) => (
                <option key={d.id} value={d.id}>{d.nome}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Seção: Acesso ao Sistema */}
        <p style={{ color: 'var(--primary-color)', fontWeight: 600, marginBottom: '0.75rem', marginTop: '1.5rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Acesso ao Sistema
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="senhaHash">Senha de Acesso {empregadoEditando ? '(Deixe em branco para manter)' : '*'}</label>
            <input className="form-input" type="password" id="senhaHash" name="senhaHash" value={empregado.senhaHash || ''} onChange={handleChange} required={!empregadoEditando} placeholder="Digite a senha" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="perfil">Nível de Acesso *</label>
            <select className="form-input" id="perfil" name="perfil" value={empregado.perfil} onChange={handleChange} required>
              <option value="Comum">Comum</option>
              <option value="Suporte">Suporte</option>
              <option value="RH">RH</option>
              <option value="Gestor">Gestor</option>
            </select>
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
