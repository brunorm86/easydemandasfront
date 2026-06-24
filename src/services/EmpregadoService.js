// src/services/EmpregadoService.js
import axios from 'axios';

// Assuming standard ASP.NET Core API URL
const API_URL = 'http://localhost:8080/api/Empregados';

export const getEmpregados = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getEmpregado = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const criarEmpregado = async (empregado) => {
  const response = await axios.post(API_URL, empregado);
  return response.data;
};

export const atualizarEmpregado = async (empregado) => {
  const response = await axios.put(`${API_URL}/${empregado.id}`, empregado);
  return response.data;
};

export const deletarEmpregado = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

export const uploadFoto = async (id, file) => {
  const formData = new FormData();
  formData.append('foto', file);
  const response = await axios.post(`${API_URL}/${id}/foto`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const fetchFotoUrl = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}/foto`, { responseType: 'blob' });
    return URL.createObjectURL(response.data);
  } catch (error) {
    if (error.response && error.response.status === 404) return null;
    throw error;
  }
};
