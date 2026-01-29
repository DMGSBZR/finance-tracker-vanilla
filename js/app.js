const form = document.querySelector("form");

const tbody = document.querySelector("#transactions-body");

const incomeTotalEl = document.querySelector("#income-total");
const expenseTotalEl = document.querySelector("#expense-total");
const balanceTotalEl = document.querySelector("#balance-total");

// Estado da aplicação: começa vazio
let transactions = [];

// Gera um id simples e único o suficiente para nosso estudo
function createId() {
  return String(Date.now()) + "-" + String(Math.floor(Math.random() * 100000));
}

function formatBRL(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function renderTransactions() {
  // Limpa a tabela
  tbody.innerHTML = "";

  // Cria as linhas
  for (const tx of transactions) {
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

    renderTransactions();
    renderSummary();
  }
});

form.addEventListener("submit", function (event) {
  event.preventDefault();

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

  renderTransactions();
  renderSummary();

  form.reset();
});
