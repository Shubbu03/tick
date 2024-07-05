import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/login", "/signup", "/"],
};

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  if (
    token &&
    (url.pathname.startsWith("/login") ||
      url.pathname.startsWith("/signup") ||
      url.pathname === "/")
  ) {
    // return NextResponse.redirect(new URL("/dashboard", request.url));
    return NextResponse.json(
      {
        success: true,
        message: "User got in successfully!!",
      },
      { status: 200 }
    );
  }

  if (!token && url.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}
