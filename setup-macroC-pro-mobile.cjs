const fs = require('fs');
const path = require('path');

// Base folder
const base = path.join(__dirname, 'frontend', 'macroC-pro-mobile');

fs.mkdirSync(base, { recursive: true });
fs.mkdirSync(path.join(base, 'css'), { recursive: true });
fs.mkdirSync(path.join(base, 'js'), { recursive: true });
fs.mkdirSync(path.join(base, 'pwa'), { recursive: true });

// =========================
// HTML — MÓDULO C (PRO + MOBILE + MULTI)
// =========================
const html = `
<div id="pro-wrapper">
    <h2>Expansão PRO & Mobile</h2>

    <div id="pro-menu">
        <button onclick="loadSection('mobile')">Versão Mobile (PWA)</button>
        <button onclick="loadSection('multi')">Multi-Condomínios</button>
        <button onclick="loadSection('exportar')">Exportações</button>
        <button onclick="loadSection('visual')">Otimizações Visuais</button>
        <button onclick="loadSection('ia-auto')">Automação IA Avançada</button>
        <button onclick="loadSection('pro')">Funcionalidades PRO</button>
    </div>

    <div id="pro-content">
        <p>Selecione uma secção.</p>
    </div>
</div>
`;

fs.writeFileSync(path.join(base, 'pro.html'), html);

// =========================
// CSS — LAYOUT
// =========================
const css = `
#pro-wrapper {
    padding: 40px;
    color: white;
}

#pro-menu {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 30px;
}

#pro-menu button {
    background: #00aa55;
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

fs.writeFileSync(path.join(base, 'css', 'pro.css'), css);

// =========================
// JS — MÓDULO C
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
    const content = document.getElementById("pro-content");

    switch(section) {
        case "mobile":
            loadMobile(content);
            break;
        case "multi":
            loadMulti(content);
            break;
        case "exportar":
            loadExportar(content);
            break;
        case "visual":
            loadVisual(content);
            break;
        case "ia-auto":
            loadIAAuto(content);
            break;
        case "pro":
            loadPro(content);
            break;
        default:
            content.innerHTML = "<p>Secção inválida.</p>";
    }
}

// =========================
// SECÇÃO: MOBILE (PWA)
// =========================
function loadMobile(container) {
    container.innerHTML = "<h3>Versão Mobile (PWA)</h3>";

    container.innerHTML += \`
        <div class="section-card">
            <p>A aplicação já suporta:</p>
            <ul>
                <li>Manifest.json</li>
                <li>Service Worker</li>
                <li>Instalação como App</li>
                <li>Cache offline</li>
            </ul>
        </div>
    \`;
}

// =========================
// SECÇÃO: MULTI-CONDOMÍNIOS
// =========================
async function loadMulti(container) {
    const res = await fetch(\`\${backendURL}/multi-condominios\`, {
        headers: { "Authorization": localStorage.getItem("token") }
    });
    const data = await res.json();

    container.innerHTML = "<h3>Multi-Condomínios</h3>";

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
// SECÇÃO: EXPORTAÇÕES
// =========================
function loadExportar(container) {
    container.innerHTML = "<h3>Exportações</h3>";

    container.innerHTML += \`
        <div class="section-card">
            <p>Exportar dados para:</p>
            <ul>
                <li>PDF</li>
                <li>Excel</li>
                <li>ZIP</li>
            </ul>
            <p>Será ligado ao backend quando o motor de exportação estiver pronto.</p>
        </div>
    \`;
}

// =========================
// SECÇÃO: OTIMIZAÇÕES VISUAIS
// =========================
function loadVisual(container) {
    container.innerHTML = "<h3>Otimizações Visuais</h3>";

    container.innerHTML += \`
        <div class="section-card">
            <p>Inclui:</p>
            <ul>
                <li>Layout responsivo</li>
                <li>Melhorias de UI</li>
                <li>Transições suaves</li>
                <li>Componentes reutilizáveis</li>
            </ul>
        </div>
    \`;
}

// =========================
// SECÇÃO: AUTOMAÇÃO IA AVANÇADA
// =========================
async function loadIAAuto(container) {
    const res = await fetch(\`\${backendURL}/ia/automacao\`, {
        headers: { "Authorization": localStorage.getItem("token") }
    });
    const data = await res.json();

    container.innerHTML = "<h3>Automação IA Avançada</h3>";

    data.forEach(a => {
        container.innerHTML += \`
            <div class="section-card">
                <p><strong>Regra:</strong> \${a.regra}</p>
                <p><strong>Ação:</strong> \${a.acao}</p>
            </div>
        \`;
    });
}

// =========================
// SECÇÃO: FUNCIONALIDADES PRO
// =========================
function loadPro(container) {
    container.innerHTML = "<h3>Funcionalidades PRO</h3>";

    container.innerHTML += \`
        <div class="section-card">
            <p>Inclui:</p>
            <ul>
                <li>Relatórios avançados</li>
                <li>Previsões IA</li>
                <li>Gestão multi-condomínios</li>
                <li>Exportações profissionais</li>
                <li>Automação total</li>
            </ul>
        </div>
    \`;
}
`;

fs.writeFileSync(path.join(base, 'js', 'pro.js'), js);

// =========================
// PWA FILES
// =========================
const manifest = `
{
    "name": "CondoManager-AI",
    "short_name": "CondoManager",
    "start_url": "/estrutura.html",
    "display": "standalone",
    "background_color": "#111",
    "theme_color": "#0077ff",
    "icons": []
}
`;

fs.writeFileSync(path.join(base, 'pwa', 'manifest.json'), manifest);

const sw = `
self.addEventListener('install', () => {
    console.log("Service Worker instalado.");
});

self.addEventListener('fetch', () => {});
`;

fs.writeFileSync(path.join(base, 'pwa', 'service-worker.js'), sw);

// =========================
// PÁGINA PRINCIPAL
// =========================
const page = `
<!DOCTYPE html>
<html>
<head>
    <title>Expansão PRO & Mobile</title>
    <link rel="stylesheet" href="macroC-pro-mobile/css/pro.css">
    <link rel="manifest" href="macroC-pro-mobile/pwa/manifest.json">
</head>
<body>
    ${html}
    <script src="macroC-pro-mobile/js/pro.js"></script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'frontend', 'pro.html'), page);

console.log("Módulo C (Expansão PRO & Mobile) criado com sucesso.");
