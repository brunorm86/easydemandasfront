// src/components/EmpregadosPage.jsx
import React, { useState, useEffect } from 'react';
import { getEmpregados, criarEmpregado, atualizarEmpregado, deletarEmpregado } from '../services/EmpregadoService';
import EmpregadoForm from './EmpregadoForm';
import EmpregadoList from './EmpregadoList';
import { useNotification } from '../contexts/NotificationContext';

const EmpregadosPage = () => {
  const { showNotification } = useNotification();
  const [empregados, setEmpregados] = useState([]);
  const [empregadoEditando, setEmpregadoEditando] = useState(null);


  const carregarEmpregados = async () => {
    try {
      const data = await getEmpregados();
      setEmpregados(data);
    } catch (error) {
      showNotification('Não foi possível carregar os empregados.', 'error');
      console.error(error);
    }
  };

  useEffect(() => {
    carregarEmpregados();
  }, []);

  const handleSalvar = async (empregado, fotoFile) => {
    try {
      if (empregadoEditando) {
        await atualizarEmpregado(empregado);
        if (fotoFile) {
          const { uploadFoto } = await import('../services/EmpregadoService');
          await uploadFoto(empregado.id, fotoFile);
        }
        showNotification('Empregado atualizado com sucesso!', 'success');
        setEmpregadoEditando(null);
      } else {
        const novoEmpregado = await criarEmpregado(empregado);
        if (fotoFile) {
          const { uploadFoto } = await import('../services/EmpregadoService');
          await uploadFoto(novoEmpregado.id, fotoFile);
        }
        showNotification('Empregado criado com sucesso!', 'success');
      }
      await carregarEmpregados();
    } catch (error) {
      showNotification('Erro ao salvar o empregado (tamanho da foto ou erro de rede).', 'error');
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
        showNotification('Empregado deletado com sucesso!', 'success');
        await carregarEmpregados();
      } catch (error) {
        showNotification('Erro ao deletar o empregado.', 'error');
        console.error(error);
      }
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title text-gradient">Gerenciar Empregados</h1>
      </div>
      
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
