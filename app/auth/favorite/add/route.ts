import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Helper function to get user from token
async function getUserFromToken(request: Request) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return null;

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    console.error("Supabase Error:", error);
    return null;
  }

  return user;
}

// GET: Check if city is favorite
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");

  const user = await getUserFromToken(request);

  if (!user) {
    return NextResponse.json({ isFavorite: false }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("favorites")
    .select("*")
    .eq("user_id", user.id)
    .eq("city_name", city);

  if (error) {
    console.error("Supabase Error:", error);
    return NextResponse.json({ isFavorite: false });
  }

  return NextResponse.json({ isFavorite: data.length > 0 });
}

// POST: Add city to favorites
export async function POST(request: Request) {
  const { city, lat, lon } = await request.json();

  const user = await getUserFromToken(request);

  if (!user) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const { error } = await supabase.from("favorites").insert({
    user_id: user.id,
    city_name: city,
    lat,
    lon,
  });

  if (error) {
    console.error("Supabase Error:", error);
    return NextResponse.json({ success: false });
  }

  return NextResponse.json({ success: true });
}

// DELETE: Remove city from favorites
export async function DELETE(request: Request) {
  const { city } = await request.json();

  const user = await getUserFromToken(request);

  if (!user) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", user.id)
    .eq("city_name", city);

  if (error) {
    console.error("Supabase Error:", error);
    return NextResponse.json({ success: false });
  }

  return NextResponse.json({ success: true });
}