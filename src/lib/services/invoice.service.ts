export function buildInternalInvoiceNumber(prefix = "BUD") {
  return `${prefix}-${new Date().getFullYear()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
}
