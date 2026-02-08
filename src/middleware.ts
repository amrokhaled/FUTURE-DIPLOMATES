import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {

    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const url = request.nextUrl
    const hostname = request.headers.get('host') || ''

    // 1. Admin Subdomain Routing
    // Check if the hostname starts with "admin." (e.g. admin.futurediplomats.com or admin.localhost:3000)
    const isAdminSubdomain = hostname.startsWith('admin.')

    // If it's the admin subdomain, rewrite the path to /admin/...
    if (isAdminSubdomain && !url.pathname.startsWith('/admin')) {
        return NextResponse.rewrite(new URL(`/admin${url.pathname}`, request.url))
    }

    // 2. Auth Protection (Legacy /dashboard routes)
    const { data: { user } } = await supabase.auth.getUser()

    // Protect dashboard routes
    if (url.pathname.startsWith('/dashboard') ||
        url.pathname.startsWith('/applications') ||
        url.pathname.startsWith('/documents')) {

        if (!user) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    // 3. Redirect old portal routes
    if (url.pathname.startsWith('/portal/')) {
        const newPath = url.pathname.replace('/portal/', '/')
        return NextResponse.redirect(new URL(newPath, request.url))
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
