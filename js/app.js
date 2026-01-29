console.log("APP.JS carregado!");
import { createId, validateTransaction } from "./utils.js";
import { addTransaction, deleteTransaction } from "./store.js";
import {
  renderTransactions,
  renderSummary,
  showFeedback,
  clearFeedback,
  setFieldError,
  clearAllFieldErrors,
  focusFirstInvalid,
  clearFieldError,
} from "./ui.js";

const form = document.querySelector("#transaction-form");
const filterTypeEl = document.querySelector("#filter-type");
const searchEl = document.querySelector("#search-text");
const tbody = document.querySelector("#transactions-body");

const FORM_FIELD_IDS = ["type", "amount", "date", "category", "description"];
const submitBtn = form.querySelector('button[type="submit"]');

function refresh() {
  renderTransactions(filterTypeEl.value, searchEl.value);
  renderSummary();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  clearFeedback();
  clearAllFieldErrors(FORM_FIELD_IDS);

  submitBtn?.setAttribute("disabled", "disabled");

  const type = form.type.value;
  const amountRaw = form.amount.value;
  const date = form.date.value;
  const category = form.category.value;
  const description = form.description.value;

  const { ok, errors, amount } = validateTransaction({
    type,
    amountRaw,
    date,
    category,
  });

  if (!ok) {
    Object.entries(errors).forEach(([field, message]) => {
      setFieldError(field, message);
    });

    showFeedback("Corrija os campos destacados e tente novamente.", "error");
    focusFirstInvalid(errors);

    submitBtn?.removeAttribute("disabled");
    return;
  }

  const tx = {
    id: createId(),
    type,
    amount,
    date,
    category: category.trim(),
    description: description.trim(),
  };

  addTransaction(tx);
  form.reset();
  refresh();

  showFeedback("Transação adicionada com sucesso!", "success");
  submitBtn?.removeAttribute("disabled");
});

tbody.addEventListener("click", (event) => {
  const btn = event.target.closest("button");
  if (!btn) return;

  deleteTransaction(btn.dataset.id);
  refresh();
});

FORM_FIELD_IDS.forEach((id) => {
  const el = document.querySelector(`#${id}`);
  if (!el) return;

  el.addEventListener("input", () => {
    clearFieldError(id);
  });
});

refresh();
