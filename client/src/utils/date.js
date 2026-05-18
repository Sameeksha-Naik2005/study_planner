export function toISODate(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function daysUntil(dateValue) {
  const today = new Date(toISODate());
  const target = new Date(dateValue);
  return Math.max(0, Math.ceil((target - today) / 86400000));
}

export function formatShortDate(dateValue) {
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(dateValue));
}
