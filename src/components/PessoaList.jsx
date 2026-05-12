// src/components/PessoaList.jsx
import React from 'react';

const PessoaList = ({ pessoas, onEditar, onDeletar }) => {
  return (
    <div className="card glass-container">
      <div className="page-header">
        <h2 className="page-title">Lista de Pessoas</h2>
      </div>
      
      {pessoas.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)' }}>Nenhuma pessoa cadastrada ainda.</p>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Sobrenome</th>
                <th>Email</th>
                <th>Telefone</th>
                <th>Endereço</th>
                <th>CPF</th>
                <th>Data Nasc.</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {pessoas.filter(p => p.id !== 9999).map((pessoa) => (
                <tr key={pessoa.id}>
                  <td>{pessoa.id}</td>
                  <td>{pessoa.nome}</td>
                  <td>{pessoa.sobrenome}</td>
                  <td>{pessoa.email || '-'}</td>
                  <td>{pessoa.telefone}</td>
                  <td>{pessoa.endereco}</td>
                  <td>{pessoa.cpf}</td>
                  <td>{pessoa.dataNascimento ? pessoa.dataNascimento.split('T')[0] : ''}</td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        className="btn btn-secondary"
                        onClick={() => onEditar(pessoa)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => onDeletar(pessoa.id)}
                      >
                        Deletar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PessoaList;