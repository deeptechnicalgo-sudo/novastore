import { supabase } from "../../../../lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    let { data, error } = await supabase
      .from("Products")
      .select("*")
      .order("id", { ascending: false });

    if (error || !data || data.length === 0) {
      const fallback = await supabase
        .from("Productsn")
        .select("*")
        .order("id", { ascending: false });
      if (fallback.data && fallback.data.length > 0) {
        data = fallback.data;
      }
    }

    return Response.json({ success: true, products: data || [] });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { des, price, imageurl, type, colors, rating, isnew, isEdition } = body;

    if (!des || !type) {
      return Response.json(
        { success: false, error: "Title/Description and Category are required" },
        { status: 400 }
      );
    }

    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice) || numericPrice < 0) {
      return Response.json(
        { success: false, error: "Valid price is required" },
        { status: 400 }
      );
    }

    const productPayload = {
      des: String(des).trim(),
      price: numericPrice,
      imageurl: imageurl ? String(imageurl).trim() : "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
      type: String(type).trim(),
      colors: colors ? String(colors).trim() : "Standard",
      rating: rating ? parseFloat(rating) : 4.9,
      isnew: Boolean(isnew),
      isEdition: Boolean(isEdition)
    };

    const { data, error } = await supabase
      .from("Products")
      .insert(productPayload)
      .select();

    if (error) {
      return Response.json({ success: false, error: error.message }, { status: 400 });
    }

    return Response.json({ success: true, product: data ? data[0] : productPayload });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, des, price, imageurl, type, colors, rating, isnew, isEdition } = body;

    if (!id) {
      return Response.json(
        { success: false, error: "Product ID is required for update" },
        { status: 400 }
      );
    }

    const updatePayload = {};
    if (des !== undefined) updatePayload.des = String(des).trim();
    if (price !== undefined) updatePayload.price = parseFloat(price);
    if (imageurl !== undefined) updatePayload.imageurl = String(imageurl).trim();
    if (type !== undefined) updatePayload.type = String(type).trim();
    if (colors !== undefined) updatePayload.colors = String(colors).trim();
    if (rating !== undefined) updatePayload.rating = parseFloat(rating);
    if (isnew !== undefined) updatePayload.isnew = Boolean(isnew);
    if (isEdition !== undefined) updatePayload.isEdition = Boolean(isEdition);

    const { data, error } = await supabase
      .from("Products")
      .update(updatePayload)
      .eq("id", id)
      .select();

    if (error) {
      return Response.json({ success: false, error: error.message }, { status: 400 });
    }

    return Response.json({ success: true, product: data ? data[0] : updatePayload });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    let id = searchParams.get("id");

    if (!id) {
      const body = await req.json().catch(() => ({}));
      id = body.id;
    }

    if (!id) {
      return Response.json(
        { success: false, error: "Product ID is required" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("Products")
      .delete()
      .eq("id", id);

    if (error) {
      return Response.json({ success: false, error: error.message }, { status: 400 });
    }

    return Response.json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}
