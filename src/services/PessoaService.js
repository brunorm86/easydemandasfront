// src/services/pessoaService.js
import axios from 'axios';

// ATENÇÃO: substitua a porta abaixo pela porta onde a SUA API está rodando.
// Verifique o terminal do dotnet run para confirmar.
const API_URL = 'http://localhost:8080/api/pessoas';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getPessoas = async () => {
    const response = await api.get('/');
    return response.data;
};

export const getPessoa = async (id) => {
    const response = await api.get(`/${id}`);
    return response.data;
};

export const criarPessoa = async (pessoa) => {
    const response = await api.post('/', pessoa);
    return response.data;
};

export const atualizarPessoa = async (pessoa) => {
    const response = await api.put('/', pessoa);
    return response.data;
};

export const deletarPessoa = async (id) => {
    const response = await api.delete(`/${id}`);
    return response.data;
};