// ===============================
// SUPABASE CLIENT CENTRALIZADO
// ===============================

// IMPORTANT: substitua com suas chaves reais
const SUPABASE_URL = "https://vepnalrpyaxhpklicqrb.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlcG5hbHJweWF4aHBrbGljcXJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MDgxNzIsImV4cCI6MjA3NzQ4NDE3Mn0.-9_J-RE4IWdaGISGZgAXe6S2MLStG9lVm50suQKr7jY"; // 🔴 Troque antes de usar!

// Inicialização global
export const db = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// -------------------------------
// Função utilitária GET
// -------------------------------
export async function dbGet(table, filters = {}) {
  let query = db.from(table).select("*");

  for (const key of Object.keys(filters)) {
    query = query.eq(key, filters[key]);
  }

  const { data, error } = await query;

  if (error) {
    console.error("❌ dbGet error:", error);
    throw error;
  }

  return data;
}

// -------------------------------
// Função utilitária UPSERT
// -------------------------------
export async function dbUpsert(table, data, key = "id") {
  const { error } = await db
    .from(table)
    .upsert(data, { onConflict: key });

  if (error) {
    console.error("❌ dbUpsert error:", error);
    throw error;
  }

  return true;
}
