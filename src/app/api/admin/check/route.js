import { supabase } from "../../../../lib/supabase";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("user_session");

    let email = null;
    if (sessionCookie && sessionCookie.value) {
      try {
        const parsed = JSON.parse(sessionCookie.value);
        email = parsed.email || parsed.emailaddress;
      } catch (e) {}
    }

    const { searchParams } = new URL(req.url);
    const queryEmail = searchParams.get("email");
    if (!email && queryEmail) {
      email = queryEmail;
    }

    if (!email) {
      return Response.json({ isAdmin: false, error: "No active session" }, { status: 200 });
    }

    const { data, error } = await supabase
      .from("Users")
      .select("id, username, emailaddress, isAdmin")
      .eq("emailaddress", email)
      .maybeSingle();

    if (error || !data) {
      return Response.json({ isAdmin: false, error: "User not found" }, { status: 200 });
    }

    const isAdmin = Boolean(data.isAdmin);

    return Response.json({
      isAdmin,
      user: {
        id: data.id,
        username: data.username,
        emailaddress: data.emailaddress,
        isAdmin
      }
    });
  } catch (err) {
    return Response.json({ isAdmin: false, error: "Server error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = body.email;

    if (!email) {
      return Response.json({ isAdmin: false, error: "Email required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("Users")
      .select("id, username, emailaddress, isAdmin")
      .eq("emailaddress", email)
      .maybeSingle();

    if (error || !data) {
      return Response.json({ isAdmin: false, error: "User not found" }, { status: 200 });
    }

    return Response.json({
      isAdmin: Boolean(data.isAdmin),
      user: {
        id: data.id,
        username: data.username,
        emailaddress: data.emailaddress,
        isAdmin: Boolean(data.isAdmin)
      }
    });
  } catch (err) {
    return Response.json({ isAdmin: false, error: "Server error" }, { status: 500 });
  }
}
