import Stripe from "stripe";

const stripe = new Stripe(process.env.stripeSecretkey);

export async function POST(req) {
  try {
    const { items } = await req.json();

    if (!items || items.length === 0) {
      return Response.json({ error: "No items" }, { status: 400 });
    }

    const line_items = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.title || "Nova Product",
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.max(Math.round((item.price || 0) * 100), 1),
      },
      quantity: item.quantity || 1,
    }));

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "DE", "FR", "AU", "JP", "AE", "SA"],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 0, currency: "usd" },
            display_name: "Standard Carbon-Neutral Delivery",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 5 },
              maximum: { unit: "business_day", value: 10 },
            },
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 2500, currency: "usd" },
            display_name: "Express Air Transfer",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 1 },
              maximum: { unit: "business_day", value: 3 },
            },
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 5000, currency: "usd" },
            display_name: "Same Day Advantage",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 1 },
              maximum: { unit: "business_day", value: 1 },
            },
          },
        },
      ],
      success_url: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/Collections`,
    });

    return Response.json({ url: session.url });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

