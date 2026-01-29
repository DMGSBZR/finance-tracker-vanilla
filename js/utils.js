export function createId() {
  return String(Date.now()) + "-" + String(Math.floor(Math.random() * 100000));
}

export function formatBRL(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
