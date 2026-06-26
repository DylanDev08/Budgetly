import { PageHeader } from "@/components/ui/PageHeader";
import { LoginForm } from "@/features/auth/LoginForm";

export default function LoginPage() {
  return (
    <>
      <PageHeader title="Login" description="Acceso seguro con validaciones y rate limit en el backend." />
      <div className="p-5 sm:p-8">
        <LoginForm />
      </div>
    </>
  );
}
