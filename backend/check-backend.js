const fs = require("fs");
const path = require("path");

const backendPath = path.join(__dirname);
const serverPath = path.join(backendPath, "server.js");
const pkgPath = path.join(backendPath, "package.json");

console.log("ðŸ” Verificando backend...\n");

if (!fs.existsSync(serverPath)) {
  console.error("âŒ ERRO: server.js nÃ£o encontrado em /backend/");
} else {
  console.log("âœ” server.js encontrado");
}

if (!fs.existsSync(pkgPath)) {
  console.error("âŒ ERRO: package.json nÃ£o encontrado em /backend/");
} else {
  console.log("âœ” package.json encontrado");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));

  if (!pkg.scripts || !pkg.scripts.start) {
    console.error("âŒ ERRO: package.json nÃ£o tem script start");
  } else {
    console.log("âœ” script start OK â†’", pkg.scripts.start);
  }

  if (pkg.main !== "server.js") {
    console.error("âŒ ERRO: main deve ser 'server.js'");
  } else {
    console.log("âœ” main OK");
  }
}

console.log("\nðŸ VerificaÃ§Ã£o concluÃ­da.");

