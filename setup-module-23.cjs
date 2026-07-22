const fs = require('fs');
const path = require('path');

// Base folder
const base = path.join(__dirname, 'frontend', 'module23');

fs.mkdirSync(base, { recursive: true });
fs.mkdirSync(path.join(base, 'css'), { recursive: true });
fs.mkdirSync(path.join(base, 'js'), { recursive: true });

// =========================
// HTML - LOGIN
// =========================
const loginHTML = `
<div id="login-wrapper">
    <div id="login-box">
        <h2>Área Pessoal</h2>
        <input type="email" id="login-email" placeholder="Email">
        <input type="password" id="login-password" placeholder="Password">
        <button id="login-btn">Entrar</button>
        <p id="login-error"></p>
        <a id="go-register">Criar conta</a>
    </div>
</div>
`;

fs.writeFileSync(path.join(base, 'login.html'), loginHTML);

// =========================
// HTML - REGISTO
// =========================
const registerHTML = `
<div id="register-wrapper">
    <div id="register-box">
        <h2>Criar Conta</h2>
        <input type="text" id="reg-name" placeholder="Nome">
        <input type="email" id="reg-email" placeholder="Email">
        <input type="password" id="reg-password" placeholder="Password">
        <button id="register-btn">Registar</button>
        <p id="register-error"></p>
        <a id="go-login">Voltar ao Login</a>
    </div>
</div>
`;

fs.writeFileSync(path.join(base, 'register.html'), registerHTML);

// =========================
// CSS
// =========================
const css = `
#login-wrapper, #register-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 60px;
}

#login-box, #register-box {
    width: 360px;
    padding: 30px;
    background: #111;
    border-radius: 12px;
    color: white;
    box-shadow: 0 0 20px rgba(0,0,0,0.4);
}

#login-box input, #register-box input {
    width: 100%;
    padding: 12px;
    margin-top: 12px;
    border-radius: 8px;
    border: none;
}

#login-btn, #register-btn {
    width: 100%;
    margin-top: 20px;
    padding: 12px;
    background: #0077ff;
    border: none;
    border-radius: 8px;
    color: white;
    font-size: 16px;
    cursor: pointer;
}

#login-error, #register-error {
    color: #ff4444;
    margin-top: 10px;
}

#go-register, #go-login {
    display: block;
    margin-top: 20px;
    color: #00aaff;
    cursor: pointer;
}
`;

fs.writeFileSync(path.join(base, 'css', 'auth.css'), css);

// =========================
// JS - AUTENTICAÇÃO
// =========================
const js = `
const backendURL = "https://condomanager-ai-backend.onrender.com";

document.addEventListener("DOMContentLoaded", () => {

    // LOGIN
    const loginBtn = document.getElementById("login-btn");
    if (loginBtn) {
        loginBtn.onclick = async () => {
            const email = document.getElementById("login-email").value;
            const password = document.getElementById("login-password").value;

            const res = await fetch(\`\${backendURL}/auth/login\`, {
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

            const res = await fetch(\`\${backendURL}/auth/register\`, {
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
`;

fs.writeFileSync(path.join(base, 'js', 'auth.js'), js);

// =========================
// INJETAR NO INDEX.HTML
// =========================
const indexPath = path.join(__dirname, 'frontend', 'index.html');

if (fs.existsSync(indexPath)) {
    let index = fs.readFileSync(indexPath, 'utf8');

    if (!index.includes('module23')) {
        index = index.replace('</body>', `
<!-- Módulo 23 - Autenticação -->
<link rel="stylesheet" href="module23/css/auth.css">
<script src="module23/js/auth.js"></script>
</body>
`);
        fs.writeFileSync(indexPath, index);
        console.log("Módulo 23 integrado no index.html");
    } else {
        console.log("Módulo 23 já estava integrado.");
    }
}

console.log("Módulo 23 criado com sucesso.");
