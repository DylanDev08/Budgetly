import { PageHeader } from "@/components/ui/PageHeader";
import { RegisterForm } from "@/features/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <>
      <PageHeader
        title="Registro"
        description="Alta de usuario preparada para Supabase Auth y conexion personal de Mercado Pago."
      />
      <div className="p-5 sm:p-8">
        <RegisterForm />
      </div>
    </>
  );
}
