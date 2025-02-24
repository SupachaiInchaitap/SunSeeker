import { NextResponse } from "next/server";
import { getUser } from "@/utils/supabase/getUser"; // Make sure this path is correct!
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabase = createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    cookies: {
      get: async (name) => (await cookies()).get(name)?.value,
    },
  }
);

export async function GET(request: Request) {
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ isFavorite: false }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");

  const { data, error } = await supabase
    .from("user_favorites")
    .select("*")
    .eq("user_id", user.id)
    .eq("city_name", city);

  if (error) {
    console.error("Supabase Error:", error);
    return NextResponse.json({ isFavorite: false });
  }

  return NextResponse.json({ isFavorite: data.length > 0 });
}

export async function POST(request: Request) {
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const { city, lat, lon } = await request.json();

  const { error } = await supabase.from("user_favorites").insert({
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

export async function DELETE(request: Request) {
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const { city } = await request.json();

  const { error } = await supabase
    .from("user_favorites")
    .delete()
    .eq("user_id", user.id)
    .eq("city_name", city);

  if (error) {
    console.error("Supabase Error:", error);
    return NextResponse.json({ success: false });
  }

  return NextResponse.json({ success: true });
}
