
const readline = require('readline');

function criarInterfaceCLI() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

function perguntar(rl, pergunta) {
  return new Promise(resolve => rl.question(pergunta, resolve));
}

module.exports = { criarInterfaceCLI, perguntar };
