import { supabase } from "../../../../lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("Users")
      .select("id, username, emailaddress, Check, isAdmin")
      .order("id", { ascending: false });

    if (error) {
      return Response.json({ success: false, error: error.message }, { status: 400 });
    }

    return Response.json({ success: true, users: data || [] });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const { email, id, isAdmin } = body;

    if (!email && !id) {
      return Response.json(
        { success: false, error: "User email or ID is required" },
        { status: 400 }
      );
    }

    let query = supabase.from("Users").update({ isAdmin: Boolean(isAdmin) });

    if (id) {
      query = query.eq("id", id);
    } else {
      query = query.eq("emailaddress", email);
    }

    const { data, error } = await query.select("id, username, emailaddress, Check, isAdmin");

    if (error) {
      return Response.json({ success: false, error: error.message }, { status: 400 });
    }

    return Response.json({
      success: true,
      message: "Admin status updated successfully",
      user: data ? data[0] : null
    });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}
