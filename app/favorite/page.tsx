import "../globals.css";

export default function ProfileFavorite() {
  return (
    <div className="flex min-h-screen bg-gray-100 p-8">
      {/* Sidebar - Profile */}
      <div className="w-1/4 bg-white shadow-xl rounded-2xl p-8 flex flex-col items-center">
        <h2 className="text-xl font-bold mb-6">Profile</h2>
        <div className="w-32 h-32 bg-gray-300 rounded-full mb-6"></div>
        <h3 className="text-lg font-semibold mb-4">Username</h3>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 mb-4">
          Verify your account
        </button>
        <input
          type="file"
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
        />
      </div>

      {/* Main Content - Favorite Section */}
      <div className="w-3/4 ml-8 p-8 bg-white shadow-xl rounded-2xl">
        <h1 className="text-3xl font-bold mb-6">Favorite</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {["Item 1", "Item 2", "Item 3", "Item 4", "Item 5", "Item 6"].map((item, index) => (
            <div
              key={index}
              className="p-6 bg-gray-100 rounded-lg shadow hover:shadow-xl transition-shadow duration-300"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
