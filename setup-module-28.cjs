const fs = require('fs');
const path = require('path');

// Base folder
const base = path.join(__dirname, 'frontend', 'module28');

fs.mkdirSync(base, { recursive: true });
fs.mkdirSync(path.join(base, 'css'), { recursive: true });
fs.mkdirSync(path.join(base, 'js'), { recursive: true });

// =========================
// HTML - PAGAMENTOS
// =========================
const html = `
<div id="pagamentos-wrapper">
    <h2>Pagamentos Online</h2>

    <button id="add-pagamento-btn">Novo Pagamento</button>

    <div id="pagamentos-list"></div>

    <div id="pagamento-form" style="display:none;">
        <h3 id="form-title">Novo Pagamento</h3>
        <input type="text" id="pag-condominio" placeholder="Condomínio">
        <input type="text" id="pag-fracao" placeholder="Fração">
        <input type="number" id="pag-valor" placeholder="Valor (€)" step="0.01">
        <select id="pag-metodo">
            <option value="mbway">MB WAY</option>
            <option value="referencia">Referência Multibanco</option>
            <option value="cartao">Cartão de Crédito</option>
        </select>
        <button id="save-pagamento-btn">Gerar Pagamento</button>
        <button id="cancel-pagamento-btn">Cancelar</button>
        <p id="form-error"></p>
    </div>
</div>
`;

fs.writeFileSync(path.join(base, 'pagamentos.html'), html);

// =========================
// CSS
// =========================
const css = `
#pagamentos-wrapper {
    padding: 40px;
    color: white;
}

#add-pagamento-btn {
    background: #0077ff;
    border: none;
    padding: 12px 18px;
    border-radius: 8px;
    color: white;
    cursor: pointer;
}

#pagamentos-list {
    margin-top: 30px;
}

.pagamento-card {
    background: #222;
    padding: 20px;
    border-radius: 10px;
    margin-bottom: 20px;
}

.pagamento-card p {
    margin: 4px 0;
}

.pagamento-actions button {
    margin-right: 10px;
    padding: 8px 12px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
}

.pay-btn {
    background: #00cc66;
    color: white;
}

.delete-btn {
    background: #ff4444;
    color: white;
}

#pagamento-form {
    margin-top: 40px;
    background: #111;
    padding: 20px;
    border-radius: 10px;
}

#pagamento-form input,
#pagamento-form select {
    width: 100%;
    padding: 12px;
    margin-top: 12px;
    border-radius: 8px;
    border: none;
}

#save-pagamento-btn {
    background: #00cc66;
    padding: 12px;
    border-radius: 8px;
    border: none;
    color: white;
    margin-top: 20px;
}

#cancel-pagamento-btn {
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

fs.writeFileSync(path.join(base, 'css', 'pagamentos.css'), css);

// =========================
// JS - PAGAMENTOS
// =========================
const js = `
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
    const res = await fetch(\`\${backendURL}/pagamentos\`, {
        headers: { "Authorization": localStorage.getItem("token") }
    });

    const data = await res.json();
    const list = document.getElementById("pagamentos-list");
    list.innerHTML = "";

    data.forEach(pag => {
        const card = document.createElement("div");
        card.className = "pagamento-card";

        card.innerHTML = \`
            <p><strong>Condomínio:</strong> \${pag.condominio}</p>
            <p><strong>Fração:</strong> \${pag.fracao}</p>
            <p><strong>Valor:</strong> \${pag.valor} €</p>
            <p><strong>Método:</strong> \${pag.metodo}</p>
            <p><strong>Estado:</strong> \${pag.estado}</p>
            <div class="pagamento-actions">
                <button class="pay-btn" onclick="payPagamento('\${pag.id}')">Pagar</button>
                <button class="delete-btn" onclick="deletePagamento('\${pag.id}')">Apagar</button>
            </div>
        \`;

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
    const url = id ? \`\${backendURL}/pagamentos/\${id}\` : \`\${backendURL}/pagamentos\`;

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
    await fetch(\`\${backendURL}/pagamentos/\${id}\`, {
        method: "DELETE",
        headers: { "Authorization": localStorage.getItem("token") }
    });

    loadPagamentos();
}
`;

fs.writeFileSync(path.join(base, 'js', 'pagamentos.js'), js);

// =========================
// PÁGINA
// =========================
const page = `
<!DOCTYPE html>
<html>
<head>
    <title>Pagamentos</title>
    <link rel="stylesheet" href="module28/css/pagamentos.css">
</head>
<body>
    ${html}
    <script src="module28/js/pagamentos.js"></script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'frontend', 'pagamentos.html'), page);

console.log("Módulo 28 criado com sucesso.");
