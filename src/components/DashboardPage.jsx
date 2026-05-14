// src/components/DashboardPage.jsx
import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { getDashboardChamados } from '../services/DashboardService';

// Paleta de cores harmonizada
const CORES_GRAFICO = ['#3b82f6', '#a78bfa', '#10b981', '#f59e0b', '#f472b6'];
const CORES_STATUS = {
  'Aberto':        '#f59e0b',
  'Em Andamento':  '#3b82f6',
  'Concluído':     '#10b981',
  'Cancelado':     '#ef4444',
};
const CORES_CRITICIDADE = {
  'Critico': '#ef4444',
  'Alto':    '#f59e0b',
  'Medio':   '#3b82f6',
  'Baixo':   '#10b981',
};

// Formata valores monetários em BRL
const formatCurrency = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

// Tooltip customizado para os gráficos de barra
const CustomTooltipBar = ({ active, payload, label, isCurrency }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p className="chart-tooltip-label">{label}</p>
        <p className="chart-tooltip-value">
          {isCurrency ? formatCurrency(payload[0].value) : payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

// Tooltip customizado para o Pie
const CustomTooltipPie = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p className="chart-tooltip-label">{payload[0].name}</p>
        <p className="chart-tooltip-value">{payload[0].value} chamados</p>
      </div>
    );
  }
  return null;
};

// Card de KPI
const KpiCard = ({ icon, titulo, valor, subtitulo, cor }) => (
  <div className="kpi-card glass-container" style={{ '--kpi-color': cor }}>
    <div className="kpi-icon">{icon}</div>
    <div className="kpi-body">
      <p className="kpi-titulo">{titulo}</p>
      <p className="kpi-valor">{valor}</p>
      {subtitulo && <p className="kpi-subtitulo">{subtitulo}</p>}
    </div>
    <div className="kpi-glow" />
  </div>
);

// Card de gráfico com título
const ChartCard = ({ titulo, children }) => (
  <div className="chart-card glass-container">
    <h3 className="chart-titulo">{titulo}</h3>
    {children}
  </div>
);

// Barra horizontal simples (ranking)
const RankingBar = ({ label, value, max, cor, suffix = '' }) => (
  <div className="ranking-row">
    <span className="ranking-label" title={label}>{label}</span>
    <div className="ranking-track">
      <div
        className="ranking-fill"
        style={{ width: `${max > 0 ? (value / max) * 100 : 0}%`, background: cor }}
      />
    </div>
    <span className="ranking-value">{suffix}{typeof value === 'number' && suffix === 'R$ ' ? value.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : value}</span>
  </div>
);

export default function DashboardPage() {
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    getDashboardChamados()
      .then(setDados)
      .catch(() => setErro('Não foi possível carregar os dados.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner" />
        <p>Carregando métricas...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="dashboard-erro glass-container">
        <span className="dashboard-erro-icon">⚠️</span>
        <p>{erro}</p>
      </div>
    );
  }

  if (!dados || dados.totalChamados === 0) {
    return (
      <div className="dashboard-vazio glass-container">
        <span style={{ fontSize: '3rem' }}>📭</span>
        <p>Nenhum chamado registrado ainda.</p>
      </div>
    );
  }

  const statusComCor = dados.chamadosPorStatus.map((item) => ({
    ...item,
    cor: CORES_STATUS[item.label] || '#94a3b8',
  }));

  const criticidadeComCor = dados.chamadosPorCriticidade.map((item) => ({
    ...item,
    cor: CORES_CRITICIDADE[item.label] || '#94a3b8',
  }));

  const maxAbrem   = Math.max(...(dados.deptQueAbrem.map(d => d.value)), 1);
  const maxCusto   = Math.max(...(dados.topCentrosCusto.map(d => d.value)), 1);
  const maxGargalos = Math.max(...(dados.topGargalos.map(d => d.value)), 1);

  return (
    <div className="dashboard-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title text-gradient">Dashboard de Gestão</h1>
          <p className="dashboard-subtitulo">Visão estratégica e operacional</p>
        </div>
      </div>

      <section className="kpi-grid">
        <KpiCard
          icon="📋"
          titulo="Volume Total"
          valor={dados.totalChamados}
          cor="#3b82f6"
        />
        <KpiCard
          icon="🔔"
          titulo="Em Aberto"
          valor={dados.totalAbertos}
          subtitulo="aguardando atendimento"
          cor="#ef4444"
        />
        <KpiCard
          icon="💰"
          titulo="Custo Total"
          valor={formatCurrency(dados.totalCusto)}
          cor="#10b981"
        />
        <KpiCard
          icon="📊"
          titulo="Ticket Médio"
          valor={formatCurrency(dados.custoMedio)}
          cor="#a78bfa"
        />
      </section>

      <section className="charts-grid-2">
        <ChartCard titulo="📌 Status dos Chamados">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={statusComCor}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={40}
                paddingAngle={5}
              >
                {statusComCor.map((entry, i) => (
                  <Cell key={i} fill={entry.cor} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltipPie />} />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard titulo="🔥 Distribuição por Criticidade">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={criticidadeComCor}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={40}
                paddingAngle={5}
              >
                {criticidadeComCor.map((entry, i) => (
                  <Cell key={i} fill={entry.cor} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltipPie />} />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>

      <section className="charts-grid-2">
        <ChartCard titulo="⚠️ Maiores Gargalos (Pendentes)">
          <div className="ranking-list">
            {dados.topGargalos.length === 0 ? (
              <p className="chart-vazio">Sem pendências no momento</p>
            ) : (
              dados.topGargalos.map((item, i) => (
                <RankingBar
                  key={i}
                  label={item.label}
                  value={item.value}
                  max={maxGargalos}
                  cor="#f472b6"
                />
              ))
            )}
          </div>
        </ChartCard>

        <ChartCard titulo="💸 Custos por Departamento (Top 5)">
          <div className="ranking-list">
            {dados.topCentrosCusto.map((item, i) => (
              <RankingBar
                key={i}
                label={item.label}
                value={item.value}
                max={maxCusto}
                cor="#10b981"
                suffix="R$ "
              />
            ))}
          </div>
        </ChartCard>
      </section>

      <section className="charts-grid-2">
        <ChartCard titulo="🏢 Demanda por Departamento">
          <div className="ranking-list">
            {dados.deptQueAbrem.map((item, i) => (
              <RankingBar
                key={i}
                label={item.label}
                value={item.value}
                max={maxAbrem}
                cor="#3b82f6"
              />
            ))}
          </div>
        </ChartCard>

        <ChartCard titulo="👤 Top 5 Solicitantes">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={dados.topSolicitantes} layout="vertical" margin={{ left: 8, right: 24 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis
                type="category"
                dataKey="label"
                width={130}
                tick={{ fill: '#94a3b8', fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltipBar />} />
              <Bar dataKey="value" fill="#a78bfa" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>
    </div>
  );
}
