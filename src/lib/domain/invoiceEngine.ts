export function getInvoiceType(kind: "income" | "expense") {
  return kind === "income" ? "ingreso" : "egreso";
}
