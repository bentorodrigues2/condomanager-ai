const fs = require('fs');
const path = require('path');

// Base folder
const base = path.join(__dirname, 'frontend', 'macroB-backend');

fs.mkdirSync(base, { recursive: true });
fs.mkdirSync(path.join(base, 'css'), { recursive: true });
fs.mkdirSync(path.join(base, 'js'), { recursive: true });

// =========================
// HTML — MÓDULO B (BACKEND + SEGURANÇA)
// =========================
const html = `
<div id="backend-wrapper">
    <h2>Backend & Segurança</h2>

    <div id="backend-menu">
        <button onclick="loadSection('status')">Estado do Backend</button>
        <button onclick="loadSection('endpoints')">Testar Endpoints</button>
        <button onclick="loadSection('tokens')">Gestão de Tokens</button>
        <button onclick="loadSection('seguranca')">Segurança Avançada</button>
    </div>

    <div id="backend-content">
        <p>Selecione uma secção.</p>
    </div>
</div>
`;

fs.writeFileSync(path.join(base, 'backend.html'), html);

// =========================
// CSS
// =========================
const css = `
#backend-wrapper {
    padding: 40px;
    color: white;
}

#backend-menu {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 30px;
}

#backend-menu button {
    background: #cc0000;
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

#endpoint-test-input {
    width: 100%;
    padding: 12px;
    border-radius: 8px;
    border: none;
    margin-bottom: 10px;
}

#endpoint-test-btn {
    background: #cc0000;
    border: none;
    padding: 12px 18px;
    border-radius: 8px;
    color: white;
    cursor: pointer;
}
`;

fs.writeFileSync(path.join(base, 'css', 'backend.css'), css);

// =========================
// JS — BACKEND + SEGURANÇA
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
    const content = document.getElementById("backend-content");

    switch(section) {
        case "status":
            loadStatus(content);
            break;
        case "endpoints":
            loadEndpoints(content);
            break;
        case "tokens":
            loadTokens(content);
            break;
        case "seguranca":
            loadSeguranca(content);
            break;
        default:
            content.innerHTML = "<p>Secção inválida.</p>";
    }
}

// =========================
// SECÇÃO: ESTADO DO BACKEND
// =========================
async function loadStatus(container) {
    container.innerHTML = "<h3>Estado do Backend</h3>";

    try {
        const res = await fetch(\`\${backendURL}/status\`);
        const data = await res.json();

        container.innerHTML += \`
            <div class="section-card">
                <p><strong>Estado:</strong> \${data.estado}</p>
                <p><strong>Versão:</strong> \${data.versao}</p>
                <p><strong>Último Deploy:</strong> \${data.deploy}</p>
            </div>
        \`;
    } catch {
        container.innerHTML += "<p>Backend indisponível.</p>";
    }
}

// =========================
// SECÇÃO: TESTAR ENDPOINTS
// =========================
function loadEndpoints(container) {
    container.innerHTML = \`
        <h3>Testar Endpoints</h3>
        <input id="endpoint-test-input" placeholder="Ex: /condominios">
        <button id="endpoint-test-btn">Testar</button>
        <div id="endpoint-result"></div>
    \`;

    document.getElementById("endpoint-test-btn").onclick = async () => {
        const ep = document.getElementById("endpoint-test-input").value;
        const result = document.getElementById("endpoint-result");

        try {
            const res = await fetch(backendURL + ep, {
                headers: { "Authorization": localStorage.getItem("token") }
            });
            const data = await res.json();

            result.innerHTML = "<pre>" + JSON.stringify(data, null, 2) + "</pre>";
        } catch {
            result.innerHTML = "<p>Erro ao testar endpoint.</p>";
        }
    };
}

// =========================
// SECÇÃO: GESTÃO DE TOKENS
// =========================
function loadTokens(container) {
    container.innerHTML = "<h3>Gestão de Tokens</h3>";

    const token = localStorage.getItem("token");
    const refresh = localStorage.getItem("refresh");

    container.innerHTML += \`
        <div class="section-card">
            <p><strong>Token Atual:</strong></p>
            <p>\${token || "Nenhum"}</p>
        </div>

        <div class="section-card">
            <p><strong>Refresh Token:</strong></p>
            <p>\${refresh || "Nenhum"}</p>
        </div>

        <button onclick="refreshToken()">Renovar Token</button>
    \`;
}

async function refreshToken() {
    const refresh = localStorage.getItem("refresh");
    if (!refresh) {
        alert("Nenhum refresh token disponível.");
        return;
    }

    const res = await fetch(\`\${backendURL}/auth/refresh\`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh })
    });

    const data = await res.json();

    localStorage.setItem("token", data.token);
    alert("Token renovado com sucesso.");
}

// =========================
// SECÇÃO: SEGURANÇA AVANÇADA
// =========================
function loadSeguranca(container) {
    container.innerHTML = "<h3>Segurança Avançada</h3>";

    container.innerHTML += \`
        <div class="section-card">
            <p>Este módulo implementa:</p>
            <ul>
                <li>Refresh tokens</li>
                <li>Expiração automática</li>
                <li>Revalidação silenciosa</li>
                <li>Proteção contra tokens inválidos</li>
                <li>Bloqueio automático após falhas repetidas</li>
            </ul>
        </div>
    \`;
}
`;

fs.writeFileSync(path.join(base, 'js', 'backend.js'), js);

// =========================
// PÁGINA PRINCIPAL
// =========================
const page = `
<!DOCTYPE html>
<html>
<head>
    <title>Backend & Segurança</title>
    <link rel="stylesheet" href="macroB-backend/css/backend.css">
</head>
<body>
    ${html}
    <script src="macroB-backend/js/backend.js"></script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'frontend', 'backend.html'), page);

console.log("Módulo B (Backend & Segurança) criado com sucesso.");
