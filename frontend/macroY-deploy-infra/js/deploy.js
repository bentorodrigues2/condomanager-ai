
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
    const content = document.getElementById("deploy-content");

    switch(section) {
        case "deploy":
            loadDeploy(content);
            break;
        case "variaveis":
            loadVariaveis(content);
            break;
        case "otimizacao":
            loadOtimizacao(content);
            break;
        case "auditoria":
            loadAuditoria(content);
            break;
        case "logs":
            loadLogs(content);
            break;
        case "historico":
            loadHistorico(content);
            break;
        default:
            content.innerHTML = "<p>Secção inválida.</p>";
    }
}

// =========================
// SECÇÃO: DEPLOY FINAL
// =========================
function loadDeploy(container) {
    container.innerHTML = "<h3>Deploy Final</h3>";

    container.innerHTML += `
        <div class="section-card">
            <p>Checklist de deploy:</p>
            <ul>
                <li>Build otimizado</li>
                <li>Minificação de CSS/JS</li>
                <li>Remoção de debug logs</li>
                <li>Configuração de ambiente</li>
                <li>Ligação ao backend Render</li>
                <li>Preparação para domínio próprio</li>
            </ul>
        </div>
    `;
}

// =========================
// SECÇÃO: VARIÁVEIS DE AMBIENTE
// =========================
function loadVariaveis(container) {
    container.innerHTML = "<h3>Variáveis de Ambiente</h3>";

    container.innerHTML += `
        <div class="section-card">
            <p>Variáveis necessárias:</p>
            <ul>
                <li>BACKEND_URL</li>
                <li>JWT_SECRET</li>
                <li>REFRESH_SECRET</li>
                <li>EMAIL_API_KEY</li>
                <li>SMS_API_KEY</li>
            </ul>
        </div>
    `;
}

// =========================
// SECÇÃO: OTIMIZAÇÃO DE BUILD
// =========================
function loadOtimizacao(container) {
    container.innerHTML = "<h3>Otimização de Build</h3>";

    container.innerHTML += `
        <div class="section-card">
            <p>Inclui:</p>
            <ul>
                <li>Compressão GZIP</li>
                <li>Cache inteligente</li>
                <li>Lazy loading</li>
                <li>Remoção de assets não usados</li>
                <li>Pré-carregamento de módulos críticos</li>
            </ul>
        </div>
    `;
}

// =========================
// SECÇÃO: AUDITORIA AVANÇADA
// =========================
function loadAuditoria(container) {
    container.innerHTML = "<h3>Auditoria Avançada</h3>";

    container.innerHTML += `
        <div class="section-card">
            <p>Auditoria inclui:</p>
            <ul>
                <li>Registo de ações sensíveis</li>
                <li>Alterações de dados</li>
                <li>Criação e remoção de entidades</li>
                <li>Falhas de autenticação</li>
                <li>Erros de backend</li>
            </ul>
        </div>
    `;
}

// =========================
// SECÇÃO: LOGS
// =========================
async function loadLogs(container) {
    container.innerHTML = "<h3>Logs & Monitorização</h3>";

    container.innerHTML += `
        <div class="section-card">
            <p>Logs disponíveis:</p>
            <ul>
                <li>Logs de erro</li>
                <li>Logs de acesso</li>
                <li>Logs de operações</li>
            </ul>
        </div>
    `;
}

// =========================
// SECÇÃO: HISTÓRICO DE ACESSOS
// =========================
async function loadHistorico(container) {
    container.innerHTML = "<h3>Histórico de Acessos</h3>";

    container.innerHTML += `
        <div class="section-card">
            <p>Inclui:</p>
            <ul>
                <li>IP de acesso</li>
                <li>Data e hora</li>
                <li>Utilizador</li>
                <li>Origem</li>
            </ul>
        </div>
    `;
}
