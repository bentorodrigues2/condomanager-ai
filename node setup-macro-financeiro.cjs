const fs = require('fs');
const path = require('path');

// Base folder
const base = path.join(__dirname, 'frontend', 'macro3-documental');

fs.mkdirSync(base, { recursive: true });
fs.mkdirSync(path.join(base, 'css'), { recursive: true });
fs.mkdirSync(path.join(base, 'js'), { recursive: true });

// =========================
// HTML — MACRO MÓDULO DOCUMENTAL
// =========================
const html = `
<div id="documental-wrapper">
    <h2>Módulo Documental</h2>

    <div id="documental-menu">
        <button onclick="loadSection('documentos')">Documentos</button>
        <button onclick="loadSection('assembleias')">Assembleias</button>
        <button onclick="loadSection('atas')">Atas</button>
        <button onclick="loadSection('regulamentos')">Regulamentos</button>
        <button onclick="loadSection('arquivo')">Arquivo Digital</button>
        <button onclick="loadSection('exportacoes')">Exportações</button>
    </div>

    <div id="documental-content">
        <p>Selecione uma secção.</p>
    </div>
</div>
`;

fs.writeFileSync(path.join(base, 'documental.html'), html);

// =========================
// CSS
// =========================
const css = `
#documental-wrapper {
    padding: 40px;
    color: white;
}

#documental-menu {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 30px;
}

#documental-menu button {
    background: #aa00ff;
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

fs.writeFileSync(path.join(base, 'css', 'documental.css'), css);

// =========================
// JS — MACRO MÓDULO DOCUMENTAL
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
    const content = document.getElementById("documental-content");

    switch(section) {
        case "documentos":
            loadDocumentos(content);
            break;
        case "assembleias":
            loadAssembleias(content);
            break;
        case "atas":
            loadAtas(content);
            break;
        case "regulamentos":
            loadRegulamentos(content);
            break;
        case "arquivo":
            loadArquivo(content);
            break;
        case "exportacoes":
            loadExportacoes(content);
            break;
        default:
            content.innerHTML = "<p>Secção inválida.</p>";
    }
}

// =========================
// SECÇÃO: DOCUMENTOS
// =========================
async function loadDocumentos(container) {
    const res = await fetch(\`\${backendURL}/documentos\`, {
        headers: { "Authorization": localStorage.getItem("token") }
    });
    const data = await res.json();

    container.innerHTML = "<h3>Documentos</h3>";

    data.forEach(doc => {
        container.innerHTML += \`
            <div class="section-card">
                <p><strong>Título:</strong> \${doc.titulo}</p>
                <p><strong>Tipo:</strong> \${doc.tipo}</p>
                <p><strong>Condomínio:</strong> \${doc.condominio}</p>
            </div>
        \`;
    });
}

// =========================
// SECÇÃO: ASSEMBLEIAS
// =========================
async function loadAssembleias(container) {
    const res = await fetch(\`\${backendURL}/assembleias\`, {
        headers: { "Authorization": localStorage.getItem("token") }
    });
    const data = await res.json();

    container.innerHTML = "<h3>Assembleias</h3>";

    data.forEach(a => {
        container.innerHTML += \`
            <div class="section-card">
                <p><strong>Título:</strong> \${a.titulo}</p>
                <p><strong>Data:</strong> \${a.data}</p>
                <p><strong>Condomínio:</strong> \${a.condominio}</p>
            </div>
        \`;
    });
}

// =========================
// SECÇÃO: ATAS
// =========================
async function loadAtas(container) {
    const res = await fetch(\`\${backendURL}/atas\`, {
        headers: { "Authorization": localStorage.getItem("token") }
    });
    const data = await res.json();

    container.innerHTML = "<h3>Atas</h3>";

    data.forEach(ata => {
        container.innerHTML += \`
            <div class="section-card">
                <p><strong>Assembleia:</strong> \${ata.assembleia}</p>
                <p><strong>Resumo:</strong> \${ata.resumo}</p>
                <p><strong>Data:</strong> \${ata.data}</p>
            </div>
        \`;
    });
}

// =========================
// SECÇÃO: REGULAMENTOS
// =========================
async function loadRegulamentos(container) {
    const res = await fetch(\`\${backendURL}/regulamentos\`, {
        headers: { "Authorization": localStorage.getItem("token") }
    });
    const data = await res.json();

    container.innerHTML = "<h3>Regulamentos</h3>";

    data.forEach(r => {
        container.innerHTML += \`
            <div class="section-card">
                <p><strong>Título:</strong> \${r.titulo}</p>
                <p><strong>Condomínio:</strong> \${r.condominio}</p>
            </div>
        \`;
    });
}

// =========================
// SECÇÃO: ARQUIVO DIGITAL
// =========================
async function loadArquivo(container) {
    const res = await fetch(\`\${backendURL}/arquivo\`, {
        headers: { "Authorization": localStorage.getItem("token") }
    });
    const data = await res.json();

    container.innerHTML = "<h3>Arquivo Digital</h3>";

    data.forEach(f => {
        container.innerHTML += \`
            <div class="section-card">
                <p><strong>Nome:</strong> \${f.nome}</p>
                <p><strong>Tipo:</strong> \${f.tipo}</p>
                <p><strong>Tamanho:</strong> \${f.tamanho} KB</p>
            </div>
        \`;
    });
}

// =========================
// SECÇÃO: EXPORTAÇÕES
// =========================
async function loadExportacoes(container) {
    container.innerHTML = "<h3>Exportações</h3>";

    container.innerHTML += \`
        <div class="section-card">
            <p>Exportação de documentos, assembleias, atas e regulamentos.</p>
            <p>Funcionalidade será ligada ao backend quando estiver pronto.</p>
        </div>
    \`;
}
`;

fs.writeFileSync(path.join(base, 'js', 'documental.js'), js);

// =========================
// PÁGINA PRINCIPAL
// =========================
const page = `
<!DOCTYPE html>
<html>
<head>
    <title>Módulo Documental</title>
    <link rel="stylesheet" href="macro3-documental/css/documental.css">
</head>
<body>
    ${html}
    <script src="macro3-documental/js/documental.js"></script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'frontend', 'documental.html'), page);

console.log("Macro-Módulo 3 (Documental) criado com sucesso.");
