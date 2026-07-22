
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
    const content = document.getElementById("backend-content");

    switch(section) {
        case "status":
            loadStatus(content);
            break;
        case "endpoints":
            loadEndpoints(content);
            break;
        case "tokens":
            loadTokens(content);
            break;
        case "seguranca":
            loadSeguranca(content);
            break;
        default:
            content.innerHTML = "<p>Secção inválida.</p>";
    }
}

// =========================
// SECÇÃO: ESTADO DO BACKEND
// =========================
async function loadStatus(container) {
    container.innerHTML = "<h3>Estado do Backend</h3>";

    try {
        const res = await fetch(`${backendURL}/status`);
        const data = await res.json();

        container.innerHTML += `
            <div class="section-card">
                <p><strong>Estado:</strong> ${data.estado}</p>
                <p><strong>Versão:</strong> ${data.versao}</p>
                <p><strong>Último Deploy:</strong> ${data.deploy}</p>
            </div>
        `;
    } catch {
        container.innerHTML += "<p>Backend indisponível.</p>";
    }
}

// =========================
// SECÇÃO: TESTAR ENDPOINTS
// =========================
function loadEndpoints(container) {
    container.innerHTML = `
        <h3>Testar Endpoints</h3>
        <input id="endpoint-test-input" placeholder="Ex: /condominios">
        <button id="endpoint-test-btn">Testar</button>
        <div id="endpoint-result"></div>
    `;

    document.getElementById("endpoint-test-btn").onclick = async () => {
        const ep = document.getElementById("endpoint-test-input").value;
        const result = document.getElementById("endpoint-result");

        try {
            const res = await fetch(backendURL + ep, {
                headers: { "Authorization": localStorage.getItem("token") }
            });
            const data = await res.json();

            result.innerHTML = "<pre>" + JSON.stringify(data, null, 2) + "</pre>";
        } catch {
            result.innerHTML = "<p>Erro ao testar endpoint.</p>";
        }
    };
}

// =========================
// SECÇÃO: GESTÃO DE TOKENS
// =========================
function loadTokens(container) {
    container.innerHTML = "<h3>Gestão de Tokens</h3>";

    const token = localStorage.getItem("token");
    const refresh = localStorage.getItem("refresh");

    container.innerHTML += `
        <div class="section-card">
            <p><strong>Token Atual:</strong></p>
            <p>${token || "Nenhum"}</p>
        </div>

        <div class="section-card">
            <p><strong>Refresh Token:</strong></p>
            <p>${refresh || "Nenhum"}</p>
        </div>

        <button onclick="refreshToken()">Renovar Token</button>
    `;
}

async function refreshToken() {
    const refresh = localStorage.getItem("refresh");
    if (!refresh) {
        alert("Nenhum refresh token disponível.");
        return;
    }

    const res = await fetch(`${backendURL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh })
    });

    const data = await res.json();

    localStorage.setItem("token", data.token);
    alert("Token renovado com sucesso.");
}

// =========================
// SECÇÃO: SEGURANÇA AVANÇADA
// =========================
function loadSeguranca(container) {
    container.innerHTML = "<h3>Segurança Avançada</h3>";

    container.innerHTML += `
        <div class="section-card">
            <p>Este módulo implementa:</p>
            <ul>
                <li>Refresh tokens</li>
                <li>Expiração automática</li>
                <li>Revalidação silenciosa</li>
                <li>Proteção contra tokens inválidos</li>
                <li>Bloqueio automático após falhas repetidas</li>
            </ul>
        </div>
    `;
}
