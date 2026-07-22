
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
    const res = await fetch(`${backendURL}/documentos`, {
        headers: { "Authorization": localStorage.getItem("token") }
    });

    const data = await res.json();
    const list = document.getElementById("documentos-list");
    list.innerHTML = "";

    data.forEach(doc => {
        const card = document.createElement("div");
        card.className = "documento-card";

        card.innerHTML = `
            <p><strong>Título:</strong> ${doc.titulo}</p>
            <p><strong>Tipo:</strong> ${doc.tipo}</p>
            <p><strong>Condomínio:</strong> ${doc.condominio}</p>
            <div class="documento-actions">
                <button class="view-btn" onclick="viewDocumento('${doc.id}')">Ver</button>
                <button class="delete-btn" onclick="deleteDocumento('${doc.id}')">Apagar</button>
            </div>
        `;

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
    const url = id ? `${backendURL}/documentos/${id}` : `${backendURL}/documentos`;

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
    await fetch(`${backendURL}/documentos/${id}`, {
        method: "DELETE",
        headers: { "Authorization": localStorage.getItem("token") }
    });

    loadDocumentos();
}
