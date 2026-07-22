const fs = require('fs');
const path = require('path');

// Base folder
const base = path.join(__dirname, 'frontend', 'module27');

fs.mkdirSync(base, { recursive: true });
fs.mkdirSync(path.join(base, 'css'), { recursive: true });
fs.mkdirSync(path.join(base, 'js'), { recursive: true });

// =========================
// HTML - OCORRÊNCIAS
// =========================
const html = `
<div id="ocorrencias-wrapper">
    <h2>Gestão de Ocorrências</h2>

    <button id="add-ocorrencia-btn">Nova Ocorrência</button>

    <div id="ocorrencias-list"></div>

    <div id="ocorrencia-form" style="display:none;">
        <h3 id="form-title">Nova Ocorrência</h3>
        <input type="text" id="ocorr-titulo" placeholder="Título da Ocorrência">
        <textarea id="ocorr-descricao" placeholder="Descrição detalhada"></textarea>
        <select id="ocorr-estado">
            <option value="pendente">Pendente</option>
            <option value="analise">Em Análise</option>
            <option value="resolvida">Resolvida</option>
        </select>
        <button id="save-ocorrencia-btn">Guardar</button>
        <button id="cancel-ocorrencia-btn">Cancelar</button>
        <p id="form-error"></p>
    </div>
</div>
`;

fs.writeFileSync(path.join(base, 'ocorrencias.html'), html);

// =========================
// CSS
// =========================
const css = `
#ocorrencias-wrapper {
    padding: 40px;
    color: white;
}

#add-ocorrencia-btn {
    background: #0077ff;
    border: none;
    padding: 12px 18px;
    border-radius: 8px;
    color: white;
    cursor: pointer;
}

#ocorrencias-list {
    margin-top: 30px;
}

.ocorrencia-card {
    background: #222;
    padding: 20px;
    border-radius: 10px;
    margin-bottom: 20px;
}

.ocorrencia-actions button {
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

#ocorrencia-form {
    margin-top: 40px;
    background: #111;
    padding: 20px;
    border-radius: 10px;
}

#ocorrencia-form input,
#ocorrencia-form textarea,
#ocorrencia-form select {
    width: 100%;
    padding: 12px;
    margin-top: 12px;
    border-radius: 8px;
    border: none;
}

#save-ocorrencia-btn {
    background: #00cc66;
    padding: 12px;
    border-radius: 8px;
    border: none;
    color: white;
    margin-top: 20px;
}

#cancel-ocorrencia-btn {
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

fs.writeFileSync(path.join(base, 'css', 'ocorrencias.css'), css);

// =========================
// JS - CRUD OCORRÊNCIAS
// =========================
const js = `
const backendURL = "https://condomanager-ai-backend.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    loadOcorrencias();

    document.getElementById("add-ocorrencia-btn").onclick = () => {
        showForm();
    };

    document.getElementById("cancel-ocorrencia-btn").onclick = () => {
        hideForm();
    };

    document.getElementById("save-ocorrencia-btn").onclick = () => {
        saveOcorrencia();
    };
});

// =========================
// LISTAR
// =========================
async function loadOcorrencias() {
    const res = await fetch(\`\${backendURL}/ocorrencias\`, {
        headers: { "Authorization": localStorage.getItem("token") }
    });

    const data = await res.json();
    const list = document.getElementById("ocorrencias-list");
    list.innerHTML = "";

    data.forEach(oc => {
        const card = document.createElement("div");
        card.className = "ocorrencia-card";

        card.innerHTML = \`
            <h3>\${oc.titulo}</h3>
            <p>\${oc.descricao}</p>
            <p><strong>Estado:</strong> \${oc.estado}</p>
            <div class="ocorrencia-actions">
                <button class="edit-btn" onclick="editOcorrencia('\${oc.id}')">Editar</button>
                <button class="delete-btn" onclick="deleteOcorrencia('\${oc.id}')">Apagar</button>
            </div>
        \`;

        list.appendChild(card);
    });
}

// =========================
// FORM
// =========================
function showForm(oc = null) {
    document.getElementById("ocorrencia-form").style.display = "block";
    document.getElementById("form-error").innerText = "";

    if (oc) {
        document.getElementById("form-title").innerText = "Editar Ocorrência";
        document.getElementById("ocorr-titulo").value = oc.titulo;
        document.getElementById("ocorr-descricao").value = oc.descricao;
        document.getElementById("ocorr-estado").value = oc.estado;
        document.getElementById("save-ocorrencia-btn").setAttribute("data-id", oc.id);
    } else {
        document.getElementById("form-title").innerText = "Nova Ocorrência";
        document.getElementById("ocorr-titulo").value = "";
        document.getElementById("ocorr-descricao").value = "";
        document.getElementById("ocorr-estado").value = "pendente";
        document.getElementById("save-ocorrencia-btn").removeAttribute("data-id");
    }
}

function hideForm() {
    document.getElementById("ocorrencia-form").style.display = "none";
}

// =========================
// GUARDAR (CRIAR/EDITAR)
// =========================
async function saveOcorrencia() {
    const titulo = document.getElementById("ocorr-titulo").value;
    const descricao = document.getElementById("ocorr-descricao").value;
    const estado = document.getElementById("ocorr-estado").value;

    if (!titulo || !descricao) {
        document.getElementById("form-error").innerText = "Título e descrição são obrigatórios.";
        return;
    }

    const id = document.getElementById("save-ocorrencia-btn").getAttribute("data-id");

    const method = id ? "PUT" : "POST";
    const url = id ? \`\${backendURL}/ocorrencias/\${id}\` : \`\${backendURL}/ocorrencias\`;

    await fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("token")
        },
        body: JSON.stringify({ titulo, descricao, estado })
    });

    hideForm();
    loadOcorrencias();
}

// =========================
// EDITAR
// =========================
async function editOcorrencia(id) {
    const res = await fetch(\`\${backendURL}/ocorrencias/\${id}\`, {
        headers: { "Authorization": localStorage.getItem("token") }
    });

    const oc = await res.json();
    showForm(oc);
}

// =========================
// APAGAR
// =========================
async function deleteOcorrencia(id) {
    await fetch(\`\${backendURL}/ocorrencias/\${id}\`, {
        method: "DELETE",
        headers: { "Authorization": localStorage.getItem("token") }
    });

    loadOcorrencias();
}
`;

fs.writeFileSync(path.join(base, 'js', 'ocorrencias.js'), js);

// =========================
// CRIAR PÁGINA
// =========================
const page = `
<!DOCTYPE html>
<html>
<head>
    <title>Ocorrências</title>
    <link rel="stylesheet" href="module27/css/ocorrencias.css">
</head>
<body>
    ${html}
    <script src="module27/js/ocorrencias.js"></script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'frontend', 'ocorrencias.html'), page);

console.log("Módulo 27 criado com sucesso.");
