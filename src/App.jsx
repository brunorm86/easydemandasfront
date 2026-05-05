// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import PessoasPage from './components/PessoasPage';
import EmpregadosPage from './components/EmpregadosPage';
import DepartamentosPage from './components/DepartamentosPage';

function App() {
  return (
    <Router>
      <nav className="navbar">
        <div className="navbar-brand">EasyDemandas</div>
        <div className="navbar-links">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Pessoas</NavLink>
          <NavLink to="/empregados" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Empregados</NavLink>
          <NavLink to="/departamentos" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Departamentos</NavLink>
        </div>
      </nav>
      
      <main className="main-content">
        <Routes>
          <Route path="/" element={<PessoasPage />} />
          <Route path="/empregados" element={<EmpregadosPage />} />
          <Route path="/departamentos" element={<DepartamentosPage />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;