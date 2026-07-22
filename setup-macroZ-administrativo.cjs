const fs = require('fs');
const path = require('path');

// Base folder
const base = path.join(__dirname, 'frontend', 'macroZ-administrativo');

fs.mkdirSync(base, { recursive: true });
fs.mkdirSync(path.join(base, 'css'), { recursive: true });
fs.mkdirSync(path.join(base, 'js'), { recursive: true });

// =========================
// HTML — MÓDULO Z (PERMISSÕES + DOCUMENTAÇÃO)
// =========================
const html = `
<div id="admin-wrapper">
    <h2>Estrutura Administrativa</h2>

    <div id="admin-menu">
        <button onclick="loadSection('permissoes')">Sistema de Permissões</button>
        <button onclick="loadSection('roles')">Gestão de Perfis</button>
        <button onclick="loadSection('docs')">Documentação Oficial</button>
        <button onclick="loadSection('manual')">Manual do Gestor</button>
        <button onclick="loadSection('tecnico')">Manual Técnico</button>
    </div>

    <div id="admin-content">
        <p>Selecione uma secção.</p>
    </div>
</div>
`;

fs.writeFileSync(path.join(base, 'administrativo.html'), html);

// =========================
// CSS — LAYOUT
// =========================
const css = `
#admin-wrapper {
    padding: 40px;
    color: white;
}

#admin-menu {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 30px;
}

#admin-menu button {
    background: #0066aa;
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

fs.writeFileSync(path.join(base, 'css', 'administrativo.css'), css);

// =========================
// JS — PERMISSÕES + DOCUMENTAÇÃO
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
    const content = document.getElementById("admin-content");

    switch(section) {
        case "permissoes":
            loadPermissoes(content);
            break;
        case "roles":
            loadRoles(content);
            break;
        case "docs":
            loadDocs(content);
            break;
        case "manual":
            loadManualGestor(content);
            break;
        case "tecnico":
            loadManualTecnico(content);
            break;
        default:
            content.innerHTML = "<p>Secção inválida.</p>";
    }
}

// =========================
// SECÇÃO: SISTEMA DE PERMISSÕES
// =========================
function loadPermissoes(container) {
    container.innerHTML = "<h3>Sistema de Permissões</h3>";

    container.innerHTML += \`
        <div class="section-card">
            <p>Perfis disponíveis:</p>
            <ul>
                <li><strong>Administrador</strong> — acesso total</li>
                <li><strong>Gestor</strong> — gestão de condomínios</li>
                <li><strong>Condómino</strong> — acesso à sua fração</li>
                <li><strong>Visitante</strong> — acesso limitado</li>
            </ul>
        </div>
    \`;
}

// =========================
// SECÇÃO: GESTÃO DE ROLES
// =========================
async function loadRoles(container) {
    const res = await fetch(\`\${backendURL}/roles\`, {
        headers: { "Authorization": localStorage.getItem("token") }
    });
    const data = await res.json();

    container.innerHTML = "<h3>Gestão de Perfis</h3>";

    data.forEach(r => {
        container.innerHTML += \`
            <div class="section-card">
                <p><strong>Utilizador:</strong> \${r.utilizador}</p>
                <p><strong>Perfil:</strong> \${r.role}</p>
                <p><strong>Permissões:</strong> \${r.permissoes.join(", ")}</p>
            </div>
        \`;
    });
}

// =========================
// SECÇÃO: DOCUMENTAÇÃO OFICIAL
// =========================
function loadDocs(container) {
    container.innerHTML = "<h3>Documentação Oficial</h3>";

    container.innerHTML += \`
        <div class="section-card">
            <p>Inclui:</p>
            <ul>
                <li>Manual do Gestor</li>
                <li>Manual Técnico</li>
                <li>Guia de Instalação</li>
                <li>Guia de Atualizações</li>
            </ul>
        </div>
    \`;
}

// =========================
// SECÇÃO: MANUAL DO GESTOR
// =========================
function loadManualGestor(container) {
    container.innerHTML = "<h3>Manual do Gestor</h3>";

    container.innerHTML += \`
        <div class="section-card">
            <p>Conteúdos:</p>
            <ul>
                <li>Como criar condomínios</li>
                <li>Como gerir frações</li>
                <li>Como registar pagamentos</li>
                <li>Como enviar avisos</li>
                <li>Como usar o módulo IA</li>
            </ul>
        </div>
    \`;
}

// =========================
// SECÇÃO: MANUAL TÉCNICO
// =========================
function loadManualTecnico(container) {
    container.innerHTML = "<h3>Manual Técnico</h3>";

    container.innerHTML += \`
        <div class="section-card">
            <p>Inclui:</p>
            <ul>
                <li>Arquitetura da aplicação</li>
                <li>Estrutura dos módulos</li>
                <li>Endpoints do backend</li>
                <li>Segurança e tokens</li>
                <li>Deploy e infraestrutura</li>
            </ul>
        </div>
    \`;
}
`;

fs.writeFileSync(path.join(base, 'js', 'administrativo.js'), js);

// =========================
// PÁGINA PRINCIPAL
// =========================
const page = `
<!DOCTYPE html>
<html>
<head>
    <title>Estrutura Administrativa</title>
    <link rel="stylesheet" href="macroZ-administrativo/css/administrativo.css">
</head>
<body>
    ${html}
    <script src="macroZ-administrativo/js/administrativo.js"></script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'frontend', 'administrativo.html'), page);

console.log("Módulo Z (Estrutura Administrativa) criado com sucesso.");
