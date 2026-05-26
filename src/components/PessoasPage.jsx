// src/components/PessoasPage.jsx
import React, { useState, useEffect } from 'react';
import { getPessoas, criarPessoa, atualizarPessoa, deletarPessoa } from '../services/PessoaService';
import PessoaForm from './PessoaForm';
import PessoaList from './PessoaList';
import { useNotification } from '../contexts/NotificationContext';

const PessoasPage = () => {
  const { showNotification } = useNotification();
  const [pessoas, setPessoas] = useState([]);
  const [pessoaEditando, setPessoaEditando] = useState(null);

  const carregarPessoas = async () => {
    try {
      const data = await getPessoas();
      setPessoas(data);
    } catch (error) {
      showNotification('Não foi possível carregar as pessoas.', 'error');
      console.error(error);
    }
  };

  useEffect(() => {
    carregarPessoas();
  }, []);

  const handleSalvar = async (pessoa) => {
    try {
      if (pessoaEditando) {
        await atualizarPessoa(pessoa);
        showNotification('Pessoa atualizada com sucesso!', 'success');
        setPessoaEditando(null);
      } else {
        await criarPessoa(pessoa);
        showNotification('Pessoa criada com sucesso!', 'success');
      }
      await carregarPessoas();
    } catch (error) {
      showNotification('Erro ao salvar a pessoa.', 'error');
      console.error(error);
    }
  };

  const handleEditar = (pessoa) => {
    setPessoaEditando(pessoa);
  };

  const handleCancelar = () => {
    setPessoaEditando(null);
  };

  const handleDeletar = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar esta pessoa?')) {
      try {
        await deletarPessoa(id);
        showNotification('Pessoa deletada com sucesso!', 'success');
        await carregarPessoas();
      } catch (error) {
        showNotification('Erro ao deletar a pessoa.', 'error');
        console.error(error);
      }
    }
  };

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Gerenciar Pessoas</h1>
      </div>
      
      <PessoaForm
        pessoaEditando={pessoaEditando}
        onSalvar={handleSalvar}
        onCancelar={handleCancelar}
      />
      <PessoaList
        pessoas={pessoas}
        onEditar={handleEditar}
        onDeletar={handleDeletar}
      />
    </>
  );
};

export default PessoasPage;
