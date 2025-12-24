// seedUsuario.js
const bcrypt = require("bcryptjs");
const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = "https://vepnalrpyaxhpklicqrb.supabase.co";
// Use a SERVICE ROLE KEY no ambiente do servidor (NÃO exponha no front)
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function criarUsuario(rf, senha, nome) {
  const hash = await bcrypt.hash(senha, 10);

  const { data, error } = await supabase
    .from("usuarios_logon")
    .insert([{ rf, senha_hash: hash, nome }]);

  if (error) {
    console.error("Erro ao inserir:", error);
  } else {
    console.log("Usuário criado:", data);
  }
}

// Exemplo:
criarUsuario("12345", "senha123", "Usuário Teste");
