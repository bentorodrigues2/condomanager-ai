const fs = require('fs');
const path = require('path');

// Base folder
const base = path.join(__dirname, 'frontend', 'module25');

fs.mkdirSync(base, { recursive: true });
fs.mkdirSync(path.join(base, 'css'), { recursive: true });
fs.mkdirSync(path.join(base, 'js'), { recursive: true });

// =========================
// HTML - CONDOMÍNIOS
// =========================
const html = `
<div id="condominios-wrapper">
    <h2>Gestão de Condomínios</h2>

    <button id="add-condominio-btn">Adicionar Condomínio</button>

    <div id="condominios-list"></div>

    <div id="condominio-form" style="display:none;">
        <h3 id="form-title">Novo Condomínio</h3>
        <input type="text" id="cond-nome" placeholder="Nome do Condomínio">
        <input type="text" id="cond-morada" placeholder="Morada">
        <input type="text" id="cond-gestor" placeholder="Gestor">
        <button id="save-condominio-btn">Guardar</button>
        <button id="cancel-condominio-btn">Cancelar</button>
        <p id="form-error"></p>
    </div>
</div>
`;

fs.writeFileSync(path.join(base, 'condominios.html'), html);

// =========================
// CSS
// =========================
const css = `
#condominios-wrapper {
    padding: 40px;
    color: white;
}

#add-condominio-btn {
    background: #0077ff;
    border: none;
    padding: 12px 18px;
    border-radius: 8px;
    color: white;
    cursor: pointer;
}

#condominios-list {
    margin-top: 30px;
}

.condominio-card {
    background: #222;
    padding: 20px;
    border-radius: 10px;
    margin-bottom: 20px;
}

.condominio-actions button {
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

#condominio-form {
    margin-top: 40px;
    background: #111;
    padding: 20px;
    border-radius: 10px;
}

#condominio-form input {
    width: 100%;
    padding: 12px;
    margin-top: 12px;
    border-radius: 8px;
    border: none;
}

#save-condominio-btn {
    background: #00cc66;
    padding: 12px;
    border-radius: 8px;
    border: none;
    color: white;
    margin-top: 20px;
}

#cancel-condominio-btn {
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

fs.writeFileSync(path.join(base, 'css', 'condominios.css'), css);

// =========================
// JS - CRUD CONDOMÍNIOS
// =========================
const js = `
const backendURL = "https://condomanager-ai-backend.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    loadCondominios();

    document.getElementById("add-condominio-btn").onclick = () => {
        showForm();
    };

    document.getElementById("cancel-condominio-btn").onclick = () => {
        hideForm();
    };

    document.getElementById("save-condominio-btn").onclick = () => {
        saveCondominio();
    };
});

// =========================
// LISTAR
// =========================
async function loadCondominios() {
    const res = await fetch(\`\${backendURL}/condominios\`, {
        headers: { "Authorization": localStorage.getItem("token") }
    });

    const data = await res.json();
    const list = document.getElementById("condominios-list");
    list.innerHTML = "";

    data.forEach(cond => {
        const card = document.createElement("div");
        card.className = "condominio-card";

        card.innerHTML = \`
            <h3>\${cond.nome}</h3>
            <p>Morada: \${cond.morada}</p>
            <p>Gestor: \${cond.gestor}</p>
            <div class="condominio-actions">
                <button class="edit-btn" onclick="editCondominio('\${cond.id}')">Editar</button>
                <button class="delete-btn" onclick="deleteCondominio('\${cond.id}')">Apagar</button>
            </div>
        \`;

        list.appendChild(card);
    });
}

// =========================
// FORM
// =========================
function showForm(cond = null) {
    document.getElementById("condominio-form").style.display = "block";
    document.getElementById("form-error").innerText = "";

    if (cond) {
        document.getElementById("form-title").innerText = "Editar Condomínio";
        document.getElementById("cond-nome").value = cond.nome;
        document.getElementById("cond-morada").value = cond.morada;
        document.getElementById("cond-gestor").value = cond.gestor;
        document.getElementById("save-condominio-btn").setAttribute("data-id", cond.id);
    } else {
        document.getElementById("form-title").innerText = "Novo Condomínio";
        document.getElementById("cond-nome").value = "";
        document.getElementById("cond-morada").value = "";
        document.getElementById("cond-gestor").value = "";
        document.getElementById("save-condominio-btn").removeAttribute("data-id");
    }
}

function hideForm() {
    document.getElementById("condominio-form").style.display = "none";
}

// =========================
// GUARDAR (CRIAR/EDITAR)
// =========================
async function saveCondominio() {
    const nome = document.getElementById("cond-nome").value;
    const morada = document.getElementById("cond-morada").value;
    const gestor = document.getElementById("cond-gestor").value;

    if (!nome || !morada || !gestor) {
        document.getElementById("form-error").innerText = "Todos os campos são obrigatórios.";
        return;
    }

    const id = document.getElementById("save-condominio-btn").getAttribute("data-id");

    const method = id ? "PUT" : "POST";
    const url = id ? \`\${backendURL}/condominios/\${id}\` : \`\${backendURL}/condominios\`;

    const res = await fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("token")
        },
        body: JSON.stringify({ nome, morada, gestor })
    });

    hideForm();
    loadCondominios();
}

// =========================
// EDITAR
// =========================
async function editCondominio(id) {
    const res = await fetch(\`\${backendURL}/condominios/\${id}\`, {
        headers: { "Authorization": localStorage.getItem("token") }
    });

    const cond = await res.json();
    showForm(cond);
}

// =========================
// APAGAR
// =========================
async function deleteCondominio(id) {
    await fetch(\`\${backendURL}/condominios/\${id}\`, {
        method: "DELETE",
        headers: { "Authorization": localStorage.getItem("token") }
    });

    loadCondominios();
}
`;

fs.writeFileSync(path.join(base, 'js', 'condominios.js'), js);

// =========================
// CRIAR PÁGINA
// =========================
const page = `
<!DOCTYPE html>
<html>
<head>
    <title>Condomínios</title>
    <link rel="stylesheet" href="module25/css/condominios.css">
</head>
<body>
    ${html}
    <script src="module25/js/condominios.js"></script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'frontend', 'condominios.html'), page);

console.log("Módulo 25 criado com sucesso.");
