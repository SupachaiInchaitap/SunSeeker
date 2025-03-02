// "use client";  
// import { useState } from "react";
// import "../globals.css";

// export default function ProfileFavorite() {
//   const [profileImage, setProfileImage] = useState<string | null>(null);

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       setProfileImage(URL.createObjectURL(file));
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-orange-50 p-8">
//       {/* Sidebar - Profile */}
//       <div className="w-1/4 bg-orange-100 shadow-xl rounded-2xl p-8 flex flex-col items-center">
//         <h2 className="text-2xl font-bold mb-6 text-orange-700">Profile</h2>
//         <div className="w-32 h-32 bg-gray-300 rounded-full mb-6 overflow-hidden border-4 border-orange-300">
//           {profileImage ? (
//             <img
//               src={profileImage}
//               alt="Profile"
//               className="w-full h-full object-cover"
//             />
//           ) : (
//             <div className="flex items-center justify-center h-full text-gray-500">
//               None
//             </div>
//           )}
//         </div>
//         <h3 className="text-lg font-semibold mb-4 text-orange-700">Username</h3>
//         <button className="px-4 py-2 bg-orange-500 text-white rounded-lg shadow-md hover:bg-orange-600 mb-4">
//           Verify your account
//         </button>
//         <input
//           type="file"
//           accept="image/*"
//           onChange={handleFileChange}
//           className="block w-full text-sm text-gray-900 border border-orange-300 rounded-lg cursor-pointer bg-orange-50 focus:outline-none"
//         />
//       </div>

//       {/* Main Content - Favorite Section */}
//       <div className="w-3/4 ml-8 p-8 bg-white shadow-xl rounded-2xl">
//         <h1 className="text-3xl font-bold mb-6 text-orange-700">Favorite</h1>
//         <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
//           {["Sunny Day", "Rainy Day", "Cloudy Sky", "Storm Warning", "Clear Sky", "Windy Forecast"].map(
//             (item, index) => (
//               <div
//                 key={index}
//                 className="p-6 bg-orange-100 text-orange-800 font-medium rounded-lg shadow hover:shadow-xl transition-shadow duration-300 hover:bg-orange-200"
//               >
//                 {item}
//               </div>
//             )
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
