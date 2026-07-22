const fs = require('fs');
const path = require('path');

console.log('🔧 A reescrever Dashboard.tsx com layout mobile otimizado...');

const filePath = path.join(__dirname, 'src/pages/Dashboard.tsx');

const newContent = `
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { lightTheme, darkTheme } from '../theme';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function Dashboard() {
  const [darkMode, setDarkMode] = useState(false);
  const theme = darkMode ? darkTheme : lightTheme;

  const [stats, setStats] = useState(null);
  const [recentIncidentes, setRecentIncidentes] = useState([]);
  const [recentPagamentos, setRecentPagamentos] = useState([]);
  const [recentMensagens, setRecentMensagens] = useState([]);
  const [recentObras, setRecentObras] = useState([]);
  const [recentInventario, setRecentInventario] = useState([]);
  const [recentOwners, setRecentOwners] = useState([]);

  const [chartIncidentes, setChartIncidentes] = useState([]);
  const [chartPagamentos, setChartPagamentos] = useState([]);
  const [chartObrasEstado, setChartObrasEstado] = useState([]);
  const [chartInventarioEstado, setChartInventarioEstado] = useState([]);

  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);

      const tables = [
        'incidentes',
        'pagamentos',
        'mensagens',
        'obras',
        'inventario',
        'owners'
      ];

      const results = await Promise.all(
        tables.map(t =>
          supabase.from(t).select('*', { count: 'exact', head: true })
        )
      );

      setStats({
        incidentes: results[0].count ?? 0,
        pagamentos: results[1].count ?? 0,
        mensagens: results[2].count ?? 0,
        obras: results[3].count ?? 0,
        inventario: results[4].count ?? 0,
        owners: results[5].count ?? 0
      });

      const [inc, pag, msg, obr, inv, own] = await Promise.all([
        supabase.from('incidentes').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('pagamentos').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('mensagens').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('obras').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('inventario').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('owners').select('*').order('created_at', { ascending: false }).limit(5)
      ]);

      setRecentIncidentes(inc.data || []);
      setRecentPagamentos(pag.data || []);
      setRecentMensagens(msg.data || []);
      setRecentObras(obr.data || []);
      setRecentInventario(inv.data || []);
      setRecentOwners(own.data || []);

      const [incMes, pagMes, obrasEstado, inventEstado] = await Promise.all([
        supabase.rpc('incidentes_por_mes'),
        supabase.rpc('pagamentos_por_mes'),
        supabase.rpc('obras_por_estado'),
        supabase.rpc('inventario_por_estado')
      ]);

      setChartIncidentes(incMes.data || []);
      setChartPagamentos(pagMes.data || []);
      setChartObrasEstado(obrasEstado.data || []);
      setChartInventarioEstado(inventEstado.data || []);

      const alertList = [];

      const pagamentosAtrasados = await supabase
        .from('pagamentos')
        .select('*')
        .eq('estado', 'atrasado');

      if (pagamentosAtrasados.data?.length > 0) {
        alertList.push({
          tipo: 'Pagamento em atraso',
          detalhe: \`\${pagamentosAtrasados.data.length} pagamento(s) por resolver\`
        });
      }

      const incidentesUrgentes = await supabase
        .from('incidentes')
        .select('*')
        .eq('prioridade', 'alta');

      if (incidentesUrgentes.data?.length > 0) {
        alertList.push({
          tipo: 'Incidente urgente',
          detalhe: \`\${incidentesUrgentes.data.length} incidente(s) críticos\`
        });
      }

      const obrasParadas = await supabase
        .from('obras')
        .select('*')
        .eq('estado', 'parada');

      if (obrasParadas.data?.length > 0) {
        alertList.push({
          tipo: 'Obra parada',
          detalhe: \`\${obrasParadas.data.length} obra(s) sem progresso\`
        });
      }

      const inventarioCritico = await supabase
        .from('inventario')
        .select('*')
        .eq('estado', 'critico');

      if (inventarioCritico.data?.length > 0) {
        alertList.push({
          tipo: 'Inventário crítico',
          detalhe: \`\${inventarioCritico.data.length} item(ns) críticos\`
        });
      }

      setAlerts(alertList);
      setLoading(false);
    }

    load();
  }, []);

  if (loading || !stats) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: theme.colors.background,
          padding: theme.spacing.section,
          color: theme.colors.text
        }}
      >
        <p style={{ marginTop: '2rem' }}>A carregar dados…</p>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: theme.colors.background,
        padding: '1rem',
        color: theme.colors.text
      }}
    >
      <h1 style={{ marginBottom: '1rem' }}>Dashboard</h1>

      <button
        onClick={() => setDarkMode(!darkMode)}
        style={{
          padding: '0.6rem 1rem',
          borderRadius: '8px',
          border: \`1px solid \${theme.colors.border}\`,
          background: theme.colors.card,
          color: theme.colors.text,
          cursor: 'pointer',
          marginBottom: '1.5rem',
          boxShadow: theme.shadow.card
        }}
      >
        {darkMode ? '☀️ Modo Claro' : '🌙 Modo Escuro'}
      </button>

      {alerts.length > 0 && (
        <div
          style={{
            background: '#fef2f2',
            border: \`1px solid \${theme.colors.danger}\`,
            padding: '1rem',
            borderRadius: '12px',
            marginBottom: '1.5rem'
          }}
        >
          <h2 style={{ marginBottom: '1rem', color: theme.colors.danger }}>Alertas</h2>
          {alerts.map((a, i) => (
            <div key={i} style={{ marginBottom: '0.5rem' }}>
              <strong>{a.tipo}</strong>: {a.detalhe}
            </div>
          ))}
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}
      >
        <Card title="Incidentes" value={stats.incidentes} icon="⚠️" color={theme.colors.danger} theme={theme} />
        <Card title="Pagamentos" value={stats.pagamentos} icon="💳" color={theme.colors.success} theme={theme} />
        <Card title="Mensagens" value={stats.mensagens} icon="💬" color={theme.colors.info} theme={theme} />
        <Card title="Obras" value={stats.obras} icon="🏗️" color={theme.colors.warning} theme={theme} />
        <Card title="Inventário" value={stats.inventario} icon="📦" color={theme.colors.primary} theme={theme} />
        <Card title="Proprietários" value={stats.owners} icon="👤" color={theme.colors.text} theme={theme} />
      </div>

      <GraphBox title="Incidentes por mês" theme={theme}>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={chartIncidentes}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.border} />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="total" stroke={theme.colors.primary} strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </GraphBox>

      <GraphBox title="Pagamentos por mês" theme={theme}>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartPagamentos}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.border} />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill={theme.colors.success} />
          </BarChart>
        </ResponsiveContainer>
      </GraphBox>

      <GraphBox title="Obras por estado" theme={theme}>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={chartObrasEstado}
              dataKey="total"
              nameKey="estado"
              outerRadius={100}
              fill={theme.colors.primary}
              label
            >
              {chartObrasEstado.map((entry, index) => (
                <Cell
                  key={index}
                  fill={[theme.colors.primary, theme.colors.warning, theme.colors.danger][index % 3]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </GraphBox>

      <GraphBox title="Inventário por estado" theme={theme}>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={chartInventarioEstado}
              dataKey="total"
              nameKey="estado"
              outerRadius={100}
              fill={theme.colors.info}
              label
            >
              {chartInventarioEstado.map((entry, index) => (
                <Cell
                  key={index}
                  fill={[theme.colors.info, theme.colors.warning, theme.colors.danger][index % 3]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </GraphBox>

      <Widget title="Últimos Incidentes" items={recentIncidentes} field="titulo" theme={theme} />
      <Widget title="Últimos Pagamentos" items={recentPagamentos} field="descricao" theme={theme} />
      <Widget title="Últimas Mensagens" items={recentMensagens} field="titulo" theme={theme} />
      <Widget title="Últimas Obras" items={recentObras} field="titulo" theme={theme} />
      <Widget title="Últimos Itens de Inventário" items={recentInventario} field="nome" theme={theme} />
      <Widget title="Últimos Proprietários" items={recentOwners} field="nome" theme={theme} />
    </div>
  );
}

function Card({ title, value, icon, color, theme }) {
  return (
    <div
      style={{
        background: theme.colors.card,
        padding: '1rem',
        borderRadius: '12px',
        boxShadow: theme.shadow.card,
        border: \`1px solid \${theme.colors.border}\`,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
      }}
    >
      <div style={{ fontSize: '1.6rem' }}>{icon}</div>
      <h3 style={{ margin: 0 }}>{title}</h3>
      <p
        style={{
          margin: 0,
          fontSize: '1.6rem',
          fontWeight: 'bold',
          color
        }}
      >
        {value}
      </p>
    </div>
  );
}

function Widget({ title, items, field, theme }) {
  return (
    <div
      style={{
        background: theme.colors.card,
        padding: '1rem',
        borderRadius: '12px',
        boxShadow: theme.shadow.card,
        border: \`1px solid \${theme.colors.border}\`,
        marginBottom: '1.5rem'
      }}
    >
      <h2 style={{ marginBottom: '1rem' }}>{title}</h2>

      {items.length === 0 && (
        <p style={{ color: theme.colors.textLight }}>Nenhum registo encontrado.</p>
      )}

      {items.map((item, index) => (
        <div
          key={index}
          style={{
            padding: '0.8rem 0',
            borderBottom: '1px solid #eee'
          }}
        >
          <strong>{item[field]}</strong>
          <p style={{ margin: 0, color: theme.colors.textLight }}>
            {item.created_at?.slice(0, 10)}
          </p>
        </div>
      ))}
    </div>
  );
}

function GraphBox({ title, children, theme }) {
  return (
    <div
      style={{
        background: theme.colors.card,
        padding: '1rem',
        borderRadius: '12px',
        boxShadow: theme.shadow.card,
        border: \`1px solid \${theme.colors.border}\`,
        marginBottom: '1.5rem'
      }}
    >
      <h2 style={{ marginBottom: '1rem' }}>{title}</h2>
      {children}
    </div>
  );
}
`;

fs.writeFileSync(filePath, newContent, 'utf8');

console.log('🎉 Dashboard mobile otimizado com sucesso.');
