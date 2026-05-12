// src/components/EmpregadoList.jsx
import React from 'react';

const EmpregadoList = ({ empregados, onEditar, onDeletar }) => {
  return (
    <div className="card glass-container">
      <div className="page-header">
        <h2 className="page-title">Lista de Empregados</h2>
      </div>
      
      {empregados.length === 0 ? (
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
              {empregados.filter(e => e.id !== 9999).map((empregado) => (
                <tr key={empregado.id}>
                  <td>{empregado.pessoa?.nome} {empregado.pessoa?.sobrenome}</td>
                  <td>{empregado.cargo?.nome || 'N/A'}</td>
                  <td>{empregado.departamento?.nome || 'N/A'}</td>
                  <td>{empregado.dataContratacao}</td>
                  <td>{empregado.pessoa?.email}</td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        className="btn btn-secondary"
                        onClick={() => onEditar(empregado)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => onDeletar(empregado.id)}
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

export default EmpregadoList;
