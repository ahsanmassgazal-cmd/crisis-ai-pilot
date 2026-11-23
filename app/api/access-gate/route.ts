import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();
    const expectedCode = process.env.DEMO_ACCESS_CODE || "SIGMAMAX2026";

    if (code && code.trim().toLowerCase() === expectedCode.trim().toLowerCase()) {
      const res = NextResponse.json({ success: true });
      res.cookies.set("crisis_pilot_access", "granted", {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
      return res;
    }

    return NextResponse.json({ success: false, error: "Invalid access code" }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Bad request" }, { status: 400 });
  }
}
