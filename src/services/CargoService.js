import axios from 'axios';

const API_URL = 'http://localhost:8080/api/Cargos';

export const getCargos = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getCargo = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createCargo = async (cargo) => {
  const response = await axios.post(API_URL, cargo);
  return response.data;
};

export const updateCargo = async (id, cargo) => {
  await axios.put(`${API_URL}/${id}`, cargo);
};

export const deleteCargo = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};
