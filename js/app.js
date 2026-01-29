console.log("APP.JS carregado!");

const STORAGE_KEY = "finance-tracker:transactions";
const filterTypeEl = document.querySelector("#filter-type");
const searchtextEl = document.querySelector("#search-text");
const form = document.querySelector("form");
const tbody = document.querySelector("#transactions-body");
const incomeTotalEl = document.querySelector("#income-total");
const expenseTotalEl = document.querySelector("#expense-total");
const balanceTotalEl = document.querySelector("#balance-total");

console.log("Resumo elements:",{
  incomeTotalEl,
  expenseTotalEl,
  balanceTotalEl,
}); 

// Estado da aplicação: começa vazio
let transactions = loadTransactions();

// Gera um id simples e único o suficiente para nosso estudo
function createId() {
  return String(Date.now()) + "-" + String(Math.floor(Math.random() * 100000));
}

function formatBRL(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function getFilteredTransactions() {
  const typeFilter = filterTypeEl.value; // all | income | expense
  const search = searchtextEl.value.toLowerCase().trim();

  return transactions.filter((tx) => {
    const matchesType = typeFilter === "all" || tx.type === typeFilter;

    const categoryText = (tx.category || "").toLowerCase();
    const descriptionText = (tx.description || "").toLowerCase();

    const matchesSearch =
      search === "" ||
      categoryText.includes(search) ||
      descriptionText.includes(search);

    return matchesType && matchesSearch;
  });
}

function renderTransactions() {
  const filtered = getFilteredTransactions();

  tbody.innerHTML = "";

  for (const tx of filtered) {
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

  // Cria as linhas
  const filtered = getFilteredTransactions();
  for (const tx of filtered) {
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

function renderSummary() {
  let income = 0;
  let expense = 0;
  for (const tx of transactions) {
    if (tx.type === "income") income += tx.amount;
    if (tx.type === "expense") expense += tx.amount;
  }

  const balance = income - expense;

  incomeTotalEl.textContent = formatBRL(income);
  expenseTotalEl.textContent = formatBRL(expense);
  balanceTotalEl.textContent = formatBRL(balance);
}
function saveTransactions() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }

  function loadTransactions() {
   const raw = localStorage.getItem(STORAGE_KEY);
   if (!raw) return[];

   try {
    const data = JSON.parse (raw);
    if (!Array.isArray(data)) return[];

    return data;
   } catch {
    return[];
   }
  }   

// Delegação de eventos: 1 listener no tbody
tbody.addEventListener("click", function (event) {
  const btn = event.target.closest("button");
  if (!btn) return;

  const action = btn.dataset.action;
  const id = btn.dataset.id;

  if (action === "delete") {
    const ok = confirm("Tem certeza que deseja excluir?");
    if (!ok) return;

    transactions = transactions.filter((tx) => tx.id !== id);
    saveTransactions();

    renderTransactions();
    renderSummary();
  }
});

form.addEventListener("submit", function (event) {
  event.preventDefault();
  console.log("submit capturado");
  const type = document.querySelector("#type").value;
  const amount = Number(document.querySelector("#amount").value);
  const date = document.querySelector("#date").value;
  const category = document.querySelector("#category").value;
  const description = document.querySelector("#description").value;

  // Validações básicas
  if (!type || !date || !category) {
    alert("Preencha todos os campos obrigatórios.");
    return;
  }

  if (Number.isNaN(amount) || amount <= 0) {
    alert("Informe um valor válido maior que zero.");
    return;
  }

  const tx = {
    id: createId(),
    type,
    amount,
    date,
    category,
    description,
  };

  transactions.push(tx);
  saveTransactions();

  renderTransactions();
  renderSummary();
  

  form.reset();
});

filterTypeEl.addEventListener("change", renderTransactions);
searchtextEl.addEventListener("input", renderTransactions);
renderTransactions();
renderSummary();

