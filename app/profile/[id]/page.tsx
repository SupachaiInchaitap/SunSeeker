// "use client";

// import { useState, useEffect } from "react";
// import { createClient } from "@/utils/supabase/client";
// import { useUser } from "@/hooks/useUser";

// export default function ProfilePage() {
//   const supabase = createClient();
//   const { user, isLoading, error } = useUser(); // Destructure useUser properly

//   const [userData, setUserData] = useState<{ username: string; avatar_url?: string } | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!user || isLoading) return;

//     const fetchUserData = async () => {
//       setLoading(true);
//       try {
//         console.log("Fetching user data for ID:", user.id); // ✅ Now `user.id` is correctly typed
//         const { data, error } = await supabase
//           .from("users")
//           .select("username, avatar_url")
//           .eq("id", user.id) // ✅ Now using `user.id`
//           .single();

//         if (error) throw error;
//         setUserData(data);
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserData();
//   }, [user, isLoading]);

//   if (loading) return <div>Loading profile...</div>;
//   if (error || !userData) return <div>Error fetching profile.</div>;

//   return (
//     <div className="w-full mt-14">
//       <div className="flex flex-col items-center">
//         <p className="font-medium text-xl text-secondary">
//           {userData?.username || "No Username"}
//         </p>
//       </div>
//     </div>
//   );
// }
