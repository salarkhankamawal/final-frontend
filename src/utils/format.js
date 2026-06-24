import { format, parseISO, isValid } from "date-fns";

export function formatDate(value, pattern = "MMM d, yyyy") {
  if (!value) return "—";
  const date = typeof value === "string" ? parseISO(value) : value;
  return isValid(date) ? format(date, pattern) : "—";
}

export function formatDateTime(value, pattern = "MMM d, yyyy HH:mm") {
  return formatDate(value, pattern);
}

export function formatTime(value) {
  if (!value) return "—";
  if (typeof value === "string" && /^\d{1,2}:\d{2}$/.test(value.trim())) {
    return value.trim();
  }
  return formatDate(value, "HH:mm");
}

export function formatDuration(value) {
  if (value == null || value === "") return "—";
  if (typeof value === "string" && /h|m/.test(value)) return value;
  const minutes = Number(value);
  if (Number.isNaN(minutes)) return "—";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
}

export function formatCurrency(amount, currency = "USD") {
  if (amount == null) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatStops(stops) {
  if (stops === 0) return "Nonstop";
  if (stops === 1) return "1 stop";
  return `${stops} stops`;
}
