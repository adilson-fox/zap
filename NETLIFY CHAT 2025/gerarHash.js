// gerarHash.js
const bcrypt = require("bcryptjs");

async function gerarHash() {
  const senha = "senha123"; // troque para a senha que você quer usar
  const hash = await bcrypt.hash(senha, 10); // custo 10
  console.log("Senha:", senha);
  console.log("Hash:", hash);
}

gerarHash();
