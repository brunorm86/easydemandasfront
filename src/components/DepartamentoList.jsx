// src/components/DepartamentoList.jsx
import React from 'react';

const DepartamentoList = ({ departamentos, onEditar, onDeletar }) => {
  return (
    <div className="card glass-container">
      <div className="page-header">
        <h2 className="page-title">Lista de Departamentos</h2>
      </div>
      
      {departamentos.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)' }}>Nenhum departamento cadastrado ainda.</p>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Sigla</th>
                <th>Responsável</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {departamentos.map((dept) => (
                <tr key={dept.id}>
                  <td>{dept.nome}</td>
                  <td>{dept.sigla || '-'}</td>
                  <td>{dept.responsavel ? `${dept.responsavel.nome} ${dept.responsavel.sobrenome}` : 'Sem responsável'}</td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        className="btn btn-secondary"
                        onClick={() => onEditar(dept)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => onDeletar(dept.id)}
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

export default DepartamentoList;
