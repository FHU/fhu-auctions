/**
 * Format one CSV cell: always quoted, quotes doubled, and values that a
 * spreadsheet would treat as a formula (=, +, -, @, tab, CR) prefixed with
 * an apostrophe so exported user text can't run as a formula (CSV injection).
 */
export function csvCell(
  value: string | number | boolean | null | undefined,
): string {
  if (value === null || value === undefined) return '""';
  let text = String(value);
  if (typeof value === "string" && /^[=+\-@\t\r]/.test(text)) {
    text = `'${text}`;
  }
  return `"${text.replace(/"/g, '""')}"`;
}
