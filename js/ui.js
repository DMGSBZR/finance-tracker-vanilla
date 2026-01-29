import { formatBRL } from "./utils.js";
import { getTransactions } from "./store.js";
import { getFilteredTransactions } from "./filters.js";

export function renderTransactions(typeFilter, search) {
  const tbody = document.querySelector("#transactions-body");
  tbody.innerHTML = "";

  const list = getFilteredTransactions(typeFilter, search);

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
