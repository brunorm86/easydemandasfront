// src/services/ChamadoService.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/Chamados';

export const getChamados = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getChamado = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const criarChamado = async (chamado) => {
  const response = await axios.post(API_URL, chamado);
  return response.data;
};

export const atualizarChamado = async (chamado) => {
  const response = await axios.put(`${API_URL}/${chamado.id}`, chamado);
  return response.data;
};

export const deletarChamado = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
