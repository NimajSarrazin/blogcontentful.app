import { getAuthUser } from "@/services/auth/auth.service";
import { NavbarClient } from "@/components/layout/navbar-client";

export async function Navbar() {
  const user = await getAuthUser();
  return <NavbarClient initialUser={user} />;
}
