const bcrypt = require("bcryptjs");
const { createClient } = require("@supabase/supabase-js");

// === CONFIGURAÇÃO DO SUPABASE ===
const SUPABASE_URL = "https://vepnalrpyaxhpklicqrb.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlcG5hbHJweWF4aHBrbGljcXJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MDgxNzIsImV4cCI6MjA3NzQ4NDE3Mn0.-9_J-RE4IWdaGISGZgAXe6S2MLStG9lVm50suQKr7jY";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// === DADOS DO USUÁRIO ===
const rf = "12345";
const senha = "senha123";
const nome = "João da Silva";

// === Função principal ===
async function cadastrarUsuario() {
  try {
    const senhaHash = await bcrypt.hash(senha, 10);

    const { data, error } = await supabase
      .from("usuarios_logon")
      .insert([
        {
          rf: rf,
          senha_hash: senhaHash,
          nome: nome,
        },
      ]);

    if (error) {
      console.error("Erro ao inserir usuário:", error.message);
    } else {
      console.log("Usuário inserido com sucesso:", data);
    }
  } catch (err) {
    console.error("Erro geral:", err.message);
  }
}

cadastrarUsuario();
