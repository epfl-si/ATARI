import { type NextRequest, NextResponse } from "next/server";

export default async function proxy(req: NextRequest) {
  const { auth } = await import("./services/auth");

  const session = await auth();
  if (!session) {
    return NextResponse.rewrite(new URL("/welcome", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/auth|error|_next/static|_next/image|favicon.ico|.*\\.[a-zA-Z]+$).*)"],
};
