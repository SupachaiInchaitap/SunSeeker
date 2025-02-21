import Link from "next/link";
import { getUser } from "@/utils/supabase/getUser";
import { logout } from "../(auth)/function/action";

export default async function AuthButton() {
  // Fetch the user object using a server-side function (getUser)
  const user = await getUser();

  console.log('User in AuthButton:', user);

  if (!user) {
    return (
      <div className="flex gap-3 z-20">
        <Link href="/login" className="py-2 px-5 flex rounded-md border hover:bg-white hover:text-primary duration-300">
          Login
        </Link>
        <Link href="/signup" className="py-2 px-5 flex rounded-md border hover:bg-white hover:text-primary duration-300">
          Sign Up
        </Link>
      </div>
    );
  }

  return (
    <div className="relative z-30">
      {/* This div will act as the clickable button container */}
      <details className="dropdown dropdown-bottom dropdown-end group">
        <summary className="w-full py-4 px-6 flex justify-between items-center bg-white text-black border-2 border-red-500 rounded-lg cursor-pointer">
          {/* Container acting as the button with red border */}
          <span className="flex gap-3 items-center">
            <i className="fa-solid fa-user text-xl"></i>
            <h1 className="font-semibold">{user.email}</h1>
          </span>
          <i className="fa-solid fa-chevron-down text-xl"></i> {/* Arrow for dropdown */}
        </summary>

        {/* Dropdown content */}
        <ul className="menu dropdown-content shadow bg-white w-72 mt-3 text-secondary rounded-lg rounded-tr-none p-0 absolute top-full left-0n z-40">
          <li className="hover:bg-gray-100 duration-200 py-2 rounded-t-lg">
            <Link href="/profile" className="text -black flex gap-5">
              <h1> Profile </h1>
            </Link>
          </li>
          <li>
            <form action={logout} method="POST" className="flex gap-5 hover:bg-gray-100 duration-200 py-4 rounded-b-lg">
              <i className="fa-solid fa-right-from-bracket text-xl"></i>
              <button type="submit" className="text-black w-full text-left ">
                Logout
              </button>
            </form>
          </li>
        </ul>
      </details>
    </div>
  );
}
