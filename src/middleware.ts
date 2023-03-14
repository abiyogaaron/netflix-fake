import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./utils/indext";

export const middleware = async (req: NextRequest) => {
  const token = req.cookies.get('token');
  const userId = await verifyToken(token?.value || '');
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.includes("/api/login") ||
    userId ||
    pathname.includes("/static")
  ) {
    return NextResponse.next();
  }

  if ((!token || !userId) && pathname !== "/login") {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.rewrite(url);
  }
}
