// src/components/DepartamentosPage.jsx
import React, { useState, useEffect } from 'react';
import { getDepartamentos, criarDepartamento, atualizarDepartamento, deletarDepartamento } from '../services/DepartamentoService';
import DepartamentoForm from './DepartamentoForm';
import DepartamentoList from './DepartamentoList';

const DepartamentosPage = () => {
  const [departamentos, setDepartamentos] = useState([]);
  const [departamentoEditando, setDepartamentoEditando] = useState(null);
  const [erro, setErro] = useState('');


  const carregarDepartamentos = async () => {
    try {
      const data = await getDepartamentos();
      setDepartamentos(data);
      setErro('');
    } catch (error) {
      setErro('Não foi possível carregar os departamentos.');
      console.error(error);
    }
  };

  useEffect(() => {
    carregarDepartamentos();
  }, []);

  const handleSalvar = async (departamento) => {
    try {
      if (departamentoEditando) {
        await atualizarDepartamento(departamento);
        setDepartamentoEditando(null);
      } else {
        await criarDepartamento(departamento);
      }
      await carregarDepartamentos();
      setErro('');
    } catch (error) {
      setErro('Erro ao salvar o departamento.');
      console.error(error);
    }
  };

  const handleEditar = (departamento) => {
    setDepartamentoEditando(departamento);
  };

  const handleCancelar = () => {
    setDepartamentoEditando(null);
  };

  const handleDeletar = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar este departamento?')) {
      try {
        await deletarDepartamento(id);
        await carregarDepartamentos();
        setErro('');
      } catch (error) {
        setErro('Erro ao deletar o departamento.');
        console.error(error);
      }
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title text-gradient">Gerenciar Departamentos</h1>
      </div>
      {erro && <div className="error-message" style={{ color: 'var(--danger-color)', marginBottom: '10px' }}>{erro}</div>}
      
      <DepartamentoForm
        departamentoEditando={departamentoEditando}
        onSalvar={handleSalvar}
        onCancelar={handleCancelar}
      />
      <DepartamentoList
        departamentos={departamentos}
        onEditar={handleEditar}
        onDeletar={handleDeletar}
      />
    </div>
  );
};

export default DepartamentosPage;
