import { getTransactions } from "./store.js";

export function getFilteredTransactions(typeFilter, search) {
  const text = search.toLowerCase().trim();

  return getTransactions().filter((tx) => {
    const matchesType =
      typeFilter === "all" || tx.type === typeFilter;

    const category = (tx.category || "").toLowerCase();
    const description = (tx.description || "").toLowerCase();

    const matchesSearch =
      text === "" ||
      category.includes(text) ||
      description.includes(text);

    return matchesType && matchesSearch;
  });
}
