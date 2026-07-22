const fs = require('fs');
const path = require('path');

console.log('🔧 A reescrever theme.ts com paleta exclusiva CondoManager AI...');

const filePath = path.join(__dirname, 'src/theme.ts');

const newContent = `
export const lightTheme = {
  mode: 'light',
  brandName: 'CondoManager AI',
  colors: {
    background: '#f5f7fa',
    card: '#ffffff',
    border: '#e2e8f0',
    text: '#1e293b',
    textLight: '#64748b',

    // Paleta oficial CondoManager AI
    primary: '#2563eb',
    primarySoft: '#dbeafe',
    accent: '#1e3a8a',
    accentSoft: '#e0e7ff',

    success: '#16a34a',
    warning: '#fbbf24',
    danger: '#dc2626',
    info: '#0ea5e9',

    sidebarBg: '#0f172a',
    sidebarText: '#e2e8f0',
    sidebarActiveBg: '#1e293b'
  },

  radius: {
    card: '14px',
    button: '10px'
  },

  shadow: {
    card: '0 4px 14px rgba(0,0,0,0.08)',
    soft: '0 2px 6px rgba(0,0,0,0.05)'
  },

  spacing: {
    section: '2rem',
    cardPadding: '1.5rem'
  },

  font: {
    family: 'Inter, system-ui, sans-serif',
    size: '16px'
  }
};

export const darkTheme = {
  mode: 'dark',
  brandName: 'CondoManager AI',
  colors: {
    background: '#020617',
    card: '#0f172a',
    border: '#1e293b',
    text: '#e2e8f0',
    textLight: '#94a3b8',

    primary: '#3b82f6',
    primarySoft: '#1e3a8a',
    accent: '#1e3a8a',
    accentSoft: '#1e40af',

    success: '#22c55e',
    warning: '#facc15',
    danger: '#ef4444',
    info: '#38bdf8',

    sidebarBg: '#020617',
    sidebarText: '#e2e8f0',
    sidebarActiveBg: '#1e293b'
  },

  radius: {
    card: '14px',
    button: '10px'
  },

  shadow: {
    card: '0 4px 18px rgba(0,0,0,0.45)',
    soft: '0 2px 8px rgba(0,0,0,0.35)'
  },

  spacing: {
    section: '2rem',
    cardPadding: '1.5rem'
  },

  font: {
    family: 'Inter, system-ui, sans-serif',
    size: '16px'
  }
};
`;

fs.writeFileSync(filePath, newContent, 'utf8');

console.log('🎨 Tema CondoManager AI aplicado com sucesso.');
console.log('✨ Paleta exclusiva integrada.');
