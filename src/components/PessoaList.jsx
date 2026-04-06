// src/components/PessoaList.jsx

function PessoaList({ pessoas, onEditar, onDeletar }) {
    if (pessoas.length === 0) {
        return (
            <p style={{ textAlign: 'center', color: '#888' }}>
                Nenhuma pessoa cadastrada.
            </p>
        );
    }

    return (
        <div style={styles.container}>
            <h2>Pessoas Cadastradas</h2>
            <table style={styles.tabela}>
                <thead>
                    <tr>
                        <th style={styles.th}>ID</th>
                        <th style={styles.th}>Nome</th>
                        <th style={styles.th}>Sobrenome</th>
                        <th style={styles.th}>Email</th>
                        <th style={styles.th}>Telefone</th>
                        <th style={styles.th}>Endereço</th>
                        <th style={styles.th}>CPF</th>
                        <th style={styles.th}>Data de Nascimento</th>
                        <th style={styles.th}>Número de Dependentes</th>
                        <th style={styles.th}>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {pessoas.map((pessoa) => (
                        <tr key={pessoa.id}>
                            <td style={styles.td}>{pessoa.id}</td>
                            <td style={styles.td}>{pessoa.nome}</td>
                            <td style={styles.td}>{pessoa.sobreNome}</td>
                            <td style={styles.td}>{pessoa.email || '-'}</td>
                            <td style={styles.td}>{pessoa.telefone}</td>
                            <td style={styles.td}>{pessoa.endereco}</td>
                            <td style={styles.td}>{pessoa.cpf}</td>
                            <td style={styles.td}>{pessoa.dataNascimento}</td>
                            <td style={styles.td}>{pessoa.numDependentes}</td>
                            <td style={styles.td}>
                                <button
                                    onClick={() => onEditar(pessoa)}
                                    style={styles.btnEditar}
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => onDeletar(pessoa.id)}
                                    style={styles.btnDeletar}
                                >
                                    Deletar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

const styles = {
    container: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    tabela: {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '10px',
    },
    th: {
        backgroundColor: '#f8f9fa',
        padding: '12px 8px',
        textAlign: 'left',
        borderBottom: '2px solid #dee2e6',
        fontSize: '14px',
    },
    td: {
        padding: '10px 8px',
        borderBottom: '1px solid #dee2e6',
        fontSize: '14px',
    },
    btnEditar: {
        padding: '6px 12px',
        backgroundColor: '#2196F3',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        marginRight: '6px',
        fontSize: '13px',
    },
    btnDeletar: {
        padding: '6px 12px',
        backgroundColor: '#f44336',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '13px',
    },
};

export default PessoaList;