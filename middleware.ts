import { type NextRequest } from 'next/server'
import { createClient } from '@/app/utils/supabase/server'
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

  // Do not redirect if the user is trying to access the main page or login/signup
  if (url.pathname === '/' || url.pathname === '/login' || url.pathname === '/signup' || url.pathname === '/weather' ) {
    return NextResponse.next()
  }

  // If not logged in and trying to access protected page, redirect to login
  url.pathname = '/login'
  return NextResponse.redirect(url)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
