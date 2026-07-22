const fs = require("fs");
const { execSync } = require("child_process");
const path = require("path");
const axios = require("axios");

// CONFIGURAÇÕES
const GITHUB_USERNAME = "bentorodrigues2";   // teu username
const REPO_NAME = "condomanager-ai";        // nome do repositório
const TOKEN_PATH = path.join(__dirname, "github-token.txt");

// VERIFICAR TOKEN
if (!fs.existsSync(TOKEN_PATH)) {
    console.log("⚠️ FALTA O TOKEN DO GITHUB!");
    console.log("Cria um ficheiro github-token.txt com o teu token dentro.");
    process.exit(1);
}

const TOKEN = fs.readFileSync(TOKEN_PATH, "utf8").trim();

// CRIAR REPOSITÓRIO NO GITHUB
async function createRepo() {
    console.log("A criar repositório no GitHub...");

    try {
        const res = await axios.post(
            "https://api.github.com/user/repos",
            {
                name: REPO_NAME,
                private: false
            },
            {
                headers: {
                    Authorization: `token ${TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("✔ Repositório criado:", res.data.html_url);
        return res.data.clone_url;

    } catch (err) {
        console.error("❌ Erro ao criar repositório:", err.response?.data || err);
        process.exit(1);
    }
}

// EXECUTAR COMANDOS GIT
function run(cmd) {
    console.log("→", cmd);
    execSync(cmd, { stdio: "inherit" });
}

(async () => {
    const remoteUrl = await createRepo();

    console.log("A inicializar Git local...");

    run("git init");
    run("git add .");
    run('git commit -m "Initial commit"');

    console.log("A adicionar remote...");
    run(`git remote add origin ${remoteUrl}`);

    console.log("A enviar código para GitHub...");
    run("git push -u origin main");

    console.log("✔ MÓDULO 9 COMPLETO");
    console.log("O repositório está no GitHub e pronto para o Render.");
})();
