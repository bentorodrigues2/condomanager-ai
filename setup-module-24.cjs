const fs = require('fs');
const path = require('path');

// Base folder
const base = path.join(__dirname, 'frontend', 'module24');

fs.mkdirSync(base, { recursive: true });
fs.mkdirSync(path.join(base, 'css'), { recursive: true });
fs.mkdirSync(path.join(base, 'js'), { recursive: true });

// =========================
// HTML - DASHBOARD
// =========================
const dashboardHTML = `
<div id="dashboard-wrapper">
    <div id="dashboard-header">
        <h2 id="dashboard-title">Dashboard</h2>
        <button id="logout-btn">Sair</button>
    </div>

    <p id="dashboard-welcome">Olá, utilizador!</p>

    <div id="dashboard-menu">
        <button class="dash-btn" onclick="goTo('condominios')">Condomínios</button>
        <button class="dash-btn" onclick="goTo('fracoes')">Frações</button>
        <button class="dash-btn" onclick="goTo('condominos')">Condóminos</button>
        <button class="dash-btn" onclick="goTo('ocorrencias')">Ocorrências</button>
        <button class="dash-btn" onclick="goTo('pagamentos')">Pagamentos</button>
        <button class="dash-btn" onclick="goTo('documentos')">Documentos</button>
        <button class="dash-btn" onclick="goTo('assembleias')">Assembleias</button>
        <button class="dash-btn" onclick="goTo('tarefas')">Tarefas</button>
        <button class="dash-btn" onclick="goTo('auditoria')">Auditoria</button>
    </div>
</div>
`;

fs.writeFileSync(path.join(base, 'dashboard.html'), dashboardHTML);

// =========================
// CSS
// =========================
const css = `
#dashboard-wrapper {
    width: 100%;
    padding: 40px;
    color: white;
}

#dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

#logout-btn {
    background: #ff4444;
    border: none;
    padding: 10px 16px;
    border-radius: 8px;
    color: white;
    cursor: pointer;
}

#dashboard-welcome {
    margin-top: 20px;
    font-size: 18px;
}

#dashboard-menu {
    margin-top: 40px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 20px;
}

.dash-btn {
    background: #0077ff;
    border: none;
    padding: 16px;
    border-radius: 10px;
    color: white;
    font-size: 16px;
    cursor: pointer;
}
`;

fs.writeFileSync(path.join(base, 'css', 'dashboard.css'), css);

// =========================
// JS - DASHBOARD
// =========================
const js = `
document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    // Saudação
    const welcome = document.getElementById("dashboard-welcome");
    welcome.innerText = "Olá! Sessão iniciada com sucesso.";

    // Logout
    const logoutBtn = document.getElementById("logout-btn");
    logoutBtn.onclick = () => {
        localStorage.removeItem("token");
        window.location.href = "login.html";
    };
});

// Navegação para módulos
function goTo(module) {
    alert("Módulo " + module + " ainda não está implementado.");
}
`;

fs.writeFileSync(path.join(base, 'js', 'dashboard.js'), js);

// =========================
// CRIAR FICHEIRO dashboard.html NA RAIZ DO FRONTEND
// =========================
const dashboardPage = `
<!DOCTYPE html>
<html>
<head>
    <title>Dashboard</title>
    <link rel="stylesheet" href="module24/css/dashboard.css">
</head>
<body>
    ${dashboardHTML}
    <script src="module24/js/dashboard.js"></script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'frontend', 'dashboard.html'), dashboardPage);

console.log("Módulo 24 criado com sucesso.");
