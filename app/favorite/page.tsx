import "../globals.css";

export default function ProfileFavorite() {
  return (
    <div className="flex min-h-screen bg-gray-200 p-6">
      {/* Sidebar - Profile */}
      <div className="w-1/4 bg-white shadow-lg rounded-lg p-6">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-gray-300 rounded-full mb-4"></div>
          <h2 className="text-lg font-semibold mb-2">Username</h2>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600">
            Verify your account
          </button>
        </div>
      </div>

      {/* Main Content - Favorite Section */}
      <div className="w-3/4 ml-6 p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Favorite</h1>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-100 rounded-lg shadow-md">Item 1</div>
          <div className="p-4 bg-gray-100 rounded-lg shadow-md">Item 2</div>
          <div className="p-4 bg-gray-100 rounded-lg shadow-md">Item 3</div>
          <div className="p-4 bg-gray-100 rounded-lg shadow-md">Item 4</div>
        </div>
      </div>
    </div>
  );
}
