
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
    const res = await fetch(`${backendURL}/condominios`, {
        headers: { "Authorization": localStorage.getItem("token") }
    });

    const data = await res.json();
    const list = document.getElementById("condominios-list");
    list.innerHTML = "";

    data.forEach(cond => {
        const card = document.createElement("div");
        card.className = "condominio-card";

        card.innerHTML = `
            <h3>${cond.nome}</h3>
            <p>Morada: ${cond.morada}</p>
            <p>Gestor: ${cond.gestor}</p>
            <div class="condominio-actions">
                <button class="edit-btn" onclick="editCondominio('${cond.id}')">Editar</button>
                <button class="delete-btn" onclick="deleteCondominio('${cond.id}')">Apagar</button>
            </div>
        `;

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
    const url = id ? `${backendURL}/condominios/${id}` : `${backendURL}/condominios`;

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
    const res = await fetch(`${backendURL}/condominios/${id}`, {
        headers: { "Authorization": localStorage.getItem("token") }
    });

    const cond = await res.json();
    showForm(cond);
}

// =========================
// APAGAR
// =========================
async function deleteCondominio(id) {
    await fetch(`${backendURL}/condominios/${id}`, {
        method: "DELETE",
        headers: { "Authorization": localStorage.getItem("token") }
    });

    loadCondominios();
}
