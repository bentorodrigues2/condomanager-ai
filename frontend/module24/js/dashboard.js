
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
