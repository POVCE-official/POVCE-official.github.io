export function newestFirst(a, b) {
  return (b.date ?? '').localeCompare(a.date ?? '') || a.id.localeCompare(b.id);
}
