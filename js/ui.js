import { formatBRL } from "./utils.js";
import { getTransactions } from "./store.js";
//seletores de elementos "fixos" da UI(cache simples)
const feedbackEl = document.querySelector("#feedback");
const uiStateEl = document.querySelector("#ui-state");


export function renderTransactions(list) {
  const tbody = document.querySelector("#transactions-body");
  tbody.innerHTML = "";

  for (const tx of list) {
    const tr = document.createElement("tr");
    tr.dataset.id = tx.id;
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

export function renderEmptyState({title, text, showClearAction = false}) {
  if (!uiStateEl) return;

  uiStateEl.innerHTML = `
    <div class="ui-state__title">${title}</div>
    <div class="ui-state__text">${text}</div>
    <div class="ui-state__actions">
      ${
        showClearAction
        ? '<button type="button" class="btn btn-secondary" data-action="clear">Limpar filtros e busca</button>'
        : ""
      }
    </div>
  `;
  uiStateEl.hidden= false;
}

export function hideEmptyState() {
  if (!uiStateEl) return;

  uiStateEl.style.opacity = "0";

  setTimeout(() => {
    uiStateEl.hidden = true;
    uiStateEl.innerHTML = "";
    uiStateEl.style.opacity = "";
  }, 150);
}

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
export function renderLoadingRows(count = 3) {
  const tbody = document.querySelector("#transactions-body");
  if (!tbody) return;

  tbody.innerHTML = "";

  for (let i = 0; i < count; i++) {
    const tr = document.createElement("tr");
    tr.className = "skeleton-row";

    tr.innerHTML = `
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    `;

    tbody.appendChild(tr);
  }
}
