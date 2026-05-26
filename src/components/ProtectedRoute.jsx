import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading, hasRole } = useAuth();

  if (loading) {
    return (
      <div style={loadingContainerStyle}>
        <div style={spinnerStyle}></div>
        <p>Carregando permissões...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !hasRole(allowedRoles)) {
    return (
      <div style={accessDeniedContainerStyle}>
        <div style={cardStyle}>
          <span style={iconStyle}>🚫</span>
          <h2 style={titleStyle}>Acesso Restrito</h2>
          <p style={textStyle}>
            Seu perfil de <strong>{user.perfil}</strong> não possui autorização para acessar esta página.
          </p>
          <Navigate to="/dashboard" replace />
        </div>
      </div>
    );
  }

  return children;
};

// Simple inline styling to ensure we don't depend on external CSS classes before index.css is updated.
const loadingContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  fontFamily: 'Inter, sans-serif',
  color: '#64748b'
};

const spinnerStyle = {
  width: '40px',
  height: '40px',
  border: '4px solid #f1f5f9',
  borderTop: '4px solid #6366f1',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite',
  marginBottom: '16px'
};

const accessDeniedContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '80vh',
  fontFamily: 'Inter, sans-serif'
};

const cardStyle = {
  background: '#ffffff',
  padding: '40px',
  borderRadius: '16px',
  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  textAlign: 'center',
  maxWidth: '400px',
  width: '100%',
  border: '1px solid #e2e8f0'
};

const iconStyle = {
  fontSize: '48px',
  display: 'block',
  marginBottom: '16px'
};

const titleStyle = {
  color: '#1e293b',
  fontSize: '24px',
  fontWeight: '700',
  marginBottom: '12px'
};

const textStyle = {
  color: '#64748b',
  lineHeight: '1.6',
  fontSize: '15px'
};

export default ProtectedRoute;
