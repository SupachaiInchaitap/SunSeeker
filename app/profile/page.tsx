import { getUser } from "@/utils/supabase/getUser";

export default async function ProfilePage() {
  // Fetch user data server-side
  const user = await getUser();

  // If no user is found (not logged in), you can redirect or show a message
  if (!user) {
    return (
      <div className="w-full h-screen flex flex-col justify-center items-center text-center">
        <h1 className="text-2xl font-semibold text-red-500">You are not logged in.</h1>
        <p className="text-gray-600 mt-2">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex">
      {/* Left Profile Section */}
      <div className="w-1/3 bg-white p-6 rounded-tr-2xl shadow-lg flex flex-col items-center">
        <img
          src="https://i.pravatar.cc/150?img=3" // Placeholder avatar
          alt="User Avatar"
          className="w-24 h-24 rounded-full mb-4 border-4 border-primary"
        />
        <h1 className="text-2xl font-bold text-primary mb-2">{user.email}</h1>
        <p className="text-gray-600">Welcome to your profile page!</p>

        <div className="mt-4">
          <button className="py-2 px-6 bg-secondary text-white rounded-lg hover:bg-secondary-dark transition duration-300">
            Edit Profile
          </button>
        </div>
      </div>

      {/* Right Favorites Section */}
      <div className="w-2/3 bg-gray-100 p-6 overflow-y-auto">
        <h2 className="text-2xl font-semibold text-secondary mb-4">Your Favorites</h2>
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition duration-300">
            <h3 className="text-xl font-bold">Bangkok</h3>
            <p className="text-gray-600">Sunny - 32°C</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition duration-300">
            <h3 className="text-xl font-bold">Tokyo</h3>
            <p className="text-gray-600">Cloudy - 22°C</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition duration-300">
            <h3 className="text-xl font-bold">New York</h3>
            <p className="text-gray-600">Rainy - 15°C</p>
          </div>
          {/* Add more favorites dynamically later */}
        </div>
      </div>
    </div>
  );
}
