import Stripe from "stripe";
import nodemailer from "nodemailer";

export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.stripeSecretkey || process.env.STRIPE_SECRET_KEY || "sk_test_placeholder");

export async function POST(req) {
  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      return Response.json({ error: "Missing session_id" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items.data.price.product", "customer_details", "shipping_details"],
    });

    if (session.payment_status !== "paid") {
      return Response.json({ error: "Payment not completed" }, { status: 400 });
    }

    const customerEmail = session.customer_details?.email || "Unknown";
    const customerName = session.customer_details?.name || "Customer";
    const shippingAddress = session.shipping_details?.address || {};
    const shippingName = session.shipping_details?.name || customerName;
    const lineItems = session.line_items?.data || [];
    const totalAmount = (session.amount_total || 0) / 100;
    const shippingCost = (session.total_details?.amount_shipping || 0) / 100;
    const tax = (session.total_details?.amount_tax || 0) / 100;
    const subtotal = (session.amount_subtotal || 0) / 100;

    const addressStr = [
      shippingAddress.line1,
      shippingAddress.line2,
      shippingAddress.city,
      shippingAddress.state,
      shippingAddress.postal_code,
      shippingAddress.country,
    ]
      .filter(Boolean)
      .join(", ");

    let itemsHtml = "";
    lineItems.forEach((li) => {
      const name = li.price?.product?.name || li.description || "Product";
      const qty = li.quantity || 1;
      const price = ((li.amount_total || 0) / 100).toFixed(2);
      const imgUrl = li.price?.product?.images?.[0] || "";
      itemsHtml += `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #eee;">
            ${imgUrl ? `<img src="${imgUrl}" alt="${name}" width="60" height="60" style="object-fit:cover;border-radius:4px;" />` : ""}
          </td>
          <td style="padding:12px 16px;border-bottom:1px solid #eee;font-size:14px;">
            <strong>${name}</strong><br/>
            <span style="color:#666;">Qty: ${qty}</span>
          </td>
          <td style="padding:12px 0;border-bottom:1px solid #eee;text-align:right;font-size:14px;font-weight:600;">
            $${price}
          </td>
        </tr>`;
    });

    const emailHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#f9f9fa;font-family:Inter,Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;margin-top:24px;margin-bottom:24px;box-shadow:0 1px 4px rgba(0,0,0,0.08);">
    <div style="background:#000;padding:24px;text-align:center;">
      <h1 style="color:#fff;font-size:18px;letter-spacing:0.15em;margin:0;">NOVA STORE</h1>
    </div>
    <div style="padding:32px 24px;">
      <h2 style="font-size:22px;margin:0 0 4px 0;color:#1a1c1d;">New Order Received</h2>
      <p style="font-size:13px;color:#78767b;margin:0 0 24px 0;">Order ID: ${sessionId}</p>
      <table style="width:100%;margin-bottom:24px;">
        <tr>
          <td style="padding:8px 0;font-size:13px;color:#78767b;">Customer</td>
          <td style="padding:8px 0;font-size:14px;font-weight:500;text-align:right;">${customerName}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;font-size:13px;color:#78767b;">Email</td>
          <td style="padding:8px 0;font-size:14px;text-align:right;">${customerEmail}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;font-size:13px;color:#78767b;">Shipping To</td>
          <td style="padding:8px 0;font-size:14px;text-align:right;">${shippingName}<br/>${addressStr}</td>
        </tr>
      </table>
      <h3 style="font-size:15px;margin:0 0 12px 0;color:#1a1c1d;border-bottom:2px solid #000;padding-bottom:8px;">Purchased Items</h3>
      <table style="width:100%;">${itemsHtml}</table>
      <table style="width:100%;margin-top:16px;">
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#78767b;">Subtotal</td>
          <td style="padding:6px 0;font-size:14px;text-align:right;">$${subtotal.toFixed(2)}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#78767b;">Shipping</td>
          <td style="padding:6px 0;font-size:14px;text-align:right;">${shippingCost === 0 ? "Complimentary" : "$" + shippingCost.toFixed(2)}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#78767b;">Tax</td>
          <td style="padding:6px 0;font-size:14px;text-align:right;">$${tax.toFixed(2)}</td>
        </tr>
        <tr>
          <td style="padding:12px 0;font-size:16px;font-weight:700;border-top:2px solid #000;">Total Paid</td>
          <td style="padding:12px 0;font-size:16px;font-weight:700;text-align:right;border-top:2px solid #000;">$${totalAmount.toFixed(2)}</td>
        </tr>
      </table>
    </div>
    <div style="background:#f3f3f4;padding:16px 24px;text-align:center;">
      <p style="font-size:11px;color:#78767b;margin:0;">&copy; ${new Date().getFullYear()} NOVA STORE. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.SMTP_USER || process.env.ORDER_EMAIL_FROM || "",
        pass: process.env.SMTP_PASS || process.env.ORDER_EMAIL_PASS || "",
      },
    });

    try {
      await transporter.sendMail({
        from: `"NOVA STORE" <${process.env.SMTP_USER || process.env.ORDER_EMAIL_FROM || "noreply@novestore.com"}>`,
        to: "Getorder@novestore.com",
        subject: `New Order — ${customerName} — $${totalAmount.toFixed(2)}`,
        html: emailHtml,
      });
    } catch (emailErr) {
      console.log("Email send failed:", emailErr.message);
    }

    return Response.json({
      success: true,
      order: {
        id: sessionId,
        customerName,
        customerEmail,
        shippingName,
        shippingAddress,
        items: lineItems.map((li) => ({
          name: li.price?.product?.name || li.description || "Product",
          quantity: li.quantity || 1,
          price: ((li.amount_total || 0) / 100).toFixed(2),
          image: li.price?.product?.images?.[0] || "",
        })),
        subtotal: subtotal.toFixed(2),
        shipping: shippingCost.toFixed(2),
        tax: tax.toFixed(2),
        total: totalAmount.toFixed(2),
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      },
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

