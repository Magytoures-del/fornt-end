import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname, search } = request.nextUrl;
  const hostname = request.headers.get("host");

  // Define your canonical domain (preferred version)
  const canonicalDomain = "flymoon.sa"; // Updated to your actual domain

  // Check if the request is for www subdomain
  if (hostname?.startsWith("www.")) {
    // Redirect www to non-www
    const newUrl = new URL(pathname + search, `https://${canonicalDomain}`);
    return NextResponse.redirect(newUrl, 301); // 301 for permanent redirect
  }

  // If you prefer www over non-www, uncomment this section and comment the above
  // if (hostname && !hostname.startsWith('www.')) {
  //   const newUrl = new URL(pathname + search, `https://www.${canonicalDomain}`)
  //   return NextResponse.redirect(newUrl, 301)
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
