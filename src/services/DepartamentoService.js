// src/services/DepartamentoService.js
import axios from 'axios';

// Assuming standard ASP.NET Core API URL
const API_URL = 'http://localhost:8080/api/Departamentos';

export const getDepartamentos = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getDepartamento = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const criarDepartamento = async (departamento) => {
  const response = await axios.post(API_URL, departamento);
  return response.data;
};

export const atualizarDepartamento = async (departamento) => {
  const response = await axios.put(`${API_URL}/${departamento.id}`, departamento);
  return response.data;
};

export const deletarDepartamento = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
