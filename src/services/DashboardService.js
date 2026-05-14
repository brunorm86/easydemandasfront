// src/services/DashboardService.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/Dashboard';

export const getDashboardChamados = async () => {
  const response = await axios.get(`${API_URL}/chamados`);
  return response.data;
};
