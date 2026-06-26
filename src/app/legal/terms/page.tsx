import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";

const sections = [
  {
    title: "Uso de la plataforma",
    body: "Budgetly permite organizar informacion financiera personal, registrar movimientos, configurar metas y preparar integraciones con servicios externos. El usuario es responsable de la exactitud de los datos que carga o conecta.",
  },
  {
    title: "Datos e integraciones",
    body: "Las credenciales y tokens de integraciones no deben exponerse en el frontend. Las conexiones con proveedores externos, incluido Mercado Pago, se ejecutan desde endpoints backend y pueden revocarse desde el proveedor correspondiente.",
  },
  {
    title: "Comprobantes internos",
    body: "Los comprobantes generados por Budgetly son documentos internos de control personal. No reemplazan facturas legales, comprobantes fiscales ni documentacion exigida por organismos tributarios.",
  },
  {
    title: "Inversion educativa",
    body: "Las recomendaciones del modulo de inversion son educativas. Budgetly no ejecuta compras, ventas ni operaciones automaticas de inversion, y no reemplaza asesoramiento financiero profesional.",
  },
  {
    title: "Seguridad",
    body: "El acceso a datos por usuario debe protegerse con autenticacion, Row Level Security y politicas de base de datos. El usuario debe mantener sus credenciales seguras y avisar ante accesos no reconocidos.",
  },
];

export default function TermsPage() {
  return (
    <>
      <PageHeader
        title="Terminos y condiciones"
        description="Condiciones de uso, privacidad operativa y alcance funcional de Budgetly."
      />
      <div className="p-5 sm:p-8">
        <Card className="mx-auto max-w-4xl">
          <CardContent className="grid gap-6">
            <p className="text-sm leading-6 text-budget-muted">Ultima actualizacion: 26 de junio de 2026.</p>
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-base font-semibold text-budget-text">{section.title}</h2>
                <p className="mt-2 text-sm leading-6 text-budget-muted">{section.body}</p>
              </section>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
