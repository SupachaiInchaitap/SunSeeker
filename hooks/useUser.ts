import { useState, useEffect } from "react";
import { createClient } from "@/app/utils/supabase/client";

// Create Supabase client only once at the module level
const supabase = createClient();

// Define user type
interface User {
  id: string;
  username?: string;
}

// Custom Hook for handling user data from Supabase
export const useUser = () => {
  const [user, setUser] = useState<User | null>(null); // Specify type for `user`
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;
        setUser(data.user); // Now `data.user` will be typed as `User`
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
