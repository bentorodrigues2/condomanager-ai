
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
    const res = await fetch(`${backendURL}/ocorrencias`, {
        headers: { "Authorization": localStorage.getItem("token") }
    });

    const data = await res.json();
    const list = document.getElementById("ocorrencias-list");
    list.innerHTML = "";

    data.forEach(oc => {
        const card = document.createElement("div");
        card.className = "ocorrencia-card";

        card.innerHTML = `
            <h3>${oc.titulo}</h3>
            <p>${oc.descricao}</p>
            <p><strong>Estado:</strong> ${oc.estado}</p>
            <div class="ocorrencia-actions">
                <button class="edit-btn" onclick="editOcorrencia('${oc.id}')">Editar</button>
                <button class="delete-btn" onclick="deleteOcorrencia('${oc.id}')">Apagar</button>
            </div>
        `;

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
    const url = id ? `${backendURL}/ocorrencias/${id}` : `${backendURL}/ocorrencias`;

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
    const res = await fetch(`${backendURL}/ocorrencias/${id}`, {
        headers: { "Authorization": localStorage.getItem("token") }
    });

    const oc = await res.json();
    showForm(oc);
}

// =========================
// APAGAR
// =========================
async function deleteOcorrencia(id) {
    await fetch(`${backendURL}/ocorrencias/${id}`, {
        method: "DELETE",
        headers: { "Authorization": localStorage.getItem("token") }
    });

    loadOcorrencias();
}
