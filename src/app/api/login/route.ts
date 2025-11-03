// src/app/api/login/route.ts
import { NextResponse } from "next/server";
import { query } from "@/lib/database"; // nếu chưa set alias "@", dùng "../../lib/database"

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }

    const rows = await query<{ id: number; password: string; role: string }>(
      "SELECT id, password, role FROM users WHERE email = ? LIMIT 1",
      [email.trim()]
    );

    if (rows.length === 0) return NextResponse.json({ error: "User not found" }, { status: 401 });
    const user = rows[0];
    if (password !== user.password) return NextResponse.json({ error: "Incorrect password" }, { status: 401 });

    const res = NextResponse.json({ ok: true, role: user.role });

    // set cookie role để middleware đọc (edge-friendly)
    res.cookies.set("role", user.role, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
