console.log("APP.JS carregado!");
import { createId } from "./utils.js";
import { addTransaction, deleteTransaction } from "./store.js";
import { renderTransactions, renderSummary } from "./ui.js";

const form = document.querySelector("form");
const filterTypeEl = document.querySelector("#filter-type");
const searchEl = document.querySelector("#search-text");
const tbody = document.querySelector("#transactions-body");

function refresh() {
  renderTransactions(filterTypeEl.value, searchEl.value);
  renderSummary();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const tx = {
    id: createId(),
    type: type.value,
    amount: Number(amount.value),
    date: date.value,
    category: category.value,
    description: description.value,
  };

  addTransaction(tx);
  form.reset();
  refresh();
});

tbody.addEventListener("click", (event) => {
  const btn = event.target.closest("button");
  if (!btn) return;

  deleteTransaction(btn.dataset.id);
  refresh();
});

filterTypeEl.addEventListener("change", refresh);
searchEl.addEventListener("input", refresh);

refresh();
