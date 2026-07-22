
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
    const res = await fetch(`${backendURL}/fracoes`, {
        headers: { "Authorization": localStorage.getItem("token") }
    });

    const data = await res.json();
    const list = document.getElementById("fracoes-list");
    list.innerHTML = "";

    data.forEach(fracao => {
        const card = document.createElement("div");
        card.className = "fracao-card";

        card.innerHTML = `
            <h3>Fração ${fracao.numero}</h3>
            <p>Tipologia: ${fracao.tipologia}</p>
            <p>Proprietário: ${fracao.proprietario}</p>
            <div class="fracao-actions">
                <button class="edit-btn" onclick="editFracao('${fracao.id}')">Editar</button>
                <button class="delete-btn" onclick="deleteFracao('${fracao.id}')">Apagar</button>
            </div>
        `;

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
    const url = id ? `${backendURL}/fracoes/${id}` : `${backendURL}/fracoes`;

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
    const res = await fetch(`${backendURL}/fracoes/${id}`, {
        headers: { "Authorization": localStorage.getItem("token") }
    });

    const fracao = await res.json();
    showForm(fracao);
}

// =========================
// APAGAR
// =========================
async function deleteFracao(id) {
    await fetch(`${backendURL}/fracoes/${id}`, {
        method: "DELETE",
        headers: { "Authorization": localStorage.getItem("token") }
    });

    loadFracoes();
}
