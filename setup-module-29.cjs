const fs = require('fs');
const path = require('path');

// Base folder
const base = path.join(__dirname, 'frontend', 'module29');

fs.mkdirSync(base, { recursive: true });
fs.mkdirSync(path.join(base, 'css'), { recursive: true });
fs.mkdirSync(path.join(base, 'js'), { recursive: true });

// =========================
// HTML - DOCUMENTOS
// =========================
const html = `
<div id="documentos-wrapper">
    <h2>Gestão de Documentos</h2>

    <button id="add-documento-btn">Novo Documento</button>

    <div id="documentos-list"></div>

    <div id="documento-form" style="display:none;">
        <h3 id="form-title">Novo Documento</h3>
        <input type="text" id="doc-titulo" placeholder="Título do Documento">
        <input type="text" id="doc-tipo" placeholder="Tipo (ex: Ata, Aviso, Regulamento)">
        <input type="text" id="doc-condominio" placeholder="Condomínio">
        <button id="save-documento-btn">Guardar</button>
        <button id="cancel-documento-btn">Cancelar</button>
        <p id="form-error"></p>
    </div>
</div>
`;

fs.writeFileSync(path.join(base, 'documentos.html'), html);

// =========================
// CSS
// =========================
const css = `
#documentos-wrapper {
    padding: 40px;
    color: white;
}

#add-documento-btn {
    background: #0077ff;
    border: none;
    padding: 12px 18px;
    border-radius: 8px;
    color: white;
    cursor: pointer;
}

#documentos-list {
    margin-top: 30px;
}

.documento-card {
    background: #222;
    padding: 20px;
    border-radius: 10px;
    margin-bottom: 20px;
}

.documento-card p {
    margin: 4px 0;
}

.documento-actions button {
    margin-right: 10px;
    padding: 8px 12px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
}

.view-btn {
    background: #00aaff;
    color: white;
}

.delete-btn {
    background: #ff4444;
    color: white;
}

#documento-form {
    margin-top: 40px;
    background: #111;
    padding: 20px;
    border-radius: 10px;
}

#documento-form input {
    width: 100%;
    padding: 12px;
    margin-top: 12px;
    border-radius: 8px;
    border: none;
}

#save-documento-btn {
    background: #00cc66;
    padding: 12px;
    border-radius: 8px;
    border: none;
    color: white;
    margin-top: 20px;
}

#cancel-documento-btn {
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

fs.writeFileSync(path.join(base, 'css', 'documentos.css'), css);

// =========================
// JS - DOCUMENTOS
// =========================
const js = `
const backendURL = "https://condomanager-ai-backend.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    loadDocumentos();

    document.getElementById("add-documento-btn").onclick = () => {
        showForm();
    };

    document.getElementById("cancel-documento-btn").onclick = () => {
        hideForm();
    };

    document.getElementById("save-documento-btn").onclick = () => {
        saveDocumento();
    };
});

// LISTAR
async function loadDocumentos() {
    const res = await fetch(\`\${backendURL}/documentos\`, {
        headers: { "Authorization": localStorage.getItem("token") }
    });

    const data = await res.json();
    const list = document.getElementById("documentos-list");
    list.innerHTML = "";

    data.forEach(doc => {
        const card = document.createElement("div");
        card.className = "documento-card";

        card.innerHTML = \`
            <p><strong>Título:</strong> \${doc.titulo}</p>
            <p><strong>Tipo:</strong> \${doc.tipo}</p>
            <p><strong>Condomínio:</strong> \${doc.condominio}</p>
            <div class="documento-actions">
                <button class="view-btn" onclick="viewDocumento('\${doc.id}')">Ver</button>
                <button class="delete-btn" onclick="deleteDocumento('\${doc.id}')">Apagar</button>
            </div>
        \`;

        list.appendChild(card);
    });
}

// FORM
function showForm(doc = null) {
    document.getElementById("documento-form").style.display = "block";
    document.getElementById("form-error").innerText = "";

    if (doc) {
        document.getElementById("form-title").innerText = "Editar Documento";
        document.getElementById("doc-titulo").value = doc.titulo;
        document.getElementById("doc-tipo").value = doc.tipo;
        document.getElementById("doc-condominio").value = doc.condominio;
        document.getElementById("save-documento-btn").setAttribute("data-id", doc.id);
    } else {
        document.getElementById("form-title").innerText = "Novo Documento";
        document.getElementById("doc-titulo").value = "";
        document.getElementById("doc-tipo").value = "";
        document.getElementById("doc-condominio").value = "";
        document.getElementById("save-documento-btn").removeAttribute("data-id");
    }
}

function hideForm() {
    document.getElementById("documento-form").style.display = "none";
}

// GUARDAR (CRIAR/EDITAR)
async function saveDocumento() {
    const titulo = document.getElementById("doc-titulo").value;
    const tipo = document.getElementById("doc-tipo").value;
    const condominio = document.getElementById("doc-condominio").value;

    if (!titulo || !tipo || !condominio) {
        document.getElementById("form-error").innerText = "Todos os campos são obrigatórios.";
        return;
    }

    const id = document.getElementById("save-documento-btn").getAttribute("data-id");

    const method = id ? "PUT" : "POST";
    const url = id ? \`\${backendURL}/documentos/\${id}\` : \`\${backendURL}/documentos\`;

    await fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("token")
        },
        body: JSON.stringify({ titulo, tipo, condominio })
    });

    hideForm();
    loadDocumentos();
}

// VER (SIMULAÇÃO)
async function viewDocumento(id) {
    alert("Simulação de visualização de documento ID: " + id);
    // Depois ligamos a ficheiros reais (PDF, etc.)
}

// APAGAR
async function deleteDocumento(id) {
    await fetch(\`\${backendURL}/documentos/\${id}\`, {
        method: "DELETE",
        headers: { "Authorization": localStorage.getItem("token") }
    });

    loadDocumentos();
}
`;

fs.writeFileSync(path.join(base, 'js', 'documentos.js'), js);

// =========================
// PÁGINA
// =========================
const page = `
<!DOCTYPE html>
<html>
<head>
    <title>Documentos</title>
    <link rel="stylesheet" href="module29/css/documentos.css">
</head>
<body>
    ${html}
    <script src="module29/js/documentos.js"></script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'frontend', 'documentos.html'), page);

console.log("Módulo 29 criado com sucesso.");
