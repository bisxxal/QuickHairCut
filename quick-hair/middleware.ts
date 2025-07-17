import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export default withAuth(
  function middleware(req: NextRequest) {
    // Allow access for authenticated users
     const pathname = req?.nextUrl?.pathname
    const token = req?.nextauth?.token
    const role = token?.role 

    // Protect /admin and /barber routes
    if (pathname.startsWith("/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url))
    }

    if (pathname.startsWith("/barber") && role !== "BARBER") {
      return NextResponse.redirect(new URL("/", req.url))
    }

    // Prevent USER from accessing barber/admin routes
    if ((pathname.startsWith("/admin") || pathname.startsWith("/barber")) && role === "USER") {
      return NextResponse.redirect(new URL("/", req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Only allow if user is logged in
    },
    pages: {
      signIn: "/sign-in", 
    },
  }
)

export const config = {
  matcher: [
    "/(user)/:path*",
    "/(barber)/:path*",
    // "/(admin)/:path*",
    "/profile/editprofile"
  ],
}
