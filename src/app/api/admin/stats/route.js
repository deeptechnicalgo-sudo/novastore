import { supabase } from "../../../../lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [productsRes, usersRes] = await Promise.all([
      supabase.from("Products").select("*"),
      supabase.from("Users").select("id, username, emailaddress, isAdmin")
    ]);

    let products = productsRes.data || [];
    if (products.length === 0) {
      const fallbackRes = await supabase.from("Productsn").select("*");
      if (fallbackRes.data && fallbackRes.data.length > 0) {
        products = fallbackRes.data;
      }
    }

    const users = usersRes.data || [];

    const totalProducts = products.length;
    const totalUsers = users.length;
    const totalAdmins = users.filter((u) => Boolean(u.isAdmin)).length;

    let totalCatalogValue = 0;
    let newArrivalsCount = 0;
    let limitedEditionCount = 0;
    const categoryCounts = {};
    const priceBrackets = {
      under200: 0,
      between200and500: 0,
      between500and1000: 0,
      over1000: 0
    };

    products.forEach((p) => {
      const priceNum = typeof p.price === "number" ? p.price : parseFloat(p.price) || 0;
      totalCatalogValue += priceNum;

      if (p.isnew) newArrivalsCount++;
      if (p.isEdition) limitedEditionCount++;

      const cat = p.type || "Uncategorized";
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;

      if (priceNum < 200) {
        priceBrackets.under200++;
      } else if (priceNum <= 500) {
        priceBrackets.between200and500++;
      } else if (priceNum <= 1000) {
        priceBrackets.between500and1000++;
      } else {
        priceBrackets.over1000++;
      }
    });

    const averagePrice = totalProducts > 0 ? (totalCatalogValue / totalProducts).toFixed(2) : 0;

    const categoryBreakdown = Object.keys(categoryCounts).map((key) => ({
      name: key,
      count: categoryCounts[key],
      percentage: totalProducts > 0 ? Math.round((categoryCounts[key] / totalProducts) * 100) : 0
    }));

    const sortedByLatest = [...products].reverse().slice(0, 5);

    return Response.json({
      success: true,
      stats: {
        totalProducts,
        totalUsers,
        totalAdmins,
        totalCatalogValue: Math.round(totalCatalogValue),
        averagePrice: Number(averagePrice),
        newArrivalsCount,
        limitedEditionCount,
        categoryBreakdown,
        priceBrackets,
        recentProducts: sortedByLatest
      }
    });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}
