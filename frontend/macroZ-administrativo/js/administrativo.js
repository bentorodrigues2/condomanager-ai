
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

    container.innerHTML += `
        <div class="section-card">
            <p>Perfis disponíveis:</p>
            <ul>
                <li><strong>Administrador</strong> — acesso total</li>
                <li><strong>Gestor</strong> — gestão de condomínios</li>
                <li><strong>Condómino</strong> — acesso à sua fração</li>
                <li><strong>Visitante</strong> — acesso limitado</li>
            </ul>
        </div>
    `;
}

// =========================
// SECÇÃO: GESTÃO DE ROLES
// =========================
async function loadRoles(container) {
    const res = await fetch(`${backendURL}/roles`, {
        headers: { "Authorization": localStorage.getItem("token") }
    });
    const data = await res.json();

    container.innerHTML = "<h3>Gestão de Perfis</h3>";

    data.forEach(r => {
        container.innerHTML += `
            <div class="section-card">
                <p><strong>Utilizador:</strong> ${r.utilizador}</p>
                <p><strong>Perfil:</strong> ${r.role}</p>
                <p><strong>Permissões:</strong> ${r.permissoes.join(", ")}</p>
            </div>
        `;
    });
}

// =========================
// SECÇÃO: DOCUMENTAÇÃO OFICIAL
// =========================
function loadDocs(container) {
    container.innerHTML = "<h3>Documentação Oficial</h3>";

    container.innerHTML += `
        <div class="section-card">
            <p>Inclui:</p>
            <ul>
                <li>Manual do Gestor</li>
                <li>Manual Técnico</li>
                <li>Guia de Instalação</li>
                <li>Guia de Atualizações</li>
            </ul>
        </div>
    `;
}

// =========================
// SECÇÃO: MANUAL DO GESTOR
// =========================
function loadManualGestor(container) {
    container.innerHTML = "<h3>Manual do Gestor</h3>";

    container.innerHTML += `
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
    `;
}

// =========================
// SECÇÃO: MANUAL TÉCNICO
// =========================
function loadManualTecnico(container) {
    container.innerHTML = "<h3>Manual Técnico</h3>";

    container.innerHTML += `
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
    `;
}
