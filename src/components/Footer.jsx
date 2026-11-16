"use client";

export default function Footer() {
  function scrollToTop() {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <footer style={{ backgroundColor: "#232f3e", color: "#ffffff", fontFamily: "Inter, sans-serif", marginTop: "auto" }}>
      <button
        type="button"
        onClick={scrollToTop}
        style={{
          width: "100%",
          padding: "15px 0",
          backgroundColor: "#37475a",
          color: "#ffffff",
          border: "none",
          fontSize: "13px",
          fontWeight: 600,
          cursor: "pointer",
          textAlign: "center",
          transition: "background 0.2s"
        }}
      >
        Back to top
      </button>

      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "48px 24px 36px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "36px"
        }}
      >
        <div>
          <h4 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "14px", color: "#ffffff" }}>
            Get to Know Us
          </h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
            <li><a href="/Collections" style={{ color: "#dddddd", fontSize: "13px", textDecoration: "none" }}>About NOVA STORE</a></li>
            <li><a href="/Collections" style={{ color: "#dddddd", fontSize: "13px", textDecoration: "none" }}>Architectural Purity</a></li>
            <li><a href="/Collections" style={{ color: "#dddddd", fontSize: "13px", textDecoration: "none" }}>Sustainability &amp; Carbon Ledger</a></li>
            <li><a href="/Collections" style={{ color: "#dddddd", fontSize: "13px", textDecoration: "none" }}>Press &amp; Editorial</a></li>
            <li><a href="/Collections" style={{ color: "#dddddd", fontSize: "13px", textDecoration: "none" }}>Careers</a></li>
          </ul>
        </div>

        <div>
          <h4 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "14px", color: "#ffffff" }}>
            Shop with Us
          </h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
            <li><a href="/Collections" style={{ color: "#dddddd", fontSize: "13px", textDecoration: "none" }}>All Collections</a></li>
            <li><a href="/Collections" style={{ color: "#dddddd", fontSize: "13px", textDecoration: "none" }}>New Arrivals</a></li>
            <li><a href="/Collections" style={{ color: "#dddddd", fontSize: "13px", textDecoration: "none" }}>Outerwear</a></li>
            <li><a href="/Collections" style={{ color: "#dddddd", fontSize: "13px", textDecoration: "none" }}>Sound &amp; Hardware</a></li>
            <li><a href="/Collections" style={{ color: "#dddddd", fontSize: "13px", textDecoration: "none" }}>Archival Creations</a></li>
          </ul>
        </div>

        <div>
          <h4 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "14px", color: "#ffffff" }}>
            Payment &amp; Delivery
          </h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
            <li><a href="/Collections" style={{ color: "#dddddd", fontSize: "13px", textDecoration: "none" }}>Stripe Secure Checkout</a></li>
            <li><a href="/Collections" style={{ color: "#dddddd", fontSize: "13px", textDecoration: "none" }}>Carbon-Neutral Shipping</a></li>
            <li><a href="/Collections" style={{ color: "#dddddd", fontSize: "13px", textDecoration: "none" }}>Currency Converter</a></li>
            <li><a href="/Collections" style={{ color: "#dddddd", fontSize: "13px", textDecoration: "none" }}>Order Protection Guarantee</a></li>
            <li><a href="/Collections" style={{ color: "#dddddd", fontSize: "13px", textDecoration: "none" }}>Global Hub Locations</a></li>
          </ul>
        </div>

        <div>
          <h4 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "14px", color: "#ffffff" }}>
            Let Us Help You
          </h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
            <li><a href="/Collections" style={{ color: "#dddddd", fontSize: "13px", textDecoration: "none" }}>Your Account</a></li>
            <li><a href="/payment-success" style={{ color: "#dddddd", fontSize: "13px", textDecoration: "none" }}>Your Orders &amp; Receipts</a></li>
            <li><a href="/Collections" style={{ color: "#dddddd", fontSize: "13px", textDecoration: "none" }}>Shipping Rates &amp; Policies</a></li>
            <li><a href="/Collections" style={{ color: "#dddddd", fontSize: "13px", textDecoration: "none" }}>Returns &amp; Replacements</a></li>
            <li><a href="/Collections" style={{ color: "#dddddd", fontSize: "13px", textDecoration: "none" }}>Concierge Support</a></li>
          </ul>
        </div>
      </div>

      <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.1)", backgroundColor: "#131a22", padding: "28px 24px" }}>
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <span style={{ fontSize: "16px", fontWeight: 700, letterSpacing: "0.15em" }}>NOVA STORE</span>
            <span style={{ fontSize: "12px", color: "#999999" }}>Global Architecture &amp; Calibrated Living</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "18px", fontSize: "12px", color: "#cccccc" }}>
            <span>Conditions of Use</span>
            <span>Privacy Notice</span>
            <span>Interest-Based Ads</span>
            <span>&copy; {new Date().getFullYear()} NOVA STORE, Inc.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
