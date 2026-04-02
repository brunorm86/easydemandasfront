// src/App.jsx
import { useState, useEffect } from 'react';
import {
  getPessoas,
  criarPessoa,
  atualizarPessoa,
  deletarPessoa,
} from './services/PessoaService';
import PessoaForm from './components/PessoaForm';
import PessoaList from './components/PessoaList';

function App() {
  const [pessoas, setPessoas] = useState([]);
  const [pessoaEditando, setPessoaEditando] = useState(null);
  const [erro, setErro] = useState('');

  // Carrega a lista de pessoas ao montar o componente
  useEffect(() => {
    carregarPessoas();
  }, []);

  const carregarPessoas = async () => {
    try {
      const data = await getPessoas();
      setPessoas(data);
      setErro('');
    } catch (error) {
      setErro(
        'Não foi possível carregar as pessoas. Verifique se a API está rodando.'
      );
      console.error('Erro ao carregar pessoas:', error);
    }
  };

  const handleSalvar = async (pessoa) => {
    try {
      if (pessoaEditando) {
        // Atualizar pessoa existente
        await atualizarPessoa(pessoa);
        setPessoaEditando(null);
      } else {
        // Criar nova pessoa
        await criarPessoa(pessoa);
      }
      // Recarrega a lista após salvar
      await carregarPessoas();
      setErro('');
    } catch (error) {
      setErro('Erro ao salvar a pessoa. Verifique os dados e tente novamente.');
      console.error('Erro ao salvar:', error);
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
        // Recarrega a lista após deletar
        await carregarPessoas();
        setErro('');
      } catch (error) {
        setErro('Erro ao deletar a pessoa.');
        console.error('Erro ao deletar:', error);
      }
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.titulo}>CRUD de Pessoas</h1>

      {erro && <div style={styles.erro}>{erro}</div>}

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
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '20px',
  },
  titulo: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '20px',
  },
  erro: {
    backgroundColor: '#ffebee',
    color: '#c62828',
    padding: '12px',
    borderRadius: '4px',
    marginBottom: '16px',
    textAlign: 'center',
  },
};

export default App;