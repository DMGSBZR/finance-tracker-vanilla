const STORAGE_KEY = "finance-tracker:transactions";

let transactions = loadTransactions();

function loadTransactions() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function saveTransactions() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

export function getTransactions() {
  return transactions;
}

export function addTransaction(tx) {
  transactions.push(tx);
  saveTransactions();
}

export function deleteTransaction(id) {
  transactions = transactions.filter((tx) => tx.id !== id);
  saveTransactions();
}
export function updateTransaction(updatedTx) {
  transactions = transactions.map((tx) =>
    tx.id === updatedTx.id ? updatedTx : tx
  );
  saveTransactions();
}