
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

    container.innerHTML += `
        <div class="section-card">
            <p>A aplicação já suporta:</p>
            <ul>
                <li>Manifest.json</li>
                <li>Service Worker</li>
                <li>Instalação como App</li>
                <li>Cache offline</li>
            </ul>
        </div>
    `;
}

// =========================
// SECÇÃO: MULTI-CONDOMÍNIOS
// =========================
async function loadMulti(container) {
    const res = await fetch(`${backendURL}/multi-condominios`, {
        headers: { "Authorization": localStorage.getItem("token") }
    });
    const data = await res.json();

    container.innerHTML = "<h3>Multi-Condomínios</h3>";

    data.forEach(c => {
        container.innerHTML += `
            <div class="section-card">
                <p><strong>${c.nome}</strong></p>
                <p>Morada: ${c.morada}</p>
                <p>Gestor: ${c.gestor}</p>
            </div>
        `;
    });
}

// =========================
// SECÇÃO: EXPORTAÇÕES
// =========================
function loadExportar(container) {
    container.innerHTML = "<h3>Exportações</h3>";

    container.innerHTML += `
        <div class="section-card">
            <p>Exportar dados para:</p>
            <ul>
                <li>PDF</li>
                <li>Excel</li>
                <li>ZIP</li>
            </ul>
            <p>Será ligado ao backend quando o motor de exportação estiver pronto.</p>
        </div>
    `;
}

// =========================
// SECÇÃO: OTIMIZAÇÕES VISUAIS
// =========================
function loadVisual(container) {
    container.innerHTML = "<h3>Otimizações Visuais</h3>";

    container.innerHTML += `
        <div class="section-card">
            <p>Inclui:</p>
            <ul>
                <li>Layout responsivo</li>
                <li>Melhorias de UI</li>
                <li>Transições suaves</li>
                <li>Componentes reutilizáveis</li>
            </ul>
        </div>
    `;
}

// =========================
// SECÇÃO: AUTOMAÇÃO IA AVANÇADA
// =========================
async function loadIAAuto(container) {
    const res = await fetch(`${backendURL}/ia/automacao`, {
        headers: { "Authorization": localStorage.getItem("token") }
    });
    const data = await res.json();

    container.innerHTML = "<h3>Automação IA Avançada</h3>";

    data.forEach(a => {
        container.innerHTML += `
            <div class="section-card">
                <p><strong>Regra:</strong> ${a.regra}</p>
                <p><strong>Ação:</strong> ${a.acao}</p>
            </div>
        `;
    });
}

// =========================
// SECÇÃO: FUNCIONALIDADES PRO
// =========================
function loadPro(container) {
    container.innerHTML = "<h3>Funcionalidades PRO</h3>";

    container.innerHTML += `
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
    `;
}
