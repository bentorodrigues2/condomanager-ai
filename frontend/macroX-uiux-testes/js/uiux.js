
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
    const content = document.getElementById("uiux-content");

    switch(section) {
        case "uiux":
            loadUIUX(content);
            break;
        case "responsivo":
            loadResponsivo(content);
            break;
        case "testes":
            loadTestes(content);
            break;
        case "fluxos":
            loadFluxos(content);
            break;
        case "validacao":
            loadValidacao(content);
            break;
        default:
            content.innerHTML = "<p>Secção inválida.</p>";
    }
}

// =========================
// SECÇÃO: UI/UX FINAL
// =========================
function loadUIUX(container) {
    container.innerHTML = "<h3>Melhorias UI/UX</h3>";

    container.innerHTML += `
        <div class="section-card">
            <p>Este módulo aplica melhorias visuais globais:</p>
            <ul>
                <li>Consistência de botões</li>
                <li>Espaçamentos uniformes</li>
                <li>Tipografia otimizada</li>
                <li>Transições suaves</li>
                <li>Componentes reutilizáveis</li>
            </ul>
        </div>
    `;
}

// =========================
// SECÇÃO: RESPONSIVIDADE
// =========================
function loadResponsivo(container) {
    container.innerHTML = "<h3>Responsividade</h3>";

    container.innerHTML += `
        <div class="section-card">
            <p>Inclui:</p>
            <ul>
                <li>Layout adaptado a mobile</li>
                <li>Breakpoints para tablets</li>
                <li>Componentes fluidos</li>
                <li>Botões adaptáveis</li>
            </ul>
        </div>
    `;
}

// =========================
// SECÇÃO: TESTES REAIS
// =========================
async function loadTestes(container) {
    container.innerHTML = "<h3>Testes Reais</h3>";

    container.innerHTML += `
        <div class="section-card">
            <p>Testes com dados reais:</p>
            <ul>
                <li>Condomínios reais</li>
                <li>Frações reais</li>
                <li>Pagamentos reais</li>
                <li>Assembleias reais</li>
            </ul>
        </div>
    `;
}

// =========================
// SECÇÃO: TESTES DE FLUXOS
// =========================
function loadFluxos(container) {
    container.innerHTML = "<h3>Testes de Fluxos</h3>";

    container.innerHTML += `
        <div class="section-card">
            <p>Fluxos testados:</p>
            <ul>
                <li>Login → Dashboard → Módulos</li>
                <li>Operacional → Ocorrências → Auditoria</li>
                <li>Financeiro → Pagamentos → Exportações</li>
                <li>Documental → Assembleias → Atas</li>
                <li>Comunicação → Alertas → IA</li>
            </ul>
        </div>
    `;
}

// =========================
// SECÇÃO: VALIDAÇÃO FINAL
// =========================
function loadValidacao(container) {
    container.innerHTML = "<h3>Validação Final</h3>";

    container.innerHTML += `
        <div class="section-card">
            <p>Checklist final:</p>
            <ul>
                <li>Todos os módulos abrem sem erros</li>
                <li>Todos os endpoints respondem</li>
                <li>Tokens válidos e renováveis</li>
                <li>UI consistente</li>
                <li>Responsividade funcional</li>
            </ul>
        </div>
    `;
}
