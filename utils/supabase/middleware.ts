// import { createServerClient } from '@supabase/ssr';
// import { NextResponse, type NextRequest } from 'next/server';

// export async function updateSession(request: NextRequest) {
//   const supabaseResponse = NextResponse.next({ request });

//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         get(name) {
//           return request.cookies.get(name)?.value;
//         },
//         set(name, value, options) {
//           supabaseResponse.cookies.set(name, value, options);
//         },
//         remove(name) {
//           supabaseResponse.cookies.delete(name);
//         },
//       },
//     }
//   );

//   // Get the user session
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   console.log("Middleware - User session:", user);

//   // Define the routes that can be accessed without authentication
//   const publicRoutes = ['/', '/weather', '/contact'];

//   // If user is not authenticated and tries to access a protected route, redirect to login
//   if (!user && !publicRoutes.includes(request.nextUrl.pathname)) {
//     const url = request.nextUrl.clone();
//     url.pathname = '/login';
//     return NextResponse.redirect(url);
//   }

//   return supabaseResponse;
// }
