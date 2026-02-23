import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Public routes that don't need auth
  const publicRoutes = ['/login', '/register', '/share', '/invite', '/poll']
  const isPublicRoute = publicRoutes.some(route => request.nextUrl.pathname.startsWith(route))
  const isRootRoute = request.nextUrl.pathname === '/'

  if (!user && !isPublicRoute && !isRootRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Redirect logged-in users away from auth pages
  if (user && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register')) {
    const url = request.nextUrl.clone()
    url.pathname = '/calendar'
    return NextResponse.redirect(url)
  }

  // Redirect root to calendar for logged-in users, landing for guests
  if (isRootRoute && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/calendar'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
