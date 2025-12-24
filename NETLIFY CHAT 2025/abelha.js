// ==========================================
// ABEHLA.JS — LÓGICA PRINCIPAL DA PÁGINA
// ==========================================

import { dbGet, dbUpsert } from "./supabase-client.js";
import {
  $,
  $all,
  maskCPF,
  maskPhone,
  popularSelect,
  getURLParam,
} from "./utils.js";

// ==========================================
// LISTAS ANEXO 6
// ==========================================

const ANEXO6_TIPOS_IMOVEL = [
  "Comércio",
  "Residência",
  "Terreno baldio",
  "Escola",
  "Área pública",
  "Outros",
];

const ANEXO6_SITUACOES_IMOVEL = [
  "Casa aberta",
  "Fechada",
  "Alugada",
  "Desocupada",
  "Em reforma",
  "Outras",
];

// ==========================================
// MAPA ENTRE CAMPOS E ELEMENTOS HTML
// ==========================================

const FIELD_MAP = {
  obs_registro: "obs-registro",
  dt_v1: "dt_v1",
  dt_v2: "dt_v2",
  dt_v3: "dt_v3",
  tipo_imovel: "tipo-imovel",
  situacao_imovel: "situacao-imovel",
  evento: "evento",
  area_ninho: "area-ninho",
  loc_ninho: "loc-ninho",
  loc_outros: "loc-outros",
  altura_terrea: "alt-terrea",
  altura_sobrado: "alt-sobrado",
  medida_adotada: "medida-adotada",
  motivo_nao: "motivo-nao",
  himenopterismo: "himenopterismo",
  unidade_medica: "unidade-medica",
  controle: "controle",
  produto_quantidade: "produto-quantidade",
  relatorio_campo: "relatorio-campo",
  nome_municipe: "nome-municipe",
  cpf: "cpf",
  telefone: "telefone",
  equipe: "equipe",
};

// ==========================================
// FUNÇÃO: CARREGAR OS
// ==========================================

async function carregarOS(osId) {
  try {
    const dados = await dbGet("detalhes_abelha", { os_id: osId });
    if (!dados || dados.length === 0) return;

    const registro = dados[0];

    // Preenchendo campos simples
    for (const key in FIELD_MAP) {
      const el = document.getElementById(FIELD_MAP[key]);
      if (el && registro[key] !== undefined && registro[key] !== null) {
        el.value = registro[key];
      }
    }

    // Grupo inseto
    if (registro.grupo_inseto) {
      Object.entries(registro.grupo_inseto).forEach(([key, val]) => {
        const el = document.getElementById(`g-${key}`);
        if (el) el.checked = val === true;
      });
    }

    console.log("OS carregada:", registro);
  } catch (err) {
    console.error("Erro ao carregar OS:", err);
    alert("Erro ao carregar OS");
  }
}

// ==========================================
// FUNÇÃO: SALVAR OS
// ==========================================

async function salvarOS() {
  const osId = getURLParam("os_id");

  if (!osId) {
    alert("OS sem ID válido.");
    return;
  }

  const data = { os_id: osId };

  // Campos simples
  for (const key in FIELD_MAP) {
    const el = document.getElementById(FIELD_MAP[key]);
    if (el) data[key] = el.value.trim();
  }

  // Grupo inseto
  data.grupo_inseto = {
    africanizada: $("#g-afric")?.checked || false,
    vespa_marimbondo: $("#g-vespa")?.checked || false,
    arapua: $("#g-arapua")?.checked || false,
    jatai: $("#g-jatai")?.checked || false,
    outra: $("#g-outra")?.checked || false,
  };

  try {
    await dbUpsert("detalhes_abelha", data, "os_id");
    alert("OS salva com sucesso!");
  } catch (err) {
    alert("Erro ao salvar OS");
    console.error(err);
  }
}

// ==========================================
// MÁSCARAS
// ==========================================

function aplicarMascaras() {
  $("#cpf").addEventListener("input", (e) => {
    e.target.value = maskCPF(e.target.value);
  });

  $("#telefone").addEventListener("input", (e) => {
    e.target.value = maskPhone(e.target.value);
  });
}

// ==========================================
// EVENTOS INICIAIS
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  console.log("Página Abelha carregada");

  // Popula selects
  popularSelect("tipo-imovel", ANEXO6_TIPOS_IMOVEL);
  popularSelect("situacao-imovel", ANEXO6_SITUACOES_IMOVEL);

  // Aplica máscaras
  aplicarMascaras();

  // Botão salvar
  $(".command-button").addEventListener("click", salvarOS);

  // Carregar dados da OS
  const osId = getURLParam("os_id");
  if (osId) carregarOS(osId);
});
