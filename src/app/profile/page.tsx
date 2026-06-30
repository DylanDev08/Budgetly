import { User } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { requireUser } from "@/lib/auth/require-user";
import { ProfileAvatarForm } from "@/features/profile/ProfileAvatarForm";

export default async function ProfilePage() {
  const { profile } = await requireUser();

  return (
    <>
      <PageHeader title="Perfil" description="Avatar, identidad y datos principales de tu cuenta." icon={User} />
      <main className="p-5 sm:p-8">
        <ProfileAvatarForm profile={profile} />
      </main>
    </>
  );
}
