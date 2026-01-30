import { formatBRL } from "./utils.js";
import { getTransactions } from "./store.js";
import { getFilteredTransactions } from "./filters.js";

export function renderTransactions(typeFilter, search,sortBy) {
  const tbody = document.querySelector("#transactions-body");
  tbody.innerHTML = "";

  const list = getFilteredTransactions(typeFilter, search,sortBy);

  for (const tx of list) {
    const tr = document.createElement("tr");
    const typeLabel = tx.type === "income" ? "Receita" : "Despesa";

    tr.innerHTML = `
      <td>${tx.date}</td>
      <td>${typeLabel}</td>
      <td>${tx.category}</td>
      <td>${tx.description || ""}</td>
      <td>${formatBRL(tx.amount)}</td>
      <td>
        <button data-action="edit" data-id="${tx.id}">Editar</button>
        <button data-action="delete" data-id="${tx.id}">Excluir</button>
      </td>
    `;

    tbody.appendChild(tr);
  }
}


export function renderSummary() {
  const incomeEl = document.querySelector("#income-total");
  const expenseEl = document.querySelector("#expense-total");
  const balanceEl = document.querySelector("#balance-total");

  let income = 0;
  let expense = 0;

  for (const tx of getTransactions()) {
    if (tx.type === "income") income += tx.amount;
    if (tx.type === "expense") expense += tx.amount;
  }

  incomeEl.textContent = formatBRL(income);
  expenseEl.textContent = formatBRL(expense);
  balanceEl.textContent = formatBRL(income - expense);
}
const feedbackEl = document.querySelector("#feedback");

let feedbackTimer = null;

export function showFeedback(message, type = "success") {
  if (!feedbackEl) return;

  feedbackEl.textContent = message;
  feedbackEl.classList.remove("feedback--success", "feedback--error");

  if (type === "error") feedbackEl.classList.add("feedback--error");
  else feedbackEl.classList.add("feedback--success");

  // auto-hide (principalmente para sucesso)
  if (feedbackTimer) clearTimeout(feedbackTimer);

  const ms = type === "success" ? 2500 : 5000;
  feedbackTimer = setTimeout(() => {
    clearFeedback();
  }, ms);
}


export function clearFeedback() {
  if (!feedbackEl) return;

  feedbackEl.textContent = "";
  feedbackEl.classList.remove("feedback--success", "feedback--error");
}

function getFieldElements(fieldId) {
  const input = document.querySelector(`#${fieldId}`);
  const error = document.querySelector(`#${fieldId}-error`);
  return { input, error };
}

export function setFieldError(fieldId, message) {
  const { input, error } = getFieldElements(fieldId);
  if (!input || !error) return;

  error.textContent = message;

  input.classList.add("is-invalid");
  input.setAttribute("aria-invalid", "true");
  input.setAttribute("aria-describedby", `${fieldId}-error`);
}

export function clearFieldError(fieldId) {
  const { input, error } = getFieldElements(fieldId);
  if (!input || !error) return;

  error.textContent = "";

  input.classList.remove("is-invalid");
  input.removeAttribute("aria-invalid");
  input.removeAttribute("aria-describedby");
}

export function clearAllFieldErrors(fieldIds = []) {
  fieldIds.forEach(clearFieldError);
}

export function focusFirstInvalid(errors) {
  const firstField = Object.keys(errors || {})[0];
  if (!firstField) return;

  const el = document.querySelector(`#${firstField}`);
  if (el) el.focus();
}