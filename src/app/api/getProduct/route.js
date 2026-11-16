import { supabase } from "../../../lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    let { data, error } = await supabase.from("Products").select("*");
    if (error || !data || data.length === 0) {
      const res = await supabase.from("Productsn").select("*");
      if (res.data && res.data.length > 0) {
        data = res.data;
      }
    }

    return Response.json(data || []);
  } catch (err) {
    return Response.json([], { status: 200 });
  }
}
