import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { newUsername } = await req.json();

  // Get authenticated user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
  }

  const userId = user.id;
  console.log("Authenticated user ID:", userId);

  // Step 1️⃣: Update `display_name` in `auth.users`
  const { error: authError } = await supabase.auth.updateUser({
    data: { display_name: newUsername },
  });

  if (authError) {
    return NextResponse.json({ error: "Failed to update display name" }, { status: 500 });
  }

  // Step 2️⃣: Update `username` in custom `users` table
  const { data: existingUser, error: checkError } = await supabase
    .from("users")
    .select("id")
    .eq("id", userId)
    .maybeSingle();

  if (checkError) {
    return NextResponse.json({ error: "Failed to check user existence" }, { status: 500 });
  }

  if (existingUser) {
    // Update existing user
    const { error: updateError } = await supabase
      .from("users")
      .update({ username: newUsername })
      .eq("id", userId);

    if (updateError) {
      return NextResponse.json({ error: "Failed to update username in users table" }, { status: 500 });
    }
  } else {
    // Insert new user if not found
    const { error: insertError } = await supabase
      .from("users")
      .insert([{ id: userId, username: newUsername, email: user.email }]);

    if (insertError) {
      return NextResponse.json({ error: "Failed to insert new user" }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true, updatedUsername: newUsername });
}
