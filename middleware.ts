import { withAuth } from "next-auth/middleware"
import { NextResponse, NextRequest } from "next/server"

export default withAuth(
  function middleware(request: NextRequest) {
    const token = request.nextauth.token
    const pathname = request.nextUrl.pathname

    // Check admin routes
    if (pathname.startsWith("/admin")) {
      if (token?.role !== "admin") {
        return NextResponse.redirect(new URL("/login", request.url))
      }
    }

    // Check employer routes
    if (pathname.startsWith("/employer")) {
      if (token?.role !== "employer") {
        return NextResponse.redirect(new URL("/login", request.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Token exists means user is authenticated
        return !!token
      }
    },
    pages: {
      signIn: "/login"
    }
  }
)

export const config = {
  matcher: ["/admin/:path*", "/employer/:path*"]
}
