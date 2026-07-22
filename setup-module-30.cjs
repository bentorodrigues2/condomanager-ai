const fs = require('fs');
const path = require('path');

// Base folder
const base = path.join(__dirname, 'frontend', 'module30');

fs.mkdirSync(base, { recursive: true });
fs.mkdirSync(path.join(base, 'css'), { recursive: true });
fs.mkdirSync(path.join(base, 'js'), { recursive: true });

// =========================
// HTML - NOTIFICAÇÕES
// =========================
const html = `
<div id="notificacoes-wrapper">
    <h2>Notificações e Alertas</h2>

    <button id="add-notificacao-btn">Nova Notificação</button>

    <div id="notificacoes-list"></div>

    <div id="notificacao-form" style="display:none;">
        <h3 id="form-title">Nova Notificação</h3>
        <input type="text" id="notif-titulo" placeholder="Título">
        <textarea id="notif-mensagem" placeholder="Mensagem"></textarea>
        <select id="notif-tipo">
            <option value="info">Informação</option>
            <option value="alerta">Alerta</option>
            <option value="urgente">Urgente</option>
        </select>
        <button id="save-notificacao-btn">Guardar</button>
        <button id="cancel-notificacao-btn">Cancelar</button>
        <p id="form-error"></p>
    </div>
</div>
`;

fs.writeFileSync(path.join(base, 'notificacoes.html'), html);

// =========================
// CSS
// =========================
const css = `
#notificacoes-wrapper {
    padding: 40px;
    color: white;
}

#add-notificacao-btn {
    background: #0077ff;
    border: none;
    padding: 12px 18px;
    border-radius: 8px;
    color: white;
    cursor: pointer;
}

#notificacoes-list {
    margin-top: 30px;
}

.notificacao-card {
    background: #222;
    padding: 20px;
    border-radius: 10px;
    margin-bottom: 20px;
}

.notificacao-card p {
    margin: 4px 0;
}

.notificacao-actions button {
    margin-right: 10px;
    padding: 8px 12px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
}

.read-btn {
    background: #00cc66;
    color: white;
}

.delete-btn {
    background: #ff4444;
    color: white;
}

#notificacao-form {
    margin-top: 40px;
    background: #111;
    padding: 20px;
    border-radius: 10px;
}

#notificacao-form input,
#notificacao-form textarea,
#notificacao-form select {
    width: 100%;
    padding: 12px;
    margin-top: 12px;
    border-radius: 8px;
    border: none;
}

#save-notificacao-btn {
    background: #00cc66;
    padding: 12px;
    border-radius: 8px;
    border: none;
    color: white;
    margin-top: 20px;
}

#cancel-notificacao-btn {
    background: #555;
    padding: 12px;
    border-radius: 8px;
    border: none;
    color: white;
    margin-left: 10px;
}

#form-error {
    color: #ff4444;
    margin-top: 10px;
}
`;

fs.writeFileSync(path.join(base, 'css', 'notificacoes.css'), css);

// =========================
// JS - NOTIFICAÇÕES
// =========================
const js = `
const backendURL = "https://condomanager-ai-backend.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    loadNotificacoes();

    document.getElementById("add-notificacao-btn").onclick = () => {
        showForm();
    };

    document.getElementById("cancel-notificacao-btn").onclick = () => {
        hideForm();
    };

    document.getElementById("save-notificacao-btn").onclick = () => {
        saveNotificacao();
    };
});

// LISTAR
async function loadNotificacoes() {
    const res = await fetch(\`\${backendURL}/notificacoes\`, {
        headers: { "Authorization": localStorage.getItem("token") }
    });

    const data = await res.json();
    const list = document.getElementById("notificacoes-list");
    list.innerHTML = "";

    data.forEach(notif => {
        const card = document.createElement("div");
        card.className = "notificacao-card";

        card.innerHTML = \`
            <p><strong>Título:</strong> \${notif.titulo}</p>
            <p><strong>Mensagem:</strong> \${notif.mensagem}</p>
            <p><strong>Tipo:</strong> \${notif.tipo}</p>
            <p><strong>Estado:</strong> \${notif.lida ? "Lida" : "Não Lida"}</p>
            <div class="notificacao-actions">
                <button class="read-btn" onclick="markAsRead('\${notif.id}')">Marcar como Lida</button>
                <button class="delete-btn" onclick="deleteNotificacao('\${notif.id}')">Apagar</button>
            </div>
        \`;

        list.appendChild(card);
    });
}

// FORM
function showForm(notif = null) {
    document.getElementById("notificacao-form").style.display = "block";
    document.getElementById("form-error").innerText = "";

    if (notif) {
        document.getElementById("form-title").innerText = "Editar Notificação";
        document.getElementById("notif-titulo").value = notif.titulo;
        document.getElementById("notif-mensagem").value = notif.mensagem;
        document.getElementById("notif-tipo").value = notif.tipo;
        document.getElementById("save-notificacao-btn").setAttribute("data-id", notif.id);
    } else {
        document.getElementById("form-title").innerText = "Nova Notificação";
        document.getElementById("notif-titulo").value = "";
        document.getElementById("notif-mensagem").value = "";
        document.getElementById("notif-tipo").value = "info";
        document.getElementById("save-notificacao-btn").removeAttribute("data-id");
    }
}

function hideForm() {
    document.getElementById("notificacao-form").style.display = "none";
}

// GUARDAR (CRIAR/EDITAR)
async function saveNotificacao() {
    const titulo = document.getElementById("notif-titulo").value;
    const mensagem = document.getElementById("notif-mensagem").value;
    const tipo = document.getElementById("notif-tipo").value;

    if (!titulo || !mensagem) {
        document.getElementById("form-error").innerText = "Título e mensagem são obrigatórios.";
        return;
    }

    const id = document.getElementById("save-notificacao-btn").getAttribute("data-id");

    const method = id ? "PUT" : "POST";
    const url = id ? \`\${backendURL}/notificacoes/\${id}\` : \`\${backendURL}/notificacoes\`;

    await fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("token")
        },
        body: JSON.stringify({ titulo, mensagem, tipo })
    });

    hideForm();
    loadNotificacoes();
}

// MARCAR COMO LIDA
async function markAsRead(id) {
    await fetch(\`\${backendURL}/notificacoes/\${id}/lida\`, {
        method: "PUT",
        headers: { "Authorization": localStorage.getItem("token") }
    });

    loadNotificacoes();
}

// APAGAR
async function deleteNotificacao(id) {
    await fetch(\`\${backendURL}/notificacoes/\${id}\`, {
        method: "DELETE",
        headers: { "Authorization": localStorage.getItem("token") }
    });

    loadNotificacoes();
}
`;

fs.writeFileSync(path.join(base, 'js', 'notificacoes.js'), js);

// =========================
// PÁGINA
// =========================
const page = `
<!DOCTYPE html>
<html>
<head>
    <title>Notificações</title>
    <link rel="stylesheet" href="module30/css/notificacoes.css">
</head>
<body>
    ${html}
    <script src="module30/js/notificacoes.js"></script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'frontend', 'notificacoes.html'), page);

console.log("Módulo 30 criado com sucesso.");
