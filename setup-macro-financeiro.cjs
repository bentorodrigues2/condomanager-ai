const fs = require('fs');
const path = require('path');

// Base folder
const base = path.join(__dirname, 'frontend', 'macro2-financeiro');

fs.mkdirSync(base, { recursive: true });
fs.mkdirSync(path.join(base, 'css'), { recursive: true });
fs.mkdirSync(path.join(base, 'js'), { recursive: true });

// =========================
// HTML — MACRO MÓDULO FINANCEIRO
// =========================
const html = `
<div id="financeiro-wrapper">
    <h2>Módulo Financeiro</h2>

    <div id="financeiro-menu">
        <button onclick="loadSection('pagamentos')">Pagamentos</button>
        <button onclick="loadSection('quotas')">Quotas</button>
        <button onclick="loadSection('contas')">Contas Correntes</button>
        <button onclick="loadSection('balancetes')">Balancetes</button>
        <button onclick="loadSection('relatorios')">Relatórios</button>
        <button onclick="loadSection('previsoes')">Previsões</button>
    </div>

    <div id="financeiro-content">
        <p>Selecione uma secção.</p>
    </div>
</div>
`;

fs.writeFileSync(path.join(base, 'financeiro.html'), html);

// =========================
// CSS
// =========================
const css = `
#financeiro-wrapper {
    padding: 40px;
    color: white;
}

#financeiro-menu {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 30px;
}

#financeiro-menu button {
    background: #00aaff;
    border: none;
    padding: 12px 18px;
    border-radius: 8px;
    color: white;
    cursor: pointer;
}

.section-card {
    background: #222;
    padding: 20px;
    border-radius: 10px;
    margin-bottom: 20px;
}
`;

fs.writeFileSync(path.join(base, 'css', 'financeiro.css'), css);

// =========================
// JS — MACRO MÓDULO FINANCEIRO
// =========================
const js = `
const backendURL = "https://condomanager-ai-backend.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
        return;
    }
});

// =========================
// NAVEGAÇÃO ENTRE SECÇÕES
// =========================
function loadSection(section) {
    const content = document.getElementById("financeiro-content");

    switch(section) {
        case "pagamentos":
            loadPagamentos(content);
            break;
        case "quotas":
            loadQuotas(content);
            break;
        case "contas":
            loadContas(content);
            break;
        case "balancetes":
            loadBalancetes(content);
            break;
        case "relatorios":
            loadRelatorios(content);
            break;
        case "previsoes":
            loadPrevisoes(content);
            break;
        default:
            content.innerHTML = "<p>Secção inválida.</p>";
    }
}

// =========================
// SECÇÃO: PAGAMENTOS
// =========================
async function loadPagamentos(container) {
    const res = await fetch(\`\${backendURL}/pagamentos\`, {
        headers: { "Authorization": localStorage.getItem("token") }
    });
    const data = await res.json();

    container.innerHTML = "<h3>Pagamentos</h3>";

    data.forEach(p => {
        container.innerHTML += \`
            <div class="section-card">
                <p><strong>Condomínio:</strong> \${p.condominio}</p>
                <p><strong>Fração:</strong> \${p.fracao}</p>
                <p><strong>Valor:</strong> \${p.valor} €</p>
                <p><strong>Método:</strong> \${p.metodo}</p>
                <p><strong>Estado:</strong> \${p.estado}</p>
            </div>
        \`;
    });
}

// =========================
// SECÇÃO: QUOTAS
// =========================
async function loadQuotas(container) {
    const res = await fetch(\`\${backendURL}/quotas\`, {
        headers: { "Authorization": localStorage.getItem("token") }
    });
    const data = await res.json();

    container.innerHTML = "<h3>Quotas</h3>";

    data.forEach(q => {
        container.innerHTML += \`
            <div class="section-card">
                <p><strong>Condomínio:</strong> \${q.condominio}</p>
                <p><strong>Fração:</strong> \${q.fracao}</p>
                <p><strong>Valor Mensal:</strong> \${q.valor} €</p>
                <p><strong>Estado:</strong> \${q.estado}</p>
            </div>
        \`;
    });
}

// =========================
// SECÇÃO: CONTAS CORRENTES
// =========================
async function loadContas(container) {
    const res = await fetch(\`\${backendURL}/contas\`, {
        headers: { "Authorization": localStorage.getItem("token") }
    });
    const data = await res.json();

    container.innerHTML = "<h3>Contas Correntes</h3>";

    data.forEach(c => {
        container.innerHTML += \`
            <div class="section-card">
                <p><strong>Condomínio:</strong> \${c.condominio}</p>
                <p><strong>Saldo Atual:</strong> \${c.saldo} €</p>
                <p><strong>Última Atualização:</strong> \${c.data}</p>
            </div>
        \`;
    });
}

// =========================
// SECÇÃO: BALANCETES
// =========================
async function loadBalancetes(container) {
    const res = await fetch(\`\${backendURL}/balancetes\`, {
        headers: { "Authorization": localStorage.getItem("token") }
    });
    const data = await res.json();

    container.innerHTML = "<h3>Balancetes</h3>";

    data.forEach(b => {
        container.innerHTML += \`
            <div class="section-card">
                <p><strong>Condomínio:</strong> \${b.condominio}</p>
                <p><strong>Receitas:</strong> \${b.receitas} €</p>
                <p><strong>Despesas:</strong> \${b.despesas} €</p>
                <p><strong>Saldo:</strong> \${b.saldo} €</p>
            </div>
        \`;
    });
}

// =========================
// SECÇÃO: RELATÓRIOS
// =========================
async function loadRelatorios(container) {
    const res = await fetch(\`\${backendURL}/relatorios\`, {
        headers: { "Authorization": localStorage.getItem("token") }
    });
    const data = await res.json();

    container.innerHTML = "<h3>Relatórios Financeiros</h3>";

    data.forEach(r => {
        container.innerHTML += \`
            <div class="section-card">
                <p><strong>Título:</strong> \${r.titulo}</p>
                <p><strong>Condomínio:</strong> \${r.condominio}</p>
                <p><strong>Data:</strong> \${r.data}</p>
            </div>
        \`;
    });
}

// =========================
// SECÇÃO: PREVISÕES
// =========================
async function loadPrevisoes(container) {
    const res = await fetch(\`\${backendURL}/previsoes\`, {
        headers: { "Authorization": localStorage.getItem("token") }
    });
    const data = await res.json();

    container.innerHTML = "<h3>Previsões Financeiras</h3>";

    data.forEach(p => {
        container.innerHTML += \`
            <div class="section-card">
                <p><strong>Condomínio:</strong> \${p.condominio}</p>
                <p><strong>Previsão:</strong> \${p.valorPrevisto} €</p>
                <p><strong>Período:</strong> \${p.periodo}</p>
            </div>
        \`;
    });
}
`;

fs.writeFileSync(path.join(base, 'js', 'financeiro.js'), js);

// =========================
// PÁGINA PRINCIPAL
// =========================
const page = `
<!DOCTYPE html>
<html>
<head>
    <title>Módulo Financeiro</title>
    <link rel="stylesheet" href="macro2-financeiro/css/financeiro.css">
</head>
<body>
    ${html}
    <script src="macro2-financeiro/js/financeiro.js"></script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'frontend', 'financeiro.html'), page);

console.log("Macro-Módulo 2 (Financeiro) criado com sucesso.");
