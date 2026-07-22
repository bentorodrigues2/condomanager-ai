const fs = require('fs');
const path = require('path');

// Base folder
const base = path.join(__dirname, 'frontend', 'macroA-estrutura');

fs.mkdirSync(base, { recursive: true });
fs.mkdirSync(path.join(base, 'css'), { recursive: true });
fs.mkdirSync(path.join(base, 'js'), { recursive: true });

// =========================
// HTML — MÓDULO A (MENU + DASHBOARD + TEMA)
// =========================
const html = `
<div id="app-wrapper">

    <div id="topbar">
        <h1>CondoManager‑AI</h1>
        <button id="theme-toggle">Tema</button>
    </div>

    <div id="main-menu">
        <button onclick="go('operacional')">Operacional</button>
        <button onclick="go('financeiro')">Financeiro</button>
        <button onclick="go('documental')">Documental</button>
        <button onclick="go('comunicacao')">Comunicação</button>
        <button onclick="go('ia')">IA Assistente</button>
    </div>

    <div id="dashboard">
        <h2>Dashboard Global</h2>

        <div class="dash-card" id="dash-financeiro">
            <h3>Resumo Financeiro</h3>
            <p id="financeiro-resumo">Carregando...</p>
        </div>

        <div class="dash-card" id="dash-ocorrencias">
            <h3>Ocorrências Recentes</h3>
            <div id="ocorrencias-recentes">Carregando...</div>
        </div>

        <div class="dash-card" id="dash-assembleias">
            <h3>Próximas Assembleias</h3>
            <div id="assembleias-proximas">Carregando...</div>
        </div>

        <div class="dash-card" id="dash-alertas">
            <h3>Alertas</h3>
            <div id="alertas-lista">Carregando...</div>
        </div>
    </div>

</div>
`;

fs.writeFileSync(path.join(base, 'estrutura.html'), html);

// =========================
// CSS — TEMA + LAYOUT
// =========================
const css = `
body {
    margin: 0;
    font-family: Arial;
    background: var(--bg);
    color: var(--text);
}

:root {
    --bg: #111;
    --text: #fff;
    --card: #222;
}

.light {
    --bg: #f5f5f5;
    --text: #111;
    --card: #fff;
}

#topbar {
    background: #0077ff;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    color: white;
}

#main-menu {
    display: flex;
    gap: 12px;
    padding: 20px;
}

#main-menu button {
    background: #0077ff;
    border: none;
    padding: 12px 18px;
    border-radius: 8px;
    color: white;
    cursor: pointer;
}

#dashboard {
    padding: 20px;
}

.dash-card {
    background: var(--card);
    padding: 20px;
    border-radius: 10px;
    margin-bottom: 20px;
}
`;

fs.writeFileSync(path.join(base, 'css', 'estrutura.css'), css);

// =========================
// JS — DASHBOARD + TEMA + NAVEGAÇÃO
// =========================
const js = `
const backendURL = "https://condomanager-ai-backend.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    loadDashboard();
    setupThemeToggle();
});

// =========================
// NAVEGAÇÃO ENTRE MÓDULOS
// =========================
function go(module) {
    window.location.href = module + ".html";
}

// =========================
// TEMA ESCURO / CLARO
// =========================
function setupThemeToggle() {
    const btn = document.getElementById("theme-toggle");

    btn.onclick = () => {
        document.body.classList.toggle("light");
    };
}

// =========================
// DASHBOARD GLOBAL
// =========================
async function loadDashboard() {

    // FINANCEIRO
    const fin = await fetch(\`\${backendURL}/dashboard/financeiro\`, {
        headers: { "Authorization": localStorage.getItem("token") }
    });
    const finData = await fin.json();
    document.getElementById("financeiro-resumo").innerText =
        \`Saldo: \${finData.saldo} € | Receitas: \${finData.receitas} € | Despesas: \${finData.despesas} €\`;

    // OCORRÊNCIAS
    const oc = await fetch(\`\${backendURL}/dashboard/ocorrencias\`, {
        headers: { "Authorization": localStorage.getItem("token") }
    });
    const ocData = await oc.json();
    const ocDiv = document.getElementById("ocorrencias-recentes");
    ocDiv.innerHTML = "";
    ocData.forEach(o => {
        ocDiv.innerHTML += \`<p><strong>\${o.titulo}</strong> — \${o.estado}</p>\`;
    });

    // ASSEMBLEIAS
    const as = await fetch(\`\${backendURL}/dashboard/assembleias\`, {
        headers: { "Authorization": localStorage.getItem("token") }
    });
    const asData = await as.json();
    const asDiv = document.getElementById("assembleias-proximas");
    asDiv.innerHTML = "";
    asData.forEach(a => {
        asDiv.innerHTML += \`<p>\${a.data} — \${a.condominio}</p>\`;
    });

    // ALERTAS
    const al = await fetch(\`\${backendURL}/dashboard/alertas\`, {
        headers: { "Authorization": localStorage.getItem("token") }
    });
    const alData = await al.json();
    const alDiv = document.getElementById("alertas-lista");
    alDiv.innerHTML = "";
    alData.forEach(a => {
        alDiv.innerHTML += \`<p><strong>\${a.tipo}</strong>: \${a.mensagem}</p>\`;
    });
}
`;

fs.writeFileSync(path.join(base, 'js', 'estrutura.js'), js);

// =========================
// PÁGINA PRINCIPAL
// =========================
const page = `
<!DOCTYPE html>
<html>
<head>
    <title>Estrutura & Navegação</title>
    <link rel="stylesheet" href="macroA-estrutura/css/estrutura.css">
</head>
<body>
    ${html}
    <script src="macroA-estrutura/js/estrutura.js"></script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'frontend', 'estrutura.html'), page);

console.log("Módulo A (Estrutura & Navegação) criado com sucesso.");
