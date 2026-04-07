// src/components/PessoaForm.jsx
import { useState, useEffect } from 'react';

function PessoaForm({ pessoaEditando, onSalvar, onCancelar }) {
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');

  // Quando receber um produto para editar, preenche o formulário
  useEffect(() => {
    if (pessoaEditando) {
      setNome(pessoaEditando.nome || '');
      setSobrenome(pessoaEditando.sobrenome || '');
      setEmail(pessoaEditando.email || '');
      setTelefone(pessoaEditando.telefone || '');
      setEndereco(pessoaEditando.endereco || '');
      setCpf(pessoaEditando.cpf || '');
      setDataNascimento(pessoaEditando.dataNascimento || '');
    } else {
      limparFormulario();
    }
  }, [pessoaEditando]);

  const limparFormulario = () => {
    setNome('');
    setSobrenome('');
    setEmail('');
    setTelefone('');
    setEndereco('');
    setCpf('');
    setDataNascimento('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const pessoa = {
      nome,
      sobrenome,
      email,
      telefone,
      endereco,
      cpf,
      dataNascimento,
    };

    // Se estiver editando, inclui o ID no objeto
    if (pessoaEditando) {
      pessoa.id = pessoaEditando.id;
    }

    onSalvar(pessoa);
    limparFormulario();
  };

  return (
    <div style={styles.container}>
      <h2>{pessoaEditando ? 'Editar Pessoa' : 'Nova Pessoa'}</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.campo}>
          <label htmlFor="nome">Nome:</label>
          <input
            id="nome"
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.campo}>
          <label htmlFor="sobrenome">Sobrenome:</label>
          <input
            id="sobrenome"
            type="text"
            value={sobrenome}
            onChange={(e) => setSobrenome(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.campo}>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.campo}>
          <label htmlFor="telefone">Telefone:</label>
          <input
            id="telefone"
            type="text"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.campo}>
          <label htmlFor="endereco">Endereço:</label>
          <input
            id="endereco"
            type="text"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.campo}>
          <label htmlFor="cpf">CPF:</label>
          <input
            id="cpf"
            type="text"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.campo}>
          <label htmlFor="dataNascimento">Data de Nascimento:</label>
          <input
            id="dataNascimento"
            type="text"
            value={dataNascimento}
            onChange={(e) => setDataNascimento(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.botoes}>
          <button type="submit" style={styles.btnSalvar}>
            {pessoaEditando ? 'Atualizar' : 'Cadastrar'}
          </button>
          {pessoaEditando && (
            <button type="button" onClick={onCancelar} style={styles.btnCancelar}>
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: '10px',
  },
  campo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  input: {
    padding: '8px 12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
  },
  botoes: {
    display: 'flex',
    gap: '10px',
    marginTop: '8px',
  },
  btnSalvar: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  btnCancelar: {
    padding: '10px 20px',
    backgroundColor: '#f44336',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
};

export default PessoaForm;