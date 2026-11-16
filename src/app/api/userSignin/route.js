import { supabase } from "../../../lib/supabase";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const body = await req.json();

  const { email, password } = body;

  if (email) {
    const EmailAteRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!EmailAteRegex.test(email)) {
      return Response.json({
        error: "Invalid Email Address"
      }, { status: 400 });
    }
  }

  if (password) {
    const symbolRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    const UpperRegex = /[A-Z]/;
    const lowerregex = /[a-z]/;
    const numbersregex = /\d/;

    if (
      !symbolRegex.test(password) ||
      !UpperRegex.test(password) ||
      !lowerregex.test(password) ||
      !numbersregex.test(password) ||
      password.length < 8
    ) {
      if (!symbolRegex.test(password)) {
        return Response.json({
          error: "one Symbol at least"
        }, { status: 400 });
      } else if (!UpperRegex.test(password)) {
        return Response.json({
          error: "one UPPERCASE Letter at least"
        }, { status: 400 });
      } else if (!lowerregex.test(password)) {
        return Response.json({
          error: "one lowercase Letter at least"
        }, { status: 400 });
      } else if (password.length < 8) {
        return Response.json({
          error: "Password Must Have 8 Characters At Least"
        }, { status: 400 });
      } else if (!numbersregex.test(password)) {
        return Response.json({
          error: "Password Must Have 1 Number At Least"
        }, { status: 400 });
      }
    }

  } else {
    return Response.json({
      error: "We Are not confirming Empty passwords"
    }, { status: 400 });
  }

  const { data, error } = await supabase.from("Users").select("*").eq("emailaddress", email);

  if (error) {
    return Response.json({ error: "Server error", stat: "bad" }, { status: 500 });
  }

  if (!data || data.length === 0) {
    return Response.json({ error: "We did not found you", stat: "bad" }, { status: 400 });
  }

  if (data[0].password !== password) {
    return Response.json({ error: "Wrong Password Or Email", stat: "bad" }, { status: 400 });
  }

  const cookieStore = await cookies();
  cookieStore.set("user_session", JSON.stringify({
    id: data[0].id,
    name: data[0].username,
    email: data[0].emailaddress
  }), {
    path: "/",
    httpOnly: false,
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax"
  });

  return Response.json({ Massage: `We Found You ${data[0].username}`, stat: "good", data: data });
}
