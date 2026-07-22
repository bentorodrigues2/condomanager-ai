
const backendURL = "https://condomanager-ai-backend.onrender.com";

document.addEventListener("DOMContentLoaded", () => {

    // LOGIN
    const loginBtn = document.getElementById("login-btn");
    if (loginBtn) {
        loginBtn.onclick = async () => {
            const email = document.getElementById("login-email").value;
            const password = document.getElementById("login-password").value;

            const res = await fetch(`${backendURL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (data.token) {
                localStorage.setItem("token", data.token);
                window.location.href = "dashboard.html";
            } else {
                document.getElementById("login-error").innerText = data.error || "Erro no login";
            }
        };
    }

    // REGISTO
    const registerBtn = document.getElementById("register-btn");
    if (registerBtn) {
        registerBtn.onclick = async () => {
            const name = document.getElementById("reg-name").value;
            const email = document.getElementById("reg-email").value;
            const password = document.getElementById("reg-password").value;

            const res = await fetch(`${backendURL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password })
            });

            const data = await res.json();

            if (data.success) {
                window.location.href = "login.html";
            } else {
                document.getElementById("register-error").innerText = data.error || "Erro no registo";
            }
        };
    }

    // NAVEGAÇÃO ENTRE LOGIN E REGISTO
    const goRegister = document.getElementById("go-register");
    if (goRegister) goRegister.onclick = () => window.location.href = "register.html";

    const goLogin = document.getElementById("go-login");
    if (goLogin) goLogin.onclick = () => window.location.href = "login.html";
});
