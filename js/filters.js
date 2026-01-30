import { getTransactions } from "./store.js";

export function getFilteredTransactions(typeFilter, search, sortBy = "date-desc") {
  const text = (search || "").toLowerCase().trim();

  const filtered = getTransactions().filter((tx) => {
    const matchesType = typeFilter === "all" || tx.type === typeFilter;

    const category = (tx.category || "").toLowerCase();
    const description = (tx.description || "").toLowerCase();

    const matchesSearch =
      text === "" || category.includes(text) || description.includes(text);

    return matchesType && matchesSearch;
  });

  // IMPORTANTE: criar cópia antes de ordenar
  const sorted = [...filtered];

  sorted.sort((a, b) => {
    if (sortBy === "date-desc") return b.date.localeCompare(a.date);
    if (sortBy === "date-asc") return a.date.localeCompare(b.date);

    if (sortBy === "amount-desc") return b.amount - a.amount;
    if (sortBy === "amount-asc") return a.amount - b.amount;

    return 0;
  });

  return sorted;
}
