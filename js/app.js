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
  renderEmptyState,
  hideEmptyState,
  renderLoadingRows,
  showFeedback,
  clearFeedback,
  setFieldError,
  clearAllFieldErrors,
  focusFirstInvalid,
  clearFieldError,
} from "./ui.js";
import { getFilteredTransactions } from "./filters.js";
console.log("APP.JS carregado!");

// ESTADO DE UI
let editingId = null;
let searchDebounceTimer = null;
let refreshToken = 0;


// DOM

const form = document.querySelector("#transaction-form");
const filterTypeEl = document.querySelector("#filter-type");
const searchEl = document.querySelector("#search-text");
const tbody = document.querySelector("#transactions-body");
const cancelEditBtn = document.querySelector("#cancel-edit");
const FORM_FIELD_IDS = ["type", "amount", "date", "category", "description"];
const submitBtn = form.querySelector('button[type="submit"]');
const sortByEl = document.querySelector("#sort-by");
const clearBtn = document.querySelector('#clear-filters');


// FUNÇÕES

function refresh() {
  syncClearButton();

  refreshToken += 1;
  const token = refreshToken;

  const allNow = getTransactions();
  if (allNow.length === 0) {
    renderTransactions([]);
    renderSummary();
    renderEmptyState({
      title: "Nenhuma transação ainda",
      text: "Adicione sua primeira receita ou despesa para ver o resumo aqui.",
      showClearAction: false,
    });
    return;
  }

  renderLoadingRows(3);

  setTimeout(() => {
    if (token !== refreshToken) return;

    const visible = getFilteredTransactions(
      filterTypeEl.value,
      searchEl.value,
      sortByEl.value
    );

    renderTransactions(visible);
    renderSummary();

    if (visible.length === 0) {
      renderEmptyState({
        title: "Nenhuma transação encontrada",
        text: "Ajuste a busca ou limpe os filtros para ver resultados.",
        showClearAction: true,
      });
      return;
    }

    hideEmptyState();
  }, 150);
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
  const row = btn.closest("tr");
  row?.classList.add("is-removing");

  // espera a transição e então remove de fato
  setTimeout(() => {
    deleteTransaction(id);
    refresh();
    showFeedback("Transação removida.", "success");
    searchEl.focus();
  }, 150);

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

// FILTROS/ BUSCA/ ORDENAÇÃO  
filterTypeEl.addEventListener("change", refresh);
searchEl.addEventListener("input", () => {
  clearTimeout(searchDebounceTimer);

  searchDebounceTimer = setTimeout(() => {
    refresh();
  }, 300);
});
sortByEl.addEventListener("change", refresh);

clearBtn?.addEventListener("click", clearFiltersAndSearch);

// Delegação: botão "Limpar" que aparece dentro do ui-state
document.addEventListener("click", (event) => {
  const btn = event.target.closest('[data-action="clear"]');
  if (!btn) return;
  clearFiltersAndSearch();
});

function syncClearButton() {
  if (!clearBtn) return;

  const hasTypeFilter = filterTypeEl.value !== "all";
  const hasSearch = searchEl.value.trim().length > 0;
  const hasSort = sortByEl.value !== "date-desc";

  clearBtn.disabled = !(hasTypeFilter || hasSearch || hasSort);
}

function clearFiltersAndSearch() {
  filterTypeEl.value = "all";
  searchEl.value = "";
  sortByEl.value = "date-desc";

  searchEl.focus();
  refresh();
}

// RENDERIZAÇÃO INICIAL
refresh();