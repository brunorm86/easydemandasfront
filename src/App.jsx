// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import EmpregadosPage from './components/EmpregadosPage';
import DepartamentosPage from './components/DepartamentosPage';
import CargosPage from './components/CargosPage';
import ChamadosPage from './components/ChamadosPage';
import DashboardPage from './components/DashboardPage';

function App() {
  return (
    <Router>
      <nav className="navbar">
        <div className="navbar-brand">EasyDemandas</div>
        <div className="navbar-links">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Empregados</NavLink>
          <NavLink to="/departamentos" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Departamentos</NavLink>
          <NavLink to="/cargos" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Cargos</NavLink>
          <NavLink to="/chamados" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Chamados</NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'nav-link active nav-link-dashboard' : 'nav-link nav-link-dashboard')}>📊 Dashboard</NavLink>
        </div>
      </nav>
      
      <main className="main-content">
        <Routes>
          <Route path="/" element={<EmpregadosPage />} />
          <Route path="/departamentos" element={<DepartamentosPage />} />
          <Route path="/cargos" element={<CargosPage />} />
          <Route path="/chamados" element={<ChamadosPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;