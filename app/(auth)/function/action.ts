"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

// LOGIN FUNCTION
export async function login(formData: FormData) {
  const supabase = await createClient();
  
  // Check if the user is already logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Prevent login if already authenticated
  if (user) {
    // Optionally return a message or handle as needed
    return { error: "You are already logged in!" }; // Don't redirect here
  }

  // Get input values
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Validate inputs
  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  // Attempt login
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message }; // Return the error message
  }

  // After successful login, redirect to the home page
  revalidatePath("/", "layout");
  redirect("/"); // Only redirect after successful login
}
//--------------------------------------------------------------------------------------------------------------
export async function signup(formData: FormData) {
  const supabase = await createClient();

  // Get input values
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const username = formData.get("username") as string;

  if (!email || !password || !username) {
    return { error: "Email, password, and username are required" };
  }

  // Attempt signup
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name: username }, // Store username in user metadata
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Redirect after successful signup
  revalidatePath("/", "layout");
  redirect("/"); // Redirect to home or wherever you need after signup
}
//-------------------------------------------------------------------------------------------------------------------
// LOGOUT FUNCTION
export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
