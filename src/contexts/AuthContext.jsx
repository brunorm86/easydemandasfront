import React, { createContext, useState, useEffect, useContext } from 'react';
import { login as apiLogin } from '../services/AuthService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restaurar sessão
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const loginUser = async (email, senha) => {
    try {
      const data = await apiLogin(email, senha);
      setToken(data.token);
      setUser({
        id: data.usuarioId,
        nome: data.nome,
        email: data.email,
        perfil: data.perfil
      });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        id: data.usuarioId,
        nome: data.nome,
        email: data.email,
        perfil: data.perfil
      }));
      return { success: true };
    } catch (error) {
      console.error('Erro no login:', error);
      const message = error.response?.data || 'Erro ao efetuar login. Verifique suas credenciais.';
      return { success: false, error: message };
    }
  };

  const logoutUser = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const hasRole = (roles) => {
    if (!user) return false;
    if (typeof roles === 'string') {
      return user.perfil === roles;
    }
    return roles.includes(user.perfil);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, loginUser, logoutUser, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
