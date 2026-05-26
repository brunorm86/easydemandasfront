// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './components/LoginPage';
import EmpregadosPage from './components/EmpregadosPage';
import DepartamentosPage from './components/DepartamentosPage';
import CargosPage from './components/CargosPage';
import ChamadosPage from './components/ChamadosPage';
import DashboardPage from './components/DashboardPage';
import SuporteChamadosPage from './components/SuporteChamadosPage';

function Navigation() {
  const { user, logoutUser, hasRole } = useAuth();

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="navbar-brand">EasyDemandas</div>
      <div className="navbar-links">
        {hasRole(['RH', 'Gestor']) && (
          <NavLink to="/empregados" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Empregados</NavLink>
        )}
        {hasRole('Gestor') && (
          <>
            <NavLink to="/departamentos" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Departamentos</NavLink>
            <NavLink to="/cargos" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Cargos</NavLink>
          </>
        )}
        <NavLink to="/chamados" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Chamados</NavLink>
        {hasRole(['Suporte', 'Gestor']) && (
          <NavLink to="/suporte-chamados" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Filtro Suporte</NavLink>
        )}
        <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'nav-link active nav-link-dashboard' : 'nav-link nav-link-dashboard')}>📊 Dashboard</NavLink>
      </div>
      <div className="navbar-user" style={{ display: 'flex', alignItems: 'center', gap: '15px', marginLeft: 'auto' }}>
        <span style={{ color: '#cbd5e1', fontSize: '14px' }}>
          <strong>{user.nome}</strong> ({user.perfil})
        </span>
        <button onClick={logoutUser} className="logout-btn" style={logoutBtnStyle}>
          Sair 🚪
        </button>
      </div>
    </nav>
  );
}

function MainRoutes() {
  const { user } = useAuth();
  return (
    <main className="main-content">
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
        
        <Route path="/empregados" element={
          <ProtectedRoute allowedRoles={['RH', 'Gestor']}>
            <EmpregadosPage />
          </ProtectedRoute>
        } />
        
        <Route path="/departamentos" element={
          <ProtectedRoute allowedRoles={['Gestor']}>
            <DepartamentosPage />
          </ProtectedRoute>
        } />
        
        <Route path="/cargos" element={
          <ProtectedRoute allowedRoles={['Gestor']}>
            <CargosPage />
          </ProtectedRoute>
        } />
        
        <Route path="/chamados" element={
          <ProtectedRoute>
            <ChamadosPage />
          </ProtectedRoute>
        } />
        
        <Route path="/suporte-chamados" element={
          <ProtectedRoute allowedRoles={['Suporte', 'Gestor']}>
            <SuporteChamadosPage />
          </ProtectedRoute>
        } />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </main>
  );
}

function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <Router>
          <Navigation />
          <MainRoutes />
        </Router>
      </AuthProvider>
    </NotificationProvider>
  );
}

const logoutBtnStyle = {
  background: 'rgba(239, 68, 68, 0.1)',
  color: '#ef4444',
  border: '1px solid rgba(239, 68, 68, 0.2)',
  padding: '6px 12px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '13px',
  fontWeight: '600',
  transition: 'all 0.2s ease',
};

export default App;