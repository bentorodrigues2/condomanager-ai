
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
    const res = await fetch(`${backendURL}/notificacoes`, {
        headers: { "Authorization": localStorage.getItem("token") }
    });

    const data = await res.json();
    const list = document.getElementById("notificacoes-list");
    list.innerHTML = "";

    data.forEach(notif => {
        const card = document.createElement("div");
        card.className = "notificacao-card";

        card.innerHTML = `
            <p><strong>Título:</strong> ${notif.titulo}</p>
            <p><strong>Mensagem:</strong> ${notif.mensagem}</p>
            <p><strong>Tipo:</strong> ${notif.tipo}</p>
            <p><strong>Estado:</strong> ${notif.lida ? "Lida" : "Não Lida"}</p>
            <div class="notificacao-actions">
                <button class="read-btn" onclick="markAsRead('${notif.id}')">Marcar como Lida</button>
                <button class="delete-btn" onclick="deleteNotificacao('${notif.id}')">Apagar</button>
            </div>
        `;

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
    const url = id ? `${backendURL}/notificacoes/${id}` : `${backendURL}/notificacoes`;

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
    await fetch(`${backendURL}/notificacoes/${id}/lida`, {
        method: "PUT",
        headers: { "Authorization": localStorage.getItem("token") }
    });

    loadNotificacoes();
}

// APAGAR
async function deleteNotificacao(id) {
    await fetch(`${backendURL}/notificacoes/${id}`, {
        method: "DELETE",
        headers: { "Authorization": localStorage.getItem("token") }
    });

    loadNotificacoes();
}
