export function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}

export function formatBudgetRange(min: number, max: number) {
  if (min > 0 && max > 0 && min !== max) {
    return `${formatCurrency(min)} - ${formatCurrency(max)}`;
  }

  const resolvedValue = Math.max(min, max);
  return formatCurrency(resolvedValue);
}

export function formatStatusLabel(value: string) {
  return value
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function parseCurrencyInput(value: string) {
  const parsedValue = Number(value.replace(/[^\d.]/g, ""));
  return Number.isFinite(parsedValue) ? parsedValue : 0;
}
