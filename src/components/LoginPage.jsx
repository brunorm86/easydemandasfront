import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';

const LoginPage = () => {
  const { showNotification } = useNotification();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !senha) {
      showNotification('Por favor, preencha todos os campos.', 'error');
      return;
    }

    setLoading(true);

    const result = await loginUser(email, senha);
    if (result.success) {
      navigate('/dashboard');
    } else {
      showNotification(result.error, 'error');
      setLoading(false);
    }
  };

  // Helper function to login with a specific seeded user (great for development and demonstration)
  const handleQuickLogin = async (selectedEmail) => {
    setLoading(true);
    setEmail(selectedEmail);
    setSenha('123456');

    const result = await loginUser(selectedEmail, '123456');
    if (result.success) {
      navigate('/dashboard');
    } else {
      showNotification(result.error, 'error');
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={glassCardStyle}>
        <div style={headerStyle}>
          <div style={logoBadgeStyle}>ED</div>
          <h1 style={titleStyle}>EasyDemandas</h1>
          <p style={subtitleStyle}>Gerenciamento inteligente de chamados e recursos</p>
        </div>

        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>E-mail corporativo</label>
            <input
              type="email"
              placeholder="exemplo@easydemandas.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Senha</label>
            <input
              type="password"
              placeholder="Sua senha de acesso"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          <button type="submit" disabled={loading} style={buttonStyle}>
            {loading ? 'Autenticando...' : 'Acessar Plataforma'}
          </button>
        </form>

        <div style={dividerStyle}>
          <span style={dividerTextStyle}>Acesso rápido para testes</span>
        </div>

        <div className="quick-login-grid">
          <button 
            type="button" 
            onClick={() => handleQuickLogin('ana.santos@easydemandas.com')}
            className="quick-login-btn gestor"
          >
            <span className="quick-login-role">👑 Gestor</span>
            <span className="quick-login-name">Ana Santos</span>
            <span className="quick-login-email">ana.santos@easydemandas.com</span>
          </button>
          <button 
            type="button" 
            onClick={() => handleQuickLogin('bruno.oliveira@easydemandas.com')}
            className="quick-login-btn rh"
          >
            <span className="quick-login-role">👥 RH</span>
            <span className="quick-login-name">Bruno Oliveira</span>
            <span className="quick-login-email">bruno.oliveira@easydemandas.com</span>
          </button>
          <button 
            type="button" 
            onClick={() => handleQuickLogin('carla.pereira@easydemandas.com')}
            className="quick-login-btn suporte"
          >
            <span className="quick-login-role">🛠️ Suporte</span>
            <span className="quick-login-name">Carla Pereira</span>
            <span className="quick-login-email">carla.pereira@easydemandas.com</span>
          </button>
          <button 
            type="button" 
            onClick={() => handleQuickLogin('daniel.costa@easydemandas.com')}
            className="quick-login-btn comum"
          >
            <span className="quick-login-role">👤 Comum</span>
            <span className="quick-login-name">Daniel Costa</span>
            <span className="quick-login-email">daniel.costa@easydemandas.com</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Styles for a sleek glassmorphism and modern UI feel
const containerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #311042 100%)',
  fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
  padding: '20px',
  boxSizing: 'border-box'
};

const glassCardStyle = {
  background: 'rgba(255, 255, 255, 0.03)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '24px',
  padding: '48px 40px',
  width: '100%',
  maxWidth: '480px',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
  boxSizing: 'border-box'
};

const headerStyle = {
  textAlign: 'center',
  marginBottom: '32px'
};

const logoBadgeStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '56px',
  height: '56px',
  borderRadius: '16px',
  background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
  color: '#ffffff',
  fontSize: '20px',
  fontWeight: '800',
  marginBottom: '16px',
  boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)'
};

const titleStyle = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: '800',
  margin: '0 0 8px 0',
  letterSpacing: '-0.025em'
};

const subtitleStyle = {
  color: '#94a3b8',
  fontSize: '14px',
  margin: 0,
  lineHeight: '1.5'
};

const errorStyle = {
  background: 'rgba(239, 68, 68, 0.1)',
  border: '1px solid rgba(239, 68, 68, 0.2)',
  color: '#f87171',
  padding: '12px 16px',
  borderRadius: '12px',
  fontSize: '14px',
  marginBottom: '24px',
  textAlign: 'center'
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px'
};

const inputGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
};

const labelStyle = {
  color: '#cbd5e1',
  fontSize: '13px',
  fontWeight: '600',
  letterSpacing: '0.05em',
  textTransform: 'uppercase'
};

const inputStyle = {
  background: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '12px',
  padding: '14px 16px',
  fontSize: '15px',
  color: '#ffffff',
  outline: 'none',
  transition: 'all 0.2s ease',
  boxSizing: 'border-box'
};

const buttonStyle = {
  background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
  color: '#ffffff',
  border: 'none',
  borderRadius: '12px',
  padding: '14px',
  fontSize: '16px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'transform 0.1s ease, box-shadow 0.2s ease',
  marginTop: '8px',
  boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.2)'
};

const dividerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '28px 0 20px 0',
  width: '100%'
};

const dividerTextStyle = {
  color: '#64748b',
  fontSize: '12px',
  fontWeight: '600',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  background: '#16122d',
  padding: '0 12px'
};

export default LoginPage;
