
const backendURL = "https://condomanager-ai-backend.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    loadPagamentos();

    document.getElementById("add-pagamento-btn").onclick = () => {
        showForm();
    };

    document.getElementById("cancel-pagamento-btn").onclick = () => {
        hideForm();
    };

    document.getElementById("save-pagamento-btn").onclick = () => {
        savePagamento();
    };
});

// LISTAR
async function loadPagamentos() {
    const res = await fetch(`${backendURL}/pagamentos`, {
        headers: { "Authorization": localStorage.getItem("token") }
    });

    const data = await res.json();
    const list = document.getElementById("pagamentos-list");
    list.innerHTML = "";

    data.forEach(pag => {
        const card = document.createElement("div");
        card.className = "pagamento-card";

        card.innerHTML = `
            <p><strong>Condomínio:</strong> ${pag.condominio}</p>
            <p><strong>Fração:</strong> ${pag.fracao}</p>
            <p><strong>Valor:</strong> ${pag.valor} €</p>
            <p><strong>Método:</strong> ${pag.metodo}</p>
            <p><strong>Estado:</strong> ${pag.estado}</p>
            <div class="pagamento-actions">
                <button class="pay-btn" onclick="payPagamento('${pag.id}')">Pagar</button>
                <button class="delete-btn" onclick="deletePagamento('${pag.id}')">Apagar</button>
            </div>
        `;

        list.appendChild(card);
    });
}

// FORM
function showForm(pag = null) {
    document.getElementById("pagamento-form").style.display = "block";
    document.getElementById("form-error").innerText = "";

    if (pag) {
        document.getElementById("form-title").innerText = "Editar Pagamento";
        document.getElementById("pag-condominio").value = pag.condominio;
        document.getElementById("pag-fracao").value = pag.fracao;
        document.getElementById("pag-valor").value = pag.valor;
        document.getElementById("pag-metodo").value = pag.metodo;
        document.getElementById("save-pagamento-btn").setAttribute("data-id", pag.id);
    } else {
        document.getElementById("form-title").innerText = "Novo Pagamento";
        document.getElementById("pag-condominio").value = "";
        document.getElementById("pag-fracao").value = "";
        document.getElementById("pag-valor").value = "";
        document.getElementById("pag-metodo").value = "mbway";
        document.getElementById("save-pagamento-btn").removeAttribute("data-id");
    }
}

function hideForm() {
    document.getElementById("pagamento-form").style.display = "none";
}

// GUARDAR (CRIAR/EDITAR)
async function savePagamento() {
    const condominio = document.getElementById("pag-condominio").value;
    const fracao = document.getElementById("pag-fracao").value;
    const valor = document.getElementById("pag-valor").value;
    const metodo = document.getElementById("pag-metodo").value;

    if (!condominio || !fracao || !valor || !metodo) {
        document.getElementById("form-error").innerText = "Todos os campos são obrigatórios.";
        return;
    }

    const id = document.getElementById("save-pagamento-btn").getAttribute("data-id");

    const method = id ? "PUT" : "POST";
    const url = id ? `${backendURL}/pagamentos/${id}` : `${backendURL}/pagamentos`;

    await fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("token")
        },
        body: JSON.stringify({ condominio, fracao, valor, metodo })
    });

    hideForm();
    loadPagamentos();
}

// PAGAR (SIMULAÇÃO)
async function payPagamento(id) {
    alert("Simulação de pagamento para ID: " + id);
    // Aqui depois ligamos ao gateway real (Stripe, Easypay, etc.)
}

// APAGAR
async function deletePagamento(id) {
    await fetch(`${backendURL}/pagamentos/${id}`, {
        method: "DELETE",
        headers: { "Authorization": localStorage.getItem("token") }
    });

    loadPagamentos();
}
