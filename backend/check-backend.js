const fs = require("fs");
const path = require("path");

const backendPath = path.join(__dirname);
const serverPath = path.join(backendPath, "server.js");
const pkgPath = path.join(backendPath, "package.json");

console.log("🔍 Verificando backend...\n");

if (!fs.existsSync(serverPath)) {
  console.error("❌ ERRO: server.js não encontrado em /backend/");
} else {
  console.log("✔ server.js encontrado");
}

if (!fs.existsSync(pkgPath)) {
  console.error("❌ ERRO: package.json não encontrado em /backend/");
} else {
  console.log("✔ package.json encontrado");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));

  if (!pkg.scripts || !pkg.scripts.start) {
    console.error("❌ ERRO: package.json não tem script start");
  } else {
    console.log("✔ script start OK →", pkg.scripts.start);
  }

  if (pkg.main !== "server.js") {
    console.error("❌ ERRO: main deve ser 'server.js'");
  } else {
    console.log("✔ main OK");
  }
}

console.log("\n🏁 Verificação concluída.");
