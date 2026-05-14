// src/components/EmpregadosPage.jsx
import React, { useState, useEffect } from 'react';
import { getEmpregados, criarEmpregado, atualizarEmpregado, deletarEmpregado } from '../services/EmpregadoService';
import EmpregadoForm from './EmpregadoForm';
import EmpregadoList from './EmpregadoList';

const EmpregadosPage = () => {
  const [empregados, setEmpregados] = useState([]);
  const [empregadoEditando, setEmpregadoEditando] = useState(null);
  const [erro, setErro] = useState('');


  const carregarEmpregados = async () => {
    try {
      const data = await getEmpregados();
      setEmpregados(data);
      setErro('');
    } catch (error) {
      setErro('Não foi possível carregar os empregados.');
      console.error(error);
    }
  };

  useEffect(() => {
    carregarEmpregados();
  }, []);

  const handleSalvar = async (empregado) => {
    try {
      if (empregadoEditando) {
        await atualizarEmpregado(empregado);
        setEmpregadoEditando(null);
      } else {
        await criarEmpregado(empregado);
      }
      await carregarEmpregados();
      setErro('');
    } catch (error) {
      setErro('Erro ao salvar o empregado.');
      console.error(error);
    }
  };

  const handleEditar = (empregado) => {
    setEmpregadoEditando(empregado);
  };

  const handleCancelar = () => {
    setEmpregadoEditando(null);
  };

  const handleDeletar = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar este empregado?')) {
      try {
        await deletarEmpregado(id);
        await carregarEmpregados();
        setErro('');
      } catch (error) {
        setErro('Erro ao deletar o empregado.');
        console.error(error);
      }
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title text-gradient">Gerenciar Empregados</h1>
      </div>
      {erro && <div className="error-message" style={{ color: 'var(--danger-color)', marginBottom: '10px' }}>{erro}</div>}
      
      <EmpregadoForm
        empregadoEditando={empregadoEditando}
        onSalvar={handleSalvar}
        onCancelar={handleCancelar}
      />
      <EmpregadoList
        empregados={empregados}
        onEditar={handleEditar}
        onDeletar={handleDeletar}
      />
    </div>
  );
};

export default EmpregadosPage;
