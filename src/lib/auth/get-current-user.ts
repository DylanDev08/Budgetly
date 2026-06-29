import { getAuthenticatedUser } from "@/lib/auth/getAuthenticatedUser";

export async function getCurrentUser() {
  const { user } = await getAuthenticatedUser();

  return user;
}
