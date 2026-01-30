import { createId, validateTransaction } from "./utils.js";
import {
  addTransaction,
  deleteTransaction,
  updateTransaction,
  getTransactions,
} from "./store.js";
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

console.log("APP.JS carregado!");

// ESTADO DE UI
let editingId = null;


// DOM

const form = document.querySelector("#transaction-form");
const filterTypeEl = document.querySelector("#filter-type");
const searchEl = document.querySelector("#search-text");
const tbody = document.querySelector("#transactions-body");
const cancelEditBtn = document.querySelector("#cancel-edit");
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

 if (editingId) {
  updateTransaction({ ...tx, id: editingId });
  editingId = null;
  showFeedback("Transação atualizada com sucesso!", "success");
} else {
  addTransaction(tx);
  showFeedback("Transação adicionada com sucesso!", "success");
}

form.reset();
refresh();
submitBtn?.removeAttribute("disabled");
});

tbody.addEventListener("click", (event) => {
  const btn = event.target.closest("button");
  if (!btn) return;

  const action = btn.dataset.action;
  const id = btn.dataset.id;

  if (action === "delete") {
    deleteTransaction(id);
    refresh();
    showFeedback("Transação removida.", "success");
    return;
  }

  if (action === "edit") {
  const tx = getTransactions().find((t) => t.id === id);
  if (!tx) return;

  editingId = id;

  // preencher formulário (campos do form!)
  form.type.value = tx.type;
  form.amount.value = tx.amount;
  form.date.value = tx.date;
  form.category.value = tx.category;
  form.description.value = tx.description || "";

  cancelEditBtn.hidden = false;
  submitBtn.textContent = "Salvar";

  showFeedback("Editando transação. Altere os campos e salve.", "success");
}
});

cancelEditBtn.addEventListener("click", () => {
  editingId = null;
  form.reset();
  cancelEditBtn.hidden = true;
  form.querySelector('button[type="submit"]').textContent = "Adicionar";
  clearFeedback();
});

cancelEditBtn.hidden = true;
submitBtn.textContent = "Adicionar";
form.querySelector('button[type="submit"]').textContent = "Adicionar";

FORM_FIELD_IDS.forEach((id) => {
  const el = document.querySelector(`#${id}`);
  if (!el) return;

  el.addEventListener("input", () => {
    clearFieldError(id);
  });
});

refresh();
