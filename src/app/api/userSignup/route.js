import { supabase } from "../../../lib/supabase";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const body = await req.json();

  const { password, cpassword, name, email, check } = body;

  if (password === cpassword) {
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
  } else {
    return Response.json({
      error: "Password And Confirm Password Not the Same"
    }, { status: 400 });
  }

  if (!email) {
    return Response.json({
      error: "Email is required"
    }, { status: 400 });
  } else {
    const EmailAteRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!EmailAteRegex.test(email)) {
      return Response.json({
        error: "Invalid Email Address"
      }, { status: 400 });
    }
  }

  if (!name || !name.trim()) {
    return Response.json({
      error: "Name is required"
    }, { status: 400 });
  }

  if (check == false) {
    return Response.json({
      error: "checkbox is required"
    }, { status: 400 });
  }

  const { data, error } = await supabase.from("Users").insert({
    username: name,
    emailaddress: email,
    password: password,
    Check: check
  });

  if (error) {
    return Response.json({
      error: error.message
    }, { status: 400 });
  }

  const cookieStore = await cookies();
  cookieStore.set("user_session", JSON.stringify({
    name,
    email
  }), {
    path: "/",
    httpOnly: false,
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax"
  });

  return Response.json({
    Message: "Success Adding New User",
    Data: data,
    Stat: "good"
  });
}
