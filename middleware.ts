import { type NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  // Create supabase client to get user session
  const supabase = await createClient()

  // Check the user session using supabase
  const { data: { user } } = await supabase.auth.getUser()

  // If the user is logged in, allow them to proceed
  if (user) {
    return NextResponse.next()
  }

  // Get the requested path
  const url = request.nextUrl.clone()

  // Do not redirect if the user is trying to access the main page, login/signup, or weather page
  if (
    url.pathname === '/' || 
    url.pathname === '/login' || 
    url.pathname === '/signup' ||
    url.pathname === '/hourly' ||
    url.pathname === '/airquality'
  ) {
    return NextResponse.next()
  }

  // If not logged in and trying to access protected page, redirect to login
  url.pathname = '/login'
  return NextResponse.redirect(url)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|^/auth/favorite/add).*)',
  ],
};
