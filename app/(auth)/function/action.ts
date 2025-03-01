"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

// ------------------- LOGIN FUNCTION -------------------
export async function login(formData: FormData) {
  const supabase = createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  // Attempt login
  const { data, error } = await (await supabase).auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  console.log("User logged in:", data.user?.id);

  // Insert user into `users` table if email is confirmed
  await insertUserAfterConfirmation();

  // Redirect after successful login
  redirect("/"); // Redirect to homepage after login
}
// --------------------------------------------------------

// ------------------- SIGNUP FUNCTION -------------------
export async function signup(formData: FormData) {
  const supabase = createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const username = formData.get("username") as string;

  if (!email || !password || !username) {
    return { error: "Email, password, and username are required" };
  }

  const { error } = await (await supabase).auth.signUp({
    email,
    password,
    options: {
      data: { display_name: username }, // Store username in the `display_name` field in Supabase Auth
    },
  });

  if (error) {
    console.error("Signup Error:", error);
    return { error: error.message };
  }

  console.log("User signed up. Waiting for email confirmation...");
  return { message: "Please check your email to confirm your account." };
}
// --------------------------------------------------------

// ------------------- INSERT USER AFTER CONFIRMATION -------------------
export async function insertUserAfterConfirmation() {
  const supabase = createClient();
  const { data, error } = await (await supabase).auth.getUser();

  if (error || !data?.user) {
    console.error("Auth Error or User Not Found:", error);
    return;
  }

  const userId = data.user.id;
  const emailConfirmed = data.user.email_confirmed_at;

  if (!emailConfirmed) {
    console.log("User email not confirmed yet.");
    return;
  }

  console.log("User confirmed! Inserting into users table...");

  // 🔹 Check if user already exists in `users` table
  const { data: existingUser, error: checkError } = await (await supabase)
    .from("users")
    .select("id")
    .eq("id", userId)
    .maybeSingle(); // Use maybeSingle() to avoid errors if no row is found

  if (checkError) {
    console.error("Error checking existing user:", checkError);
    return;
  }

  if (existingUser) {
    console.log("User already exists in users table. Skipping insert.");
    return;
  }

  // 🔹 Get username and email from user metadata (stored in `display_name` and `email`)
  const username = data.user.user_metadata.display_name;
  const email = data.user.email;

  // 🔹 Insert user data (username and email) into `users` table (custom table)
  const { error: dbError } = await (await supabase).from("users").insert([
    {
      id: userId,
      username: username, // Insert username
      email: email,       // Insert email
    },
  ]);

  if (dbError) {
    console.error("Database Insert Error:", dbError);
  } else {
    console.log("User successfully inserted into users table!");
  }
}


// ------------------- LOGOUT FUNCTION -------------------
export async function logout() {
  "use server";
  const supabase = createClient();
  await (await supabase).auth.signOut();
  // Redirect after logout to the weather page (or anywhere else)
  redirect("/");
}
// --------------------------------------------------------
