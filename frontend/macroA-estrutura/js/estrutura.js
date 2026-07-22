
const backendURL = "https://condomanager-ai-backend.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    loadDashboard();
    setupThemeToggle();
});

// =========================
// NAVEGAÇÃO ENTRE MÓDULOS
// =========================
function go(module) {
    window.location.href = module + ".html";
}

// =========================
// TEMA ESCURO / CLARO
// =========================
function setupThemeToggle() {
    const btn = document.getElementById("theme-toggle");

    btn.onclick = () => {
        document.body.classList.toggle("light");
    };
}

// =========================
// DASHBOARD GLOBAL
// =========================
async function loadDashboard() {

    // FINANCEIRO
    const fin = await fetch(`${backendURL}/dashboard/financeiro`, {
        headers: { "Authorization": localStorage.getItem("token") }
    });
    const finData = await fin.json();
    document.getElementById("financeiro-resumo").innerText =
        `Saldo: ${finData.saldo} € | Receitas: ${finData.receitas} € | Despesas: ${finData.despesas} €`;

    // OCORRÊNCIAS
    const oc = await fetch(`${backendURL}/dashboard/ocorrencias`, {
        headers: { "Authorization": localStorage.getItem("token") }
    });
    const ocData = await oc.json();
    const ocDiv = document.getElementById("ocorrencias-recentes");
    ocDiv.innerHTML = "";
    ocData.forEach(o => {
        ocDiv.innerHTML += `<p><strong>${o.titulo}</strong> — ${o.estado}</p>`;
    });

    // ASSEMBLEIAS
    const as = await fetch(`${backendURL}/dashboard/assembleias`, {
        headers: { "Authorization": localStorage.getItem("token") }
    });
    const asData = await as.json();
    const asDiv = document.getElementById("assembleias-proximas");
    asDiv.innerHTML = "";
    asData.forEach(a => {
        asDiv.innerHTML += `<p>${a.data} — ${a.condominio}</p>`;
    });

    // ALERTAS
    const al = await fetch(`${backendURL}/dashboard/alertas`, {
        headers: { "Authorization": localStorage.getItem("token") }
    });
    const alData = await al.json();
    const alDiv = document.getElementById("alertas-lista");
    alDiv.innerHTML = "";
    alData.forEach(a => {
        alDiv.innerHTML += `<p><strong>${a.tipo}</strong>: ${a.mensagem}</p>`;
    });
}
