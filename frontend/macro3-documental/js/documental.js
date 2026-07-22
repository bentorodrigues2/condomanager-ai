
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
    const res = await fetch(`${backendURL}/documentos`, {
        headers: { "Authorization": localStorage.getItem("token") }
    });
    const data = await res.json();

    container.innerHTML = "<h3>Documentos</h3>";

    data.forEach(doc => {
        container.innerHTML += `
            <div class="section-card">
                <p><strong>Título:</strong> ${doc.titulo}</p>
                <p><strong>Tipo:</strong> ${doc.tipo}</p>
                <p><strong>Condomínio:</strong> ${doc.condominio}</p>
            </div>
        `;
    });
}

// =========================
// SECÇÃO: ASSEMBLEIAS
// =========================
async function loadAssembleias(container) {
    const res = await fetch(`${backendURL}/assembleias`, {
        headers: { "Authorization": localStorage.getItem("token") }
    });
    const data = await res.json();

    container.innerHTML = "<h3>Assembleias</h3>";

    data.forEach(a => {
        container.innerHTML += `
            <div class="section-card">
                <p><strong>Título:</strong> ${a.titulo}</p>
                <p><strong>Data:</strong> ${a.data}</p>
                <p><strong>Condomínio:</strong> ${a.condominio}</p>
            </div>
        `;
    });
}

// =========================
// SECÇÃO: ATAS
// =========================
async function loadAtas(container) {
    const res = await fetch(`${backendURL}/atas`, {
        headers: { "Authorization": localStorage.getItem("token") }
    });
    const data = await res.json();

    container.innerHTML = "<h3>Atas</h3>";

    data.forEach(ata => {
        container.innerHTML += `
            <div class="section-card">
                <p><strong>Assembleia:</strong> ${ata.assembleia}</p>
                <p><strong>Resumo:</strong> ${ata.resumo}</p>
                <p><strong>Data:</strong> ${ata.data}</p>
            </div>
        `;
    });
}

// =========================
// SECÇÃO: REGULAMENTOS
// =========================
async function loadRegulamentos(container) {
    const res = await fetch(`${backendURL}/regulamentos`, {
        headers: { "Authorization": localStorage.getItem("token") }
    });
    const data = await res.json();

    container.innerHTML = "<h3>Regulamentos</h3>";

    data.forEach(r => {
        container.innerHTML += `
            <div class="section-card">
                <p><strong>Título:</strong> ${r.titulo}</p>
                <p><strong>Condomínio:</strong> ${r.condominio}</p>
            </div>
        `;
    });
}

// =========================
// SECÇÃO: ARQUIVO DIGITAL
// =========================
async function loadArquivo(container) {
    const res = await fetch(`${backendURL}/arquivo`, {
        headers: { "Authorization": localStorage.getItem("token") }
    });
    const data = await res.json();

    container.innerHTML = "<h3>Arquivo Digital</h3>";

    data.forEach(f => {
        container.innerHTML += `
            <div class="section-card">
                <p><strong>Nome:</strong> ${f.nome}</p>
                <p><strong>Tipo:</strong> ${f.tipo}</p>
                <p><strong>Tamanho:</strong> ${f.tamanho} KB</p>
            </div>
        `;
    });
}

// =========================
// SECÇÃO: EXPORTAÇÕES
// =========================
async function loadExportacoes(container) {
    container.innerHTML = "<h3>Exportações</h3>";

    container.innerHTML += `
        <div class="section-card">
            <p>Exportação de documentos, assembleias, atas e regulamentos.</p>
            <p>Funcionalidade será ligada ao backend quando estiver pronto.</p>
        </div>
    `;
}
