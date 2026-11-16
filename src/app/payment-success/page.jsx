"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import CartDrawer from "../../components/CartDrawer";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sessionId) {
      setError("No session found");
      setLoading(false);
      return;
    }

    fetch("/api/sendOrderEmail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setOrder(data.order);
          try {
            localStorage.removeItem("nova_cart");
            window.dispatchEvent(new Event("cart-change"));
          } catch (e) {}
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [sessionId]);

  const orderNum = sessionId ? `#ROVA-${sessionId.slice(-5).toUpperCase()}` : "#ROVA-03241";

  const today = new Date();
  const orderDate = order?.date || today.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const estDeliveryStart = new Date(today);
  estDeliveryStart.setDate(today.getDate() + 5);
  const estDeliveryEnd = new Date(today);
  estDeliveryEnd.setDate(today.getDate() + 10);
  const deliveryRange = `${estDeliveryStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${estDeliveryEnd.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#f9f9fa", fontFamily: "Inter, sans-serif" }}>
      <Header />

      {loading ? (
        <div style={{ textAlign: "center", padding: "6rem 2rem", flex: 1 }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              border: "3px solid #e2e2e3",
              borderTopColor: "#000",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 1.5rem",
            }}
          />
          <p style={{ fontSize: "14px", color: "#5f5e61" }}>Confirming your payment and preparing order...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : error ? (
        <div style={{ textAlign: "center", padding: "6rem 2rem", flex: 1 }}>
          <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#ba1a1a" }}>
            error
          </span>
          <h2 style={{ fontSize: "22px", fontWeight: 600, marginTop: "1rem", color: "#1a1c1d" }}>
            Order Lookup Notice
          </h2>
          <p style={{ fontSize: "14px", color: "#5f5e61", marginTop: "0.5rem" }}>{error}</p>
          <a
            href="/Collections"
            style={{
              display: "inline-block",
              marginTop: "1.5rem",
              padding: "12px 32px",
              backgroundColor: "#000",
              color: "#fff",
              borderRadius: "4px",
              fontSize: "13px",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Return to Collections
          </a>
        </div>
      ) : (
        <main style={{ maxWidth: "1080px", margin: "0 auto", padding: "3rem 1.5rem 4rem", width: "100%", flex: 1 }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                backgroundColor: "#000000",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.25rem",
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "28px", color: "#ffffff", fontVariationSettings: "'FILL' 1" }}>
                check
              </span>
            </div>
            <p style={{ fontSize: "11px", color: "#78767b", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 0.5rem", fontWeight: 600 }}>
              ORDER CONFIRMED
            </p>
            <h1 style={{ fontSize: "32px", fontWeight: 600, color: "#1a1c1d", margin: "0 0 0.75rem", letterSpacing: "-0.02em" }}>
              Thank you for your order, {order?.customerName?.split(" ")[0] || "Julian"}.
            </h1>
            <p style={{ fontSize: "14px", color: "#5f5e61", maxWidth: "520px", margin: "0 auto", lineHeight: 1.6 }}>
              Your order <strong style={{ color: "#1a1c1d" }}>{orderNum}</strong> has been confirmed and is being meticulously prepared at our Zurich atelier.
            </p>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", marginTop: "1.5rem" }}>
              <button
                type="button"
                onClick={() => window.print()}
                style={{
                  padding: "10px 22px",
                  backgroundColor: "#ffffff",
                  color: "#1a1c1d",
                  border: "1px solid #e2e2e3",
                  borderRadius: "4px",
                  fontSize: "13px",
                  fontWeight: 500,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>print</span>
                Print Receipt
              </button>
              <button
                type="button"
                style={{
                  padding: "10px 22px",
                  backgroundColor: "#ffffff",
                  color: "#1a1c1d",
                  border: "1px solid #e2e2e3",
                  borderRadius: "4px",
                  fontSize: "13px",
                  fontWeight: 500,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>local_shipping</span>
                Track Shipment
              </button>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem", marginBottom: "2.5rem" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
                <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#1a1c1d", margin: 0 }}>Order Parameters</h2>
                <span style={{ fontSize: "11px", color: "#78767b", letterSpacing: "0.06em", textTransform: "uppercase" }}>EXP · AUG · ARCHV</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "2rem" }}>
                <div>
                  <p style={{ fontSize: "11px", color: "#78767b", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 4px" }}>
                    ORDER DATE
                  </p>
                  <p style={{ fontSize: "14px", fontWeight: 500, color: "#1a1c1d", margin: 0 }}>{orderDate}</p>
                </div>
                <div>
                  <p style={{ fontSize: "11px", color: "#78767b", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 4px" }}>
                    PAYMENT METHOD
                  </p>
                  <p style={{ fontSize: "14px", fontWeight: 500, color: "#1a1c1d", margin: 0 }}>
                    Stripe Financial
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: "11px", color: "#78767b", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 4px" }}>
                    ESTIMATED DELIVERY
                  </p>
                  <p style={{ fontSize: "14px", fontWeight: 500, color: "#1a1c1d", margin: 0 }}>{deliveryRange}</p>
                </div>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <p style={{ fontSize: "11px", color: "#78767b", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 8px" }}>
                  DESTINATION ADDRESS
                </p>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#5f5e61", marginTop: "2px" }}>
                    location_on
                  </span>
                  <div>
                    <p style={{ fontSize: "14px", fontWeight: 600, color: "#1a1c1d", margin: "0 0 2px" }}>
                      {order?.shippingName || order?.customerName || "Julian Vance"}
                    </p>
                    <p style={{ fontSize: "13px", color: "#5f5e61", margin: 0, lineHeight: 1.5 }}>
                      {order?.shippingAddress?.line1 ? (
                        <>
                          {order.shippingAddress.line1}<br />
                          {order.shippingAddress.line2 && <>{order.shippingAddress.line2}<br /></>}
                          {[order.shippingAddress.city, order.shippingAddress.state, order.shippingAddress.postal_code].filter(Boolean).join(", ")}
                          {order.shippingAddress.country && <><br />{order.shippingAddress.country}</>}
                        </>
                      ) : (
                        <>
                          Limmatquai 42, Studio 6B<br />
                          Zurich, ZH 8001, Switzerland
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#1a1c1d", margin: "0 0 1rem", borderBottom: "1px solid #e2e2e3", paddingBottom: "8px", display: "flex", justifyContent: "space-between" }}>
                <span>Purchased Items ({order?.items?.length || 2})</span>
                <span style={{ fontSize: "11px", color: "#16a34a", textTransform: "uppercase", fontWeight: 600 }}>ALL ITEMS IN STOCK</span>
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {order?.items && order.items.length > 0 ? (
                  order.items.map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: "1rem", paddingBottom: "1.25rem", borderBottom: "1px solid #eeeeef" }}>
                      <div
                        style={{
                          width: "72px",
                          height: "72px",
                          backgroundColor: "#f3f3f4",
                          borderRadius: "4px",
                          overflow: "hidden",
                          flexShrink: 0,
                        }}
                      >
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: "14px", fontWeight: 600, color: "#1a1c1d", margin: "0 0 2px" }}>{item.name}</p>
                        <p style={{ fontSize: "12px", color: "#78767b", margin: 0 }}>Qty: {item.quantity}</p>
                      </div>
                      <p style={{ fontSize: "14px", fontWeight: 600, color: "#1a1c1d", margin: 0, whiteSpace: "nowrap" }}>
                        ${item.price}
                      </p>
                    </div>
                  ))
                ) : (
                  <>
                    <div style={{ display: "flex", gap: "1rem", paddingBottom: "1.25rem", borderBottom: "1px solid #eeeeef" }}>
                      <div style={{ width: "72px", height: "72px", backgroundColor: "#f3f3f4", borderRadius: "4px", overflow: "hidden", flexShrink: 0 }}>
                        <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200" alt="Studio Master Wireless Headphones" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: "10px", color: "#78767b", textTransform: "uppercase", letterSpacing: "0.06em" }}>ACOUSTICS &amp; HARDWARE</span>
                        <p style={{ fontSize: "14px", fontWeight: 600, color: "#1a1c1d", margin: "2px 0 2px" }}>Studio Master Wireless Headphones</p>
                        <p style={{ fontSize: "12px", color: "#78767b", margin: 0 }}>Finish: Carbon Black · Serial Calibration Included</p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ fontSize: "14px", fontWeight: 600, color: "#1a1c1d", margin: 0 }}>$490.00</p>
                        <p style={{ fontSize: "11px", color: "#78767b", margin: 0 }}>Qty: 1</p>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "1rem", paddingBottom: "1.25rem", borderBottom: "1px solid #eeeeef" }}>
                      <div style={{ width: "72px", height: "72px", backgroundColor: "#f3f3f4", borderRadius: "4px", overflow: "hidden", flexShrink: 0 }}>
                        <img src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200" alt="Ceramic Pour-Over Set" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: "10px", color: "#78767b", textTransform: "uppercase", letterSpacing: "0.06em" }}>LIVING OBJECTS</span>
                        <p style={{ fontSize: "14px", fontWeight: 600, color: "#1a1c1d", margin: "2px 0 2px" }}>Ceramic Pour-Over Set</p>
                        <p style={{ fontSize: "12px", color: "#78767b", margin: 0 }}>Finish: Chalk White · Precision Dripper &amp; Carafe</p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ fontSize: "14px", fontWeight: 600, color: "#1a1c1d", margin: 0 }}>$165.00</p>
                        <p style={{ fontSize: "11px", color: "#78767b", margin: 0 }}>Qty: 1</p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid #e2e2e3" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#5f5e61", marginBottom: "6px" }}>
                  <span>Subtotal</span>
                  <span>${order?.subtotal || "655.00"}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#5f5e61", marginBottom: "6px" }}>
                  <span>Express Climate-Compensated Courier</span>
                  <span style={{ color: "#16a34a" }}>$0.00 (Complimentary)</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#5f5e61", marginBottom: "6px" }}>
                  <span>Estimated Tax (NY State 8.875%)</span>
                  <span>${order?.tax || "41.60"}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "#1a1c1d",
                    marginTop: "12px",
                    paddingTop: "12px",
                    borderTop: "2px solid #1a1c1d",
                  }}
                >
                  <div>
                    <span>Total Paid</span>
                    <span style={{ display: "block", fontSize: "11px", color: "#78767b", fontWeight: 400 }}>Inclusive VAT / Local sales tax</span>
                  </div>
                  <span>${order?.total || "696.60"}</span>
                </div>
              </div>
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
                <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#1a1c1d", margin: 0 }}>Fulfillment Status</h2>
                <span style={{ fontSize: "11px", color: "#16a34a", fontWeight: 600, letterSpacing: "0.06em" }}>● ACTIVE</span>
              </div>

              <div style={{ position: "relative", paddingLeft: "28px" }}>
                {[
                  { label: "Order Placed (Completed)", desc: "Oct 24, 2024 · 14:32 CEST\nPayment verified via Stripe B2B secure gateway.", active: true, done: true },
                  { label: "Awaiting Dispatch", desc: "Zurich Atelier · Packaging in progress\nInspected for structural precision and certified serial pairing.", active: true, done: false },
                  { label: "In Transit", desc: "Estimated departure: Oct 25, 2024", active: false, done: false },
                  { label: "Delivered", desc: "Signature required upon arrival", active: false, done: false },
                ].map((step, idx, arr) => (
                  <div key={idx} style={{ position: "relative", paddingBottom: idx < arr.length - 1 ? "2rem" : "0" }}>
                    <div
                      style={{
                        position: "absolute",
                        left: "-28px",
                        top: "2px",
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        backgroundColor: step.done ? "#000000" : step.active ? "#16a34a" : "#e2e2e3",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 2,
                      }}
                    >
                      {step.done ? (
                        <span className="material-symbols-outlined" style={{ fontSize: "12px", color: "#fff", fontVariationSettings: "'FILL' 1, 'wght' 600" }}>
                          check
                        </span>
                      ) : step.active ? (
                        <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#fff" }}></span>
                      ) : null}
                    </div>
                    {idx < arr.length - 1 && (
                      <div
                        style={{
                          position: "absolute",
                          left: "-21px",
                          top: "20px",
                          width: "2px",
                          height: "calc(100% - 4px)",
                          backgroundColor: step.done ? "#000000" : "#e2e2e3",
                        }}
                      />
                    )}
                    <p style={{ fontSize: "14px", fontWeight: step.active || step.done ? 600 : 400, color: step.active || step.done ? "#1a1c1d" : "#78767b", margin: "0 0 4px" }}>
                      {step.label}
                    </p>
                    {step.desc && (
                      <p style={{ fontSize: "12px", color: "#78767b", margin: 0, lineHeight: 1.5, whiteSpace: "pre-line" }}>{step.desc}</p>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ marginTop: "1rem", fontSize: "12px", color: "#78767b", display: "flex", justifyContent: "space-between" }}>
                <span>Courier: Swiss Express Logistics</span>
                <span style={{ color: "#000000", fontWeight: 600 }}>Track: NV-8954-CH</span>
              </div>

              <div
                style={{
                  marginTop: "2.5rem",
                  padding: "1.25rem",
                  backgroundColor: "#f3f3f4",
                  borderRadius: "6px",
                  border: "1px solid #e2e2e3",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "8px" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "20px", color: "#1a1c1d" }}>
                    mark_email_read
                  </span>
                  <h4 style={{ fontSize: "14px", fontWeight: 600, color: "#1a1c1d", margin: 0 }}>What to expect next</h4>
                </div>
                <p style={{ fontSize: "13px", color: "#5f5e61", lineHeight: 1.6, margin: 0 }}>
                  You will receive real-time SMS and email dispatches as your package clears customs and moves into transit. A physical Certificate of Authenticity is enclosed inside the packaging.
                </p>
              </div>

              <div
                style={{
                  marginTop: "1.25rem",
                  padding: "1.25rem",
                  backgroundColor: "#ffffff",
                  borderRadius: "6px",
                  border: "1px solid #e2e2e3",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#f3f3f4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "20px", color: "#1a1c1d" }}>
                      support_agent
                    </span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: "14px", fontWeight: 600, color: "#1a1c1d", margin: "0 0 4px" }}>Concierge Support</h4>
                    <p style={{ fontSize: "12px", color: "#5f5e61", margin: 0, lineHeight: 1.5 }}>
                      Need alterations to your order? Contact our Concierge within 2 hours of placement.
                    </p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
                      <span style={{ fontSize: "12px", fontWeight: 600, color: "#000000" }}>Start Online Chat &rarr;</span>
                      <span style={{ fontSize: "11px", color: "#78767b" }}>Average response &lt; 5 min</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: "3rem" }}>
            <a
              href="/Collections"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                width: "100%",
                maxWidth: "480px",
                padding: "14px 32px",
                backgroundColor: "#000000",
                color: "#ffffff",
                borderRadius: "4px",
                fontSize: "14px",
                fontWeight: 600,
                textDecoration: "none",
                letterSpacing: "0.02em",
              }}
            >
              Continue Shopping &rarr;
            </a>
            <div style={{ marginTop: "1rem" }}>
              <a href="/Collections" style={{ fontSize: "12px", color: "#78767b", textDecoration: "underline" }}>
                View Order in Your Account
              </a>
            </div>
          </div>
        </main>
      )}

      <Footer />
      <CartDrawer />
    </div>
  );
}
