import axios from 'axios';

const API_URL = 'http://localhost:8080/api/Auth';

export const login = async (email, senha) => {
  const response = await axios.post(`${API_URL}/login`, { email, senha });
  return response.data; // Returns AuthResponseDto: { token, usuarioId, nome, email, perfil }
};
