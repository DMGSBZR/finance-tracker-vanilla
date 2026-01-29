export function createId() {
  return String(Date.now()) + "-" + String(Math.floor(Math.random() * 100000));
}

export function formatBRL(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
export function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

export function parseAmount(raw) {
  if (typeof raw !== "string") return NaN;

  let s = raw.trim().replace(/\s+/g, "");
  if (!s) return NaN;

  const hasComma = s.includes(",");
  const hasDot = s.includes(".");

  // Se tem vírgula e ponto, o ÚLTIMO separador é o decimal.
  if (hasComma && hasDot) {
    const lastComma = s.lastIndexOf(",");
    const lastDot = s.lastIndexOf(".");

    const decimalSep = lastComma > lastDot ? "," : ".";
    const thousandSep = decimalSep === "," ? "." : ",";

    // remove separador de milhar e normaliza decimal para "."
    s = s.split(thousandSep).join("");
    s = s.replace(decimalSep, ".");
    return Number(s);
  }

  // Se só tem vírgula, assume vírgula como decimal
  if (hasComma) {
    s = s.split(".").join(""); // se tiver ponto perdido, remove como milhar
    s = s.replace(",", ".");
    return Number(s);
  }

  // Se só tem ponto, assume ponto como decimal (não remove!)
  if (hasDot) {
    // opcional: se alguém digitar "1.234" querendo milhar, aqui vira 1.234
    // (mais seguro pra UX no seu caso, porque "10.50" tem que ser 10.5)
    return Number(s);
  }

  // Só dígitos
  return Number(s);
}

export function isValidAmount(value) {
  return Number.isFinite(value) && value > 0;
}

export function isValidType(type) {
  return type === "income" || type === "expense";
}

export function isValidISODate(dateStr) {
  if (!isNonEmptyString(dateStr)) return false;
  const d = new Date(dateStr);
  return !Number.isNaN(d.getTime());
}

export function validateTransaction({ type, amountRaw, date, category }) {
  const errors = {};

  if (!isValidType(type)) {
    errors.type = "Selecione se é receita ou despesa.";
  }

  const amount = parseAmount(amountRaw);
  if (!isValidAmount(amount)) {
    errors.amount = "Informe um valor válido maior que zero.";
  }

  if (!isValidISODate(date)) {
    errors.date = "Informe uma data válida.";
  }

  if (!isNonEmptyString(category)) {
    errors.category = "Informe uma categoria (ex: Mercado, Salário).";
  } else if (category.trim().length < 2) {
    errors.category = "Categoria muito curta. Use pelo menos 2 caracteres.";
  }

  return { ok: Object.keys(errors).length === 0, errors, amount };
}