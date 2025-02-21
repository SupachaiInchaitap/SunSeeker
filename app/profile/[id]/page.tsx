"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/cilent";
import { useUser } from "@/hooks/useUser";
import { useParams } from "next/navigation";

export default function ProfilePage() {
  const supabase = createClient();
  const useuserData = useUser();
  
  const [userData, setUserData] = useState<{ username: string; avatar_url?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const useuser = useuserData?.user as { id: string } | null; // ✅ Fix: Explicitly define type
  const isUserLoading = useuserData?.isLoading;
  const userError = useuserData?.error;

  const params = useParams();
  const id = params?.id as string;

  const fetchUserData = async () => {
    if (!useuser?.id) return; // ✅ Prevent fetching if no user

    try {
      console.log("Fetching user data for ID:", useuser.id);
      const { data, error } = await supabase
        .from("users")
        .select("username")
        .eq("id", id) // ✅ Make sure column matches DB
        .single();

      if (error) throw error;
      setUserData(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (useuser && !isUserLoading) {
      fetchUserData();
    }
  }, [useuser, isUserLoading]);

  if (loading) return <div>Loading profile...</div>;
  if (userError || !userData) return <div>Error fetching profile.</div>;

  return (
    <div className="w-full mt-14">
      <div className="flex flex-col items-center">
        <p className="font-medium text-xl text-secondary">
          {userData?.username || "No Username"}
        </p>
      </div>
    </div>
  );
}
