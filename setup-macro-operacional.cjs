const fs = require('fs');
const path = require('path');

// Base folder
const base = path.join(__dirname, 'frontend', 'macro1-operacional');

fs.mkdirSync(base, { recursive: true });
fs.mkdirSync(path.join(base, 'css'), { recursive: true });
fs.mkdirSync(path.join(base, 'js'), { recursive: true });

// =========================
// HTML — MACRO MÓDULO OPERACIONAL
// =========================
const html = `
<div id="operacional-wrapper">
    <h2>Módulo Operacional</h2>

    <div id="operacional-menu">
        <button onclick="loadSection('condominios')">Condomínios</button>
        <button onclick="loadSection('fracoes')">Frações</button>
        <button onclick="loadSection('condominos')">Condóminos</button>
        <button onclick="loadSection('ocorrencias')">Ocorrências</button>
        <button onclick="loadSection('tarefas')">Tarefas</button>
        <button onclick="loadSection('auditoria')">Auditoria</button>
        <button onclick="loadSection('notificacoes')">Notificações</button>
    </div>

    <div id="operacional-content">
        <p>Selecione uma secção.</p>
    </div>
</div>
`;

fs.writeFileSync(path.join(base, 'operacional.html'), html);

// =========================
// CSS
// =========================
const css = `
#operacional-wrapper {
    padding: 40px;
    color: white;
}

#operacional-menu {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 30px;
}

#operacional-menu button {
    background: #0077ff;
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

fs.writeFileSync(path.join(base, 'css', 'operacional.css'), css);

// =========================
// JS — MACRO MÓDULO OPERACIONAL
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
    const content = document.getElementById("operacional-content");

    switch(section) {
        case "condominios":
            loadCondominios(content);
            break;
        case "fracoes":
            loadFracoes(content);
            break;
        case "condominos":
            loadCondominos(content);
            break;
        case "ocorrencias":
            loadOcorrencias(content);
            break;
        case "tarefas":
            loadTarefas(content);
            break;
        case "auditoria":
            loadAuditoria(content);
            break;
        case "notificacoes":
            loadNotificacoes(content);
            break;
        default:
            content.innerHTML = "<p>Secção inválida.</p>";
    }
}

// =========================
// SECÇÃO: CONDOMÍNIOS
// =========================
async function loadCondominios(container) {
    const res = await fetch(\`\${backendURL}/condominios\`, {
        headers: { "Authorization": localStorage.getItem("token") }
    });
    const data = await res.json();

    container.innerHTML = "<h3>Condomínios</h3>";

    data.forEach(c => {
        container.innerHTML += \`
            <div class="section-card">
                <p><strong>\${c.nome}</strong></p>
                <p>Morada: \${c.morada}</p>
                <p>Gestor: \${c.gestor}</p>
            </div>
        \`;
    });
}

// =========================
// SECÇÃO: FRAÇÕES
// =========================
async function loadFracoes(container) {
    const res = await fetch(\`\${backendURL}/fracoes\`, {
        headers: { "Authorization": localStorage.getItem("token") }
    });
    const data = await res.json();

    container.innerHTML = "<h3>Frações</h3>";

    data.forEach(f => {
        container.innerHTML += \`
            <div class="section-card">
                <p><strong>Fração \${f.numero}</strong></p>
                <p>Tipologia: \${f.tipologia}</p>
                <p>Proprietário: \${f.proprietario}</p>
            </div>
        \`;
    });
}

// =========================
// SECÇÃO: CONDÓMINOS
// =========================
async function loadCondominos(container) {
    const res = await fetch(\`\${backendURL}/condominos\`, {
        headers: { "Authorization": localStorage.getItem("token") }
    });
    const data = await res.json();

    container.innerHTML = "<h3>Condóminos</h3>";

    data.forEach(p => {
        container.innerHTML += \`
            <div class="section-card">
                <p><strong>\${p.nome}</strong></p>
                <p>Email: \${p.email}</p>
                <p>Fração: \${p.fracao}</p>
            </div>
        \`;
    });
}

// =========================
// SECÇÃO: OCORRÊNCIAS
// =========================
async function loadOcorrencias(container) {
    const res = await fetch(\`\${backendURL}/ocorrencias\`, {
        headers: { "Authorization": localStorage.getItem("token") }
    });
    const data = await res.json();

    container.innerHTML = "<h3>Ocorrências</h3>";

    data.forEach(o => {
        container.innerHTML += \`
            <div class="section-card">
                <p><strong>\${o.titulo}</strong></p>
                <p>\${o.descricao}</p>
                <p>Estado: \${o.estado}</p>
            </div>
        \`;
    });
}

// =========================
// SECÇÃO: TAREFAS
// =========================
async function loadTarefas(container) {
    const res = await fetch(\`\${backendURL}/tarefas\`, {
        headers: { "Authorization": localStorage.getItem("token") }
    });
    const data = await res.json();

    container.innerHTML = "<h3>Tarefas</h3>";

    data.forEach(t => {
        container.innerHTML += \`
            <div class="section-card">
                <p><strong>\${t.titulo}</strong></p>
                <p>\${t.descricao}</p>
                <p>Estado: \${t.estado}</p>
            </div>
        \`;
    });
}

// =========================
// SECÇÃO: AUDITORIA
// =========================
async function loadAuditoria(container) {
    const res = await fetch(\`\${backendURL}/auditoria\`, {
        headers: { "Authorization": localStorage.getItem("token") }
    });
    const data = await res.json();

    container.innerHTML = "<h3>Auditoria</h3>";

    data.forEach(a => {
        container.innerHTML += \`
            <div class="section-card">
                <p><strong>Ação:</strong> \${a.acao}</p>
                <p>Utilizador: \${a.utilizador}</p>
                <p>Data: \${a.data}</p>
            </div>
        \`;
    });
}

// =========================
// SECÇÃO: NOTIFICAÇÕES
// =========================
async function loadNotificacoes(container) {
    const res = await fetch(\`\${backendURL}/notificacoes\`, {
        headers: { "Authorization": localStorage.getItem("token") }
    });
    const data = await res.json();

    container.innerHTML = "<h3>Notificações</h3>";

    data.forEach(n => {
        container.innerHTML += \`
            <div class="section-card">
                <p><strong>\${n.titulo}</strong></p>
                <p>\${n.mensagem}</p>
                <p>Tipo: \${n.tipo}</p>
                <p>Estado: \${n.lida ? "Lida" : "Não Lida"}</p>
            </div>
        \`;
    });
}
`;

fs.writeFileSync(path.join(base, 'js', 'operacional.js'), js);

// =========================
// PÁGINA PRINCIPAL
// =========================
const page = `
<!DOCTYPE html>
<html>
<head>
    <title>Módulo Operacional</title>
    <link rel="stylesheet" href="macro1-operacional/css/operacional.css">
</head>
<body>
    ${html}
    <script src="macro1-operacional/js/operacional.js"></script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'frontend', 'operacional.html'), page);

console.log("Macro-Módulo 1 (Operacional) criado com sucesso.");
