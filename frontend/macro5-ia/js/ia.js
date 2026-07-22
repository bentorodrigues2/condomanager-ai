
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
    const content = document.getElementById("ia-content");

    switch(section) {
        case "chat":
            loadChat(content);
            break;
        case "resumos":
            loadResumos(content);
            break;
        case "sugestoes":
            loadSugestoes(content);
            break;
        case "documentos":
            loadGeracaoDocumentos(content);
            break;
        case "previsoes":
            loadPrevisoes(content);
            break;
        case "automacao":
            loadAutomacao(content);
            break;
        default:
            content.innerHTML = "<p>Secção inválida.</p>";
    }
}

// =========================
// SECÇÃO: CHAT IA
// =========================
function loadChat(container) {
    container.innerHTML = `
        <h3>Chat com Assistente IA</h3>
        <div id="ia-chat-box"></div>
        <input id="ia-input" placeholder="Escreva aqui...">
        <button id="ia-send">Enviar</button>
    `;

    document.getElementById("ia-send").onclick = async () => {
        const msg = document.getElementById("ia-input").value;
        if (!msg) return;

        const box = document.getElementById("ia-chat-box");
        box.innerHTML += "<p><strong>Você:</strong> " + msg + "</p>";

        const res = await fetch(`${backendURL}/ia/chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            },
            body: JSON.stringify({ mensagem: msg })
        });

        const data = await res.json();
        box.innerHTML += "<p><strong>IA:</strong> " + data.resposta + "</p>";

        document.getElementById("ia-input").value = "";
    };
}

// =========================
// SECÇÃO: RESUMOS AUTOMÁTICOS
// =========================
async function loadResumos(container) {
    const res = await fetch(`${backendURL}/ia/resumos`, {
        headers: { "Authorization": localStorage.getItem("token") }
    });
    const data = await res.json();

    container.innerHTML = "<h3>Resumos Automáticos</h3>";

    data.forEach(r => {
        container.innerHTML += `
            <div class="section-card">
                <p><strong>Origem:</strong> ${r.origem}</p>
                <p><strong>Resumo:</strong> ${r.resumo}</p>
            </div>
        `;
    });
}

// =========================
// SECÇÃO: SUGESTÕES DE GESTÃO
// =========================
async function loadSugestoes(container) {
    const res = await fetch(`${backendURL}/ia/sugestoes`, {
        headers: { "Authorization": localStorage.getItem("token") }
    });
    const data = await res.json();

    container.innerHTML = "<h3>Sugestões de Gestão</h3>";

    data.forEach(s => {
        container.innerHTML += `
            <div class="section-card">
                <p><strong>Área:</strong> ${s.area}</p>
                <p><strong>Sugestão:</strong> ${s.texto}</p>
            </div>
        `;
    });
}

// =========================
// SECÇÃO: GERAÇÃO DE DOCUMENTOS
// =========================
async function loadGeracaoDocumentos(container) {
    container.innerHTML = "<h3>Geração Automática de Documentos</h3>";

    container.innerHTML += `
        <div class="section-card">
            <p>Esta secção permitirá gerar atas, avisos, relatórios e documentos automáticos.</p>
            <p>Será ligada ao backend quando o motor de geração estiver pronto.</p>
        </div>
    `;
}

// =========================
// SECÇÃO: PREVISÕES FINANCEIRAS
// =========================
async function loadPrevisoes(container) {
    const res = await fetch(`${backendURL}/ia/previsoes`, {
        headers: { "Authorization": localStorage.getItem("token") }
    });
    const data = await res.json();

    container.innerHTML = "<h3>Previsões Financeiras</h3>";

    data.forEach(p => {
        container.innerHTML += `
            <div class="section-card">
                <p><strong>Condomínio:</strong> ${p.condominio}</p>
                <p><strong>Previsão:</strong> ${p.valorPrevisto} €</p>
                <p><strong>Período:</strong> ${p.periodo}</p>
            </div>
        `;
    });
}

// =========================
// SECÇÃO: AUTOMAÇÃO DE TAREFAS
// =========================
async function loadAutomacao(container) {
    container.innerHTML = "<h3>Automação de Tarefas</h3>";

    container.innerHTML += `
        <div class="section-card">
            <p>Esta secção permitirá criar regras automáticas:</p>
            <ul>
                <li>Enviar avisos automaticamente</li>
                <li>Gerar documentos</li>
                <li>Alertas de pagamento</li>
                <li>Resumos automáticos</li>
            </ul>
        </div>
    `;
}
