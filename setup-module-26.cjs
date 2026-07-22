const fs = require('fs');
const path = require('path');

// Base folder
const base = path.join(__dirname, 'frontend', 'module26');

fs.mkdirSync(base, { recursive: true });
fs.mkdirSync(path.join(base, 'css'), { recursive: true });
fs.mkdirSync(path.join(base, 'js'), { recursive: true });

// =========================
// HTML - FRAÇÕES
// =========================
const html = `
<div id="fracoes-wrapper">
    <h2>Gestão de Frações</h2>

    <button id="add-fracao-btn">Adicionar Fração</button>

    <div id="fracoes-list"></div>

    <div id="fracao-form" style="display:none;">
        <h3 id="form-title">Nova Fração</h3>
        <input type="text" id="fracao-numero" placeholder="Número da Fração">
        <input type="text" id="fracao-tipologia" placeholder="Tipologia (ex: T2)">
        <input type="text" id="fracao-proprietario" placeholder="Proprietário">
        <button id="save-fracao-btn">Guardar</button>
        <button id="cancel-fracao-btn">Cancelar</button>
        <p id="form-error"></p>
    </div>
</div>
`;

fs.writeFileSync(path.join(base, 'fracoes.html'), html);

// =========================
// CSS
// =========================
const css = `
#fracoes-wrapper {
    padding: 40px;
    color: white;
}

#add-fracao-btn {
    background: #0077ff;
    border: none;
    padding: 12px 18px;
    border-radius: 8px;
    color: white;
    cursor: pointer;
}

#fracoes-list {
    margin-top: 30px;
}

.fracao-card {
    background: #222;
    padding: 20px;
    border-radius: 10px;
    margin-bottom: 20px;
}

.fracao-actions button {
    margin-right: 10px;
    padding: 8px 12px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
}

.edit-btn {
    background: #00aaff;
    color: white;
}

.delete-btn {
    background: #ff4444;
    color: white;
}

#fracao-form {
    margin-top: 40px;
    background: #111;
    padding: 20px;
    border-radius: 10px;
}

#fracao-form input {
    width: 100%;
    padding: 12px;
    margin-top: 12px;
    border-radius: 8px;
    border: none;
}

#save-fracao-btn {
    background: #00cc66;
    padding: 12px;
    border-radius: 8px;
    border: none;
    color: white;
    margin-top: 20px;
}

#cancel-fracao-btn {
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

fs.writeFileSync(path.join(base, 'css', 'fracoes.css'), css);

// =========================
// JS - CRUD FRAÇÕES
// =========================
const js = `
const backendURL = "https://condomanager-ai-backend.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    loadFracoes();

    document.getElementById("add-fracao-btn").onclick = () => {
        showForm();
    };

    document.getElementById("cancel-fracao-btn").onclick = () => {
        hideForm();
    };

    document.getElementById("save-fracao-btn").onclick = () => {
        saveFracao();
    };
});

// =========================
// LISTAR
// =========================
async function loadFracoes() {
    const res = await fetch(\`\${backendURL}/fracoes\`, {
        headers: { "Authorization": localStorage.getItem("token") }
    });

    const data = await res.json();
    const list = document.getElementById("fracoes-list");
    list.innerHTML = "";

    data.forEach(fracao => {
        const card = document.createElement("div");
        card.className = "fracao-card";

        card.innerHTML = \`
            <h3>Fração \${fracao.numero}</h3>
            <p>Tipologia: \${fracao.tipologia}</p>
            <p>Proprietário: \${fracao.proprietario}</p>
            <div class="fracao-actions">
                <button class="edit-btn" onclick="editFracao('\${fracao.id}')">Editar</button>
                <button class="delete-btn" onclick="deleteFracao('\${fracao.id}')">Apagar</button>
            </div>
        \`;

        list.appendChild(card);
    });
}

// =========================
// FORM
// =========================
function showForm(fracao = null) {
    document.getElementById("fracao-form").style.display = "block";
    document.getElementById("form-error").innerText = "";

    if (fracao) {
        document.getElementById("form-title").innerText = "Editar Fração";
        document.getElementById("fracao-numero").value = fracao.numero;
        document.getElementById("fracao-tipologia").value = fracao.tipologia;
        document.getElementById("fracao-proprietario").value = fracao.proprietario;
        document.getElementById("save-fracao-btn").setAttribute("data-id", fracao.id);
    } else {
        document.getElementById("form-title").innerText = "Nova Fração";
        document.getElementById("fracao-numero").value = "";
        document.getElementById("fracao-tipologia").value = "";
        document.getElementById("fracao-proprietario").value = "";
        document.getElementById("save-fracao-btn").removeAttribute("data-id");
    }
}

function hideForm() {
    document.getElementById("fracao-form").style.display = "none";
}

// =========================
// GUARDAR (CRIAR/EDITAR)
// =========================
async function saveFracao() {
    const numero = document.getElementById("fracao-numero").value;
    const tipologia = document.getElementById("fracao-tipologia").value;
    const proprietario = document.getElementById("fracao-proprietario").value;

    if (!numero || !tipologia || !proprietario) {
        document.getElementById("form-error").innerText = "Todos os campos são obrigatórios.";
        return;
    }

    const id = document.getElementById("save-fracao-btn").getAttribute("data-id");

    const method = id ? "PUT" : "POST";
    const url = id ? \`\${backendURL}/fracoes/\${id}\` : \`\${backendURL}/fracoes\`;

    await fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("token")
        },
        body: JSON.stringify({ numero, tipologia, proprietario })
    });

    hideForm();
    loadFracoes();
}

// =========================
// EDITAR
// =========================
async function editFracao(id) {
    const res = await fetch(\`\${backendURL}/fracoes/\${id}\`, {
        headers: { "Authorization": localStorage.getItem("token") }
    });

    const fracao = await res.json();
    showForm(fracao);
}

// =========================
// APAGAR
// =========================
async function deleteFracao(id) {
    await fetch(\`\${backendURL}/fracoes/\${id}\`, {
        method: "DELETE",
        headers: { "Authorization": localStorage.getItem("token") }
    });

    loadFracoes();
}
`;

fs.writeFileSync(path.join(base, 'js', 'fracoes.js'), js);

// =========================
// CRIAR PÁGINA
// =========================
const page = `
<!DOCTYPE html>
<html>
<head>
    <title>Frações</title>
    <link rel="stylesheet" href="module26/css/fracoes.css">
</head>
<body>
    ${html}
    <script src="module26/js/fracoes.js"></script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'frontend', 'fracoes.html'), page);

console.log("Módulo 26 criado com sucesso.");
