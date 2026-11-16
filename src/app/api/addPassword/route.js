import { supabase } from "../../../lib/supabase";
import { cookies } from "next/headers";

export async function POST(req) {
  const body = await req.json();
  const { name, email, password, cpassword } = body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "Invalid Email Address" }, { status: 400 });
  }

  if (!name || name.trim().length < 3) {
    return Response.json({ error: "Name must have at least 3 characters" }, { status: 400 });
  }

  if (!password || password.length < 8) {
    return Response.json({ error: "Password must have at least 8 characters" }, { status: 400 });
  }

  const symbolRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
  const upperRegex = /[A-Z]/;
  const lowerRegex = /[a-z]/;
  const numberRegex = /\d/;

  if (
    !symbolRegex.test(password) ||
    !upperRegex.test(password) ||
    !lowerRegex.test(password) ||
    !numberRegex.test(password)
  ) {
    return Response.json({ error: "Password does not meet requirements" }, { status: 400 });
  }

  if (password !== cpassword) {
    return Response.json({ error: "Passwords do not match" }, { status: 400 });
  }

  const { data: existingUsers, error: selectError } = await supabase
    .from("Users")
    .select("*")
    .eq("emailaddress", email);

  if (selectError) {
    return Response.json({ error: "Database error" }, { status: 500 });
  }

  if (existingUsers && existingUsers.length > 0) {
    const { error: updateError } = await supabase
      .from("Users")
      .update({
        password: password,
        username: name
      })
      .eq("emailaddress", email);

    if (updateError) {
      return Response.json({ error: updateError.message }, { status: 400 });
    }
  } else {
    const { error: insertError } = await supabase
      .from("Users")
      .insert({
        username: name,
        emailaddress: email,
        password: password,
        Check: true
      });

    if (insertError) {
      return Response.json({ error: insertError.message }, { status: 400 });
    }
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
    stat: "good",
    Message: "Password saved successfully"
  });
}

