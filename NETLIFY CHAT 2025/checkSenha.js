// checkSenha.js
// Teste simples de verificação de senha com bcryptjs

const bcrypt = require("bcryptjs");

// Hash que você salvou no banco (exemplo gerado com bcrypt.hash)
const hashSalvoNoBanco = "$2a$10$7Qp7xkz5QhFZkzYwYlYQ8uPjz9ZkFzYhFzYhFzYhFzYhFzYhFzYhF";
const senhaDigitada = "senha123";

async function verificarSenha() {
  try {
    const senhaOk = await bcrypt.compare(senhaDigitada, hashSalvoNoBanco);

    if (senhaOk) {
      console.log("✅ Senha correta! Login autorizado.");
    } else {
      console.log("❌ Senha incorreta! Acesso negado.");
    }
  } catch (err) {
    console.error("Erro ao verificar senha:", err);
  }
}

// Chama a função
verificarSenha();
