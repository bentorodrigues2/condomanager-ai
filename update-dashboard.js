const fs = require('fs');
const path = require('path');

console.log("🔧 A atualizar Dashboard PRO com Modo Escuro + Tema Global + Animação...");

const dashboardPath = path.join(__dirname, 'src/pages/Dashboard.tsx');

if (!fs.existsSync(dashboardPath)) {
  console.error("❌ ERRO: Não encontrei src/pages/Dashboard.tsx");
  process.exit(1);
}

let content = fs.readFileSync(dashboardPath, 'utf8');

// ===============================
// 1. Substituir import do theme
// ===============================
content = content.replace(
  /import\s*{\s*theme\s*}\s*from\s*['"]..\/theme['"];/,
  `import { lightTheme, darkTheme } from '../theme';`
);

// ===============================
// 2. Inserir estado do modo escuro
// ===============================
if (!content.includes("const [darkMode")) {
  content = content.replace(
    /export default function Dashboard\(\) {/,
    `export default function Dashboard() {
  const [darkMode, setDarkMode] = useState(false);
  const theme = darkMode ? darkTheme : lightTheme;`
  );
}

// ===============================
// 3. Inserir botão de toggle
// ===============================
if (!content.includes("Modo Escuro")) {
  content = content.replace(
    /<h1[^>]*>Dashboard<\/h1>/,
    `<h1 style={{ marginBottom: '1rem' }}>Dashboard</h1>

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
    boxShadow: theme.shadow.card,
    transition: 'background 0.4s ease, color 0.4s ease, border-color 0.4s ease'
  }}
>
  {darkMode ? '☀️ Modo Claro' : '🌙 Modo Escuro'}
</button>`
  );
}

// ===============================
// 4. Animação no container principal
// ===============================
content = content.replace(
  /minHeight: '100vh',/,
  `minHeight: '100vh',
      transition: 'background 0.4s ease, color 0.4s ease',`
);

// ===============================
// 5. Animação nos Cards, Widgets e GraphBox
// ===============================
content = content.replace(
  /boxShadow: theme.shadow.card,/g,
  `boxShadow: theme.shadow.card,
      transition: 'background 0.4s ease, color 0.4s ease, border-color 0.4s ease',`
);

// ===============================
// 6. Guardar ficheiro atualizado
// ===============================
fs.writeFileSync(dashboardPath, content, 'utf8');

console.log("✅ Dashboard atualizado com sucesso!");
console.log("🌙 Modo escuro + animação ativados.");
console.log("🎨 Tema global aplicado.");
