// ===============================
// FUNÇÕES UTILITÁRIAS
// ===============================

export function $(selector) {
  return document.querySelector(selector);
}

export function $all(selector) {
  return document.querySelectorAll(selector);
}

// --------------------------------
// Máscaras
// --------------------------------

export const maskCPF = (value) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};

export const maskPhone = (value) => {
  return value
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/g, "($1) $2")
    .replace(/(\d{5})(\d{4})$/, "$1-$2");
};

// --------------------------------
// Popular <select>
// --------------------------------

export function popularSelect(selectId, lista) {
  const el = document.getElementById(selectId);
  if (!el) return;

  el.innerHTML = "";
  lista.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.toLowerCase();
    option.textContent = item;
    el.appendChild(option);
  });
}

// --------------------------------
// Leitura de parâmetros da URL
// --------------------------------

export function getURLParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}
