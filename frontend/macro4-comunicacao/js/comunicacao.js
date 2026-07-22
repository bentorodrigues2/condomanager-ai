
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
    const content = document.getElementById("comunicacao-content");

    switch(section) {
        case "notificacoes":
            loadNotificacoes(content);
            break;
        case "alertas":
            loadAlertas(content);
            break;
        case "mensagens":
            loadMensagens(content);
            break;
        case "avisos":
            loadAvisos(content);
            break;
        case "pagamentos":
            loadAlertasPagamento(content);
            break;
        case "envios":
            loadEnvios(content);
            break;
        default:
            content.innerHTML = "<p>Secção inválida.</p>";
    }
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

// =========================
// SECÇÃO: ALERTAS AUTOMÁTICOS
// =========================
async function loadAlertas(container) {
    const res = await fetch(`${backendURL}/alertas`, {
        headers: { "Authorization": localStorage.getItem("token") }
    });
    const data = await res.json();

    container.innerHTML = "<h3>Alertas Automáticos</h3>";

    data.forEach(a => {
        container.innerHTML += `
            <div class="section-card">
                <p><strong>Tipo:</strong> ${a.tipo}</p>
                <p><strong>Mensagem:</strong> ${a.mensagem}</p>
                <p><strong>Estado:</strong> ${a.estado}</p>
            </div>
        `;
    });
}

// =========================
// SECÇÃO: MENSAGENS INTERNAS
// =========================
async function loadMensagens(container) {
    const res = await fetch(`${backendURL}/mensagens`, {
        headers: { "Authorization": localStorage.getItem("token") }
    });
    const data = await res.json();

    container.innerHTML = "<h3>Mensagens Internas</h3>";

    data.forEach(m => {
        container.innerHTML += `
            <div class="section-card">
                <p><strong>De:</strong> ${m.de}</p>
                <p><strong>Para:</strong> ${m.para}</p>
                <p>${m.mensagem}</p>
            </div>
        `;
    });
}

// =========================
// SECÇÃO: AVISOS DE ASSEMBLEIA
// =========================
async function loadAvisos(container) {
    const res = await fetch(`${backendURL}/avisos`, {
        headers: { "Authorization": localStorage.getItem("token") }
    });
    const data = await res.json();

    container.innerHTML = "<h3>Avisos de Assembleia</h3>";

    data.forEach(a => {
        container.innerHTML += `
            <div class="section-card">
                <p><strong>Condomínio:</strong> ${a.condominio}</p>
                <p><strong>Data:</strong> ${a.data}</p>
                <p><strong>Mensagem:</strong> ${a.mensagem}</p>
            </div>
        `;
    });
}

// =========================
// SECÇÃO: ALERTAS DE PAGAMENTO
// =========================
async function loadAlertasPagamento(container) {
    const res = await fetch(`${backendURL}/alertas-pagamento`, {
        headers: { "Authorization": localStorage.getItem("token") }
    });
    const data = await res.json();

    container.innerHTML = "<h3>Alertas de Pagamento</h3>";

    data.forEach(p => {
        container.innerHTML += `
            <div class="section-card">
                <p><strong>Condomínio:</strong> ${p.condominio}</p>
                <p><strong>Fração:</strong> ${p.fracao}</p>
                <p><strong>Mensagem:</strong> ${p.mensagem}</p>
            </div>
        `;
    });
}

// =========================
// SECÇÃO: ENVIO POR EMAIL/SMS
// =========================
function loadEnvios(container) {
    container.innerHTML = "<h3>Envio por Email/SMS</h3>";

    container.innerHTML += `
        <div class="section-card">
            <p>Esta secção permitirá enviar emails e SMS diretamente do sistema.</p>
            <p>Será ligada ao backend quando o serviço de envio estiver disponível.</p>
        </div>
    `;
}
