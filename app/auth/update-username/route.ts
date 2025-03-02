/* eslint-disable @typescript-eslint/no-unused-vars */
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { newPassword } = await req.json();

  // Get authenticated user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
  }

  const userId = user.id;

  // 🔹 Update authentication users table (Supabase Auth)
  const { error: authError } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    message: "Password updated successfully!",
  });
}
