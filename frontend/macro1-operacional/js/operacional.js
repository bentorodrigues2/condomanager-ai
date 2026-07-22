
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
    const res = await fetch(`${backendURL}/condominios`, {
        headers: { "Authorization": localStorage.getItem("token") }
    });
    const data = await res.json();

    container.innerHTML = "<h3>Condomínios</h3>";

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
// SECÇÃO: FRAÇÕES
// =========================
async function loadFracoes(container) {
    const res = await fetch(`${backendURL}/fracoes`, {
        headers: { "Authorization": localStorage.getItem("token") }
    });
    const data = await res.json();

    container.innerHTML = "<h3>Frações</h3>";

    data.forEach(f => {
        container.innerHTML += `
            <div class="section-card">
                <p><strong>Fração ${f.numero}</strong></p>
                <p>Tipologia: ${f.tipologia}</p>
                <p>Proprietário: ${f.proprietario}</p>
            </div>
        `;
    });
}

// =========================
// SECÇÃO: CONDÓMINOS
// =========================
async function loadCondominos(container) {
    const res = await fetch(`${backendURL}/condominos`, {
        headers: { "Authorization": localStorage.getItem("token") }
    });
    const data = await res.json();

    container.innerHTML = "<h3>Condóminos</h3>";

    data.forEach(p => {
        container.innerHTML += `
            <div class="section-card">
                <p><strong>${p.nome}</strong></p>
                <p>Email: ${p.email}</p>
                <p>Fração: ${p.fracao}</p>
            </div>
        `;
    });
}

// =========================
// SECÇÃO: OCORRÊNCIAS
// =========================
async function loadOcorrencias(container) {
    const res = await fetch(`${backendURL}/ocorrencias`, {
        headers: { "Authorization": localStorage.getItem("token") }
    });
    const data = await res.json();

    container.innerHTML = "<h3>Ocorrências</h3>";

    data.forEach(o => {
        container.innerHTML += `
            <div class="section-card">
                <p><strong>${o.titulo}</strong></p>
                <p>${o.descricao}</p>
                <p>Estado: ${o.estado}</p>
            </div>
        `;
    });
}

// =========================
// SECÇÃO: TAREFAS
// =========================
async function loadTarefas(container) {
    const res = await fetch(`${backendURL}/tarefas`, {
        headers: { "Authorization": localStorage.getItem("token") }
    });
    const data = await res.json();

    container.innerHTML = "<h3>Tarefas</h3>";

    data.forEach(t => {
        container.innerHTML += `
            <div class="section-card">
                <p><strong>${t.titulo}</strong></p>
                <p>${t.descricao}</p>
                <p>Estado: ${t.estado}</p>
            </div>
        `;
    });
}

// =========================
// SECÇÃO: AUDITORIA
// =========================
async function loadAuditoria(container) {
    const res = await fetch(`${backendURL}/auditoria`, {
        headers: { "Authorization": localStorage.getItem("token") }
    });
    const data = await res.json();

    container.innerHTML = "<h3>Auditoria</h3>";

    data.forEach(a => {
        container.innerHTML += `
            <div class="section-card">
                <p><strong>Ação:</strong> ${a.acao}</p>
                <p>Utilizador: ${a.utilizador}</p>
                <p>Data: ${a.data}</p>
            </div>
        `;
    });
}

// =========================
// SECÇÃO: NOTIFICAÇÕES
// =========================
async function loadNotificacoes(container) {
    const res = await fetch(`${backendURL}/notificacoes`, {
        headers: { "Authorization": localStorage.getItem("token") }
    });
    const data = await res.json();

    container.innerHTML = "<h3>Notificações</h3>";

    data.forEach(n => {
        container.innerHTML += `
            <div class="section-card">
                <p><strong>${n.titulo}</strong></p>
                <p>${n.mensagem}</p>
                <p>Tipo: ${n.tipo}</p>
                <p>Estado: ${n.lida ? "Lida" : "Não Lida"}</p>
            </div>
        `;
    });
}
