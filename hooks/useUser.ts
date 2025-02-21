import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/cilent";

// Create Supabase client only once at the module level
const supabase = createClient();

// Custom Hook สำหรับจัดการข้อมูลผู้ใช้ (user) จาก Supabase
export const useUser = () => {
  const [user, setUser] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;
        setUser(data.user);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []); // ✅ No need for supabase in dependencies

  return { user, isLoading, error };
};
