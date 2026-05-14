// src/components/EmpregadoList.jsx
import React, { useState } from 'react';

const EmpregadoList = ({ empregados, onEditar, onDeletar }) => {
  const [sortField, setSortField] = useState(null); // 'nome' | 'data'
  const [sortDir,   setSortDir]   = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const sorted = [...empregados].filter(e => e.id !== 9999).sort((a, b) => {
    if (!sortField) return 0;
    const va = sortField === 'nome' ? `${a.nome} ${a.sobrenome}` : a.dataContratacao;
    const vb = sortField === 'nome' ? `${b.nome} ${b.sobrenome}` : b.dataContratacao;
    return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
  });

  const icon = (field) => sortField === field ? (sortDir === 'asc' ? ' ▲' : ' ▼') : ' ⇅';

  return (
    <div className="card glass-container">
      <div className="page-header">
        <h2 className="page-title">Lista de Empregados</h2>
        <div className="flex gap-2">
          <button
            className={`btn ${sortField === 'nome' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => handleSort('nome')}
            title="Ordenar por nome"
          >
            A→Z{icon('nome')}
          </button>
          <button
            className={`btn ${sortField === 'data' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => handleSort('data')}
            title="Ordenar por data de contratação"
          >
            📅{icon('data')}
          </button>
        </div>
      </div>

      {sorted.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)' }}>Nenhum empregado cadastrado ainda.</p>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Cargo</th>
                <th>Departamento</th>
                <th>Data Contratação</th>
                <th>E-mail</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((empregado) => (
                <tr key={empregado.id}>
                  <td>{empregado.nome} {empregado.sobrenome}</td>
                  <td>{empregado.cargo?.nome || 'N/A'}</td>
                  <td>{empregado.departamento?.nome || 'N/A'}</td>
                  <td>{empregado.dataContratacao}</td>
                  <td>{empregado.email}</td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn btn-secondary" onClick={() => onEditar(empregado)}>Editar</button>
                      <button className="btn btn-danger"    onClick={() => onDeletar(empregado.id)}>Deletar</button>
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

export default EmpregadoList;
