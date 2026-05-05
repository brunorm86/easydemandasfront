// src/components/PessoasPage.jsx
import React, { useState, useEffect } from 'react';
import { getPessoas, criarPessoa, atualizarPessoa, deletarPessoa } from '../services/PessoaService';
import PessoaForm from './PessoaForm';
import PessoaList from './PessoaList';

const PessoasPage = () => {
  const [pessoas, setPessoas] = useState([]);
  const [pessoaEditando, setPessoaEditando] = useState(null);
  const [erro, setErro] = useState('');


  const carregarPessoas = async () => {
    try {
      const data = await getPessoas();
      setPessoas(data);
      setErro('');
    } catch (error) {
      setErro('Não foi possível carregar as pessoas.');
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
        setPessoaEditando(null);
      } else {
        await criarPessoa(pessoa);
      }
      await carregarPessoas();
      setErro('');
    } catch (error) {
      setErro('Erro ao salvar a pessoa.');
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
        await carregarPessoas();
        setErro('');
      } catch (error) {
        setErro('Erro ao deletar a pessoa.');
        console.error(error);
      }
    }
  };

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Gerenciar Pessoas</h1>
      </div>
      {erro && <div style={{backgroundColor: '#ef4444', color: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '1rem'}}>{erro}</div>}
      
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
