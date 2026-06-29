export type FinanceCategoryKind = "income" | "expense" | "both";

export type FinanceCategory = {
  label: string;
  value: string;
  kind: FinanceCategoryKind;
  subcategories: string[];
};

export const financeCategories: FinanceCategory[] = [
  {
    label: "Ingresos",
    value: "Ingresos",
    kind: "income",
    subcategories: ["Sueldo", "Freelance", "Ventas", "Transferencias", "Reintegros", "Otros ingresos"],
  },
  {
    label: "Comida",
    value: "Comida",
    kind: "expense",
    subcategories: ["Supermercado", "Kiosco", "Delivery", "Restaurantes", "Cafe", "Viandas"],
  },
  {
    label: "Transporte",
    value: "Transporte",
    kind: "expense",
    subcategories: ["Colectivo", "Tren", "Subte", "Nafta", "Peajes", "Mantenimiento"],
  },
  {
    label: "Hogar",
    value: "Hogar",
    kind: "expense",
    subcategories: ["Alquiler", "Servicios", "Internet", "Limpieza", "Muebles", "Reparaciones"],
  },
  {
    label: "Salud",
    value: "Salud",
    kind: "expense",
    subcategories: ["Obra social", "Farmacia", "Consultas", "Gimnasio", "Terapia", "Emergencias"],
  },
  {
    label: "Educacion",
    value: "Educacion",
    kind: "expense",
    subcategories: ["Cursos", "Libros", "Software", "Carrera", "Certificaciones", "Idiomas"],
  },
  {
    label: "Trabajo",
    value: "Trabajo",
    kind: "both",
    subcategories: ["Herramientas", "Equipamiento", "Cowork", "Clientes", "Impuestos", "Honorarios"],
  },
  {
    label: "Ocio",
    value: "Ocio",
    kind: "expense",
    subcategories: ["Streaming", "Salidas", "Juegos", "Viajes", "Eventos", "Regalos"],
  },
  {
    label: "Ahorro e inversion",
    value: "Ahorro e inversion",
    kind: "both",
    subcategories: ["Fondo de emergencia", "Meta personal", "Dolares", "Fondos", "Cripto educativa", "Reserva"],
  },
  {
    label: "Otros",
    value: "Otros",
    kind: "both",
    subcategories: ["Sin clasificar", "Ajuste", "Movimiento unico"],
  },
];

export function getCategoriesForKind(kind: "income" | "expense") {
  return financeCategories.filter((category) => category.kind === kind || category.kind === "both");
}

export function buildCategoryPath(category: string, subcategory?: string | null) {
  return subcategory ? `${category} / ${subcategory}` : category;
}

export function splitCategoryPath(path?: string | null) {
  const [category = "", subcategory = ""] = (path ?? "").split(" / ");

  return { category, subcategory };
}

export const financeCategoryOptions = financeCategories.flatMap((category) => [
  { label: category.label, value: category.value },
  ...category.subcategories.map((subcategory) => ({
    label: `${category.label} / ${subcategory}`,
    value: buildCategoryPath(category.value, subcategory),
  })),
]);
