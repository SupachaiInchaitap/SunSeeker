import { createClient } from "@/utils/supabase/server";
import Navbar from "./Navbar";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <>
      <Navbar user={user} />
      <main>{children}</main>
    </>
  );
}
