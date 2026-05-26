// src/components/DepartamentosPage.jsx
import React, { useState, useEffect } from 'react';
import { getDepartamentos, criarDepartamento, atualizarDepartamento, deletarDepartamento } from '../services/DepartamentoService';
import DepartamentoForm from './DepartamentoForm';
import DepartamentoList from './DepartamentoList';
import { useNotification } from '../contexts/NotificationContext';

const DepartamentosPage = () => {
  const { showNotification } = useNotification();
  const [departamentos, setDepartamentos] = useState([]);
  const [departamentoEditando, setDepartamentoEditando] = useState(null);
  const [erro, setErro] = useState('');


  const carregarDepartamentos = async () => {
    try {
      const data = await getDepartamentos();
      setDepartamentos(data);
    } catch (error) {
      showNotification('Não foi possível carregar os departamentos.', 'error');
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
        showNotification('Departamento atualizado com sucesso!', 'success');
        setDepartamentoEditando(null);
      } else {
        await criarDepartamento(departamento);
        showNotification('Departamento criado com sucesso!', 'success');
      }
      await carregarDepartamentos();
    } catch (error) {
      showNotification('Erro ao salvar o departamento.', 'error');
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
        showNotification('Departamento deletado com sucesso!', 'success');
        await carregarDepartamentos();
      } catch (error) {
        showNotification('Erro ao deletar o departamento.', 'error');
        console.error(error);
      }
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title text-gradient">Gerenciar Departamentos</h1>
      </div>
      
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
