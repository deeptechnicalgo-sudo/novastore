"use client";

import { useState, useEffect } from "react";
import { formatPrice } from "./CurrencyMenu";

export function getCartItems() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("nova_cart");
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function addToCart(product) {
  if (typeof window === "undefined") return;
  try {
    const current = getCartItems();
    const prodId = product.id;
    const existingIndex = current.findIndex((item) => item.id === prodId);

    let updated;
    if (existingIndex > -1) {
      updated = [...current];
      updated[existingIndex].quantity = (updated[existingIndex].quantity || 1) + 1;
    } else {
      updated = [
        ...current,
        {
          id: product.id,
          title: product.des || product.title || product.type || "Nova Creation",
          price: typeof product.price === "number" ? product.price : parseFloat(String(product.price).replace(/[^0-9.]/g, "")) || 0,
          image: product.imageurl || product.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
          color: product.colors || "Default",
          category: product.type || product.category || "Objects",
          quantity: 1,
        },
      ];
    }

    localStorage.setItem("nova_cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cart-change"));
    window.dispatchEvent(new Event("open-cart"));
  } catch (e) {}
}

export function CartButton() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    function updateCount() {
      const items = getCartItems();
      const total = items.reduce((acc, item) => acc + (item.quantity || 1), 0);
      setCount(total);
    }

    updateCount();
    window.addEventListener("cart-change", updateCount);
    window.addEventListener("storage", updateCount);

    return () => {
      window.removeEventListener("cart-change", updateCount);
      window.removeEventListener("storage", updateCount);
    };
  }, []);

  return (
    <button
      aria-label="Shopping bag"
      className="icon-button bag-button"
      type="button"
      onClick={() => window.dispatchEvent(new Event("toggle-cart"))}
      style={{
        position: "relative",
        background: "transparent",
        border: "none",
        cursor: "pointer",
        padding: "6px 8px",
        display: "inline-flex",
        alignItems: "flex-end",
        gap: "4px",
        color: "inherit"
      }}
    >
      <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
        <span className="material-symbols-outlined" style={{ fontSize: "26px" }}>
          shopping_cart
        </span>
        <span
          style={{
            position: "absolute",
            top: "-6px",
            right: "-4px",
            minWidth: "16px",
            height: "16px",
            padding: "0 4px",
            backgroundColor: "#ffffff",
            color: "#131921",
            fontSize: "10px",
            fontWeight: 800,
            borderRadius: "9999px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: 1
          }}
        >
          {count}
        </span>
      </div>
      <span style={{ fontSize: "13px", fontWeight: 700, color: "inherit", paddingBottom: "2px" }}>Cart</span>
    </button>
  );
}

export default function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [currency, setCurrency] = useState("USD");
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  useEffect(() => {
    function loadCart() {
      setItems(getCartItems());
    }

    function handleCurrencyChange(e) {
      if (e.detail) setCurrency(e.detail);
    }

    try {
      const savedCurr = localStorage.getItem("selected_currency");
      if (savedCurr) setCurrency(savedCurr);
    } catch (e) {}

    loadCart();

    function handleOpen() {
      setIsOpen(true);
      setCheckoutSuccess(false);
    }

    function handleToggle() {
      setIsOpen((prev) => !prev);
      setCheckoutSuccess(false);
    }

    window.addEventListener("cart-change", loadCart);
    window.addEventListener("storage", loadCart);
    window.addEventListener("open-cart", handleOpen);
    window.addEventListener("toggle-cart", handleToggle);
    window.addEventListener("currency-change", handleCurrencyChange);

    return () => {
      window.removeEventListener("cart-change", loadCart);
      window.removeEventListener("storage", loadCart);
      window.removeEventListener("open-cart", handleOpen);
      window.removeEventListener("toggle-cart", handleToggle);
      window.removeEventListener("currency-change", handleCurrencyChange);
    };
  }, []);

  function updateQuantity(id, delta) {
    const updated = items
      .map((item) => {
        if (item.id === id) {
          const newQty = (item.quantity || 1) + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter(Boolean);

    setItems(updated);
    try {
      localStorage.setItem("nova_cart", JSON.stringify(updated));
      window.dispatchEvent(new Event("cart-change"));
    } catch (e) {}
  }

  function removeItem(id) {
    const updated = items.filter((item) => item.id !== id);
    setItems(updated);
    try {
      localStorage.setItem("nova_cart", JSON.stringify(updated));
      window.dispatchEvent(new Event("cart-change"));
    } catch (e) {}
  }

  const [checkoutLoading, setCheckoutLoading] = useState(false);

  async function handleCheckout() {
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Checkout failed");
        setCheckoutLoading(false);
      }
    } catch (e) {
      alert("Checkout error");
      setCheckoutLoading(false);
    }
  }

  const totalCount = items.reduce((acc, item) => acc + (item.quantity || 1), 0);
  const subtotal = items.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 1), 0);

  return (
    <>
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.35)",
            backdropFilter: "blur(2px)",
            zIndex: 9998,
            transition: "opacity 0.25s ease"
          }}
        />
      )}

      <aside
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "#ffffff",
          zIndex: 9999,
          boxShadow: "-8px 0 32px rgba(0, 0, 0, 0.12)",
          display: "flex",
          flexDirection: "column",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
        }}
      >
        <div
          style={{
            padding: "1.25rem 1.5rem",
            borderBottom: "1px solid #eeeeef",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#1a1c1d", margin: 0 }}>
              Your Bag
            </h3>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 600,
                backgroundColor: "#f3f3f4",
                padding: "2px 8px",
                borderRadius: "9999px",
                color: "#5f5e61"
              }}
            >
              {totalCount} {totalCount === 1 ? "Item" : "Items"}
            </span>
          </div>
          <button
            aria-label="Close cart"
            type="button"
            onClick={() => setIsOpen(false)}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              display: "flex",
              alignItems: "center",
              color: "#5f5e61"
            }}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
          {checkoutSuccess ? (
            <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#16a34a" }}>
                check_circle
              </span>
              <h4 style={{ fontSize: "18px", fontWeight: 600, marginTop: "1rem", color: "#1a1c1d" }}>
                Order Received
              </h4>
              <p style={{ fontSize: "13px", color: "#5f5e61", marginTop: "0.5rem", lineHeight: 1.5 }}>
                Thank you for your acquisition. A dispatch confirmation has been scheduled for architectural fulfillment.
              </p>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                style={{
                  marginTop: "1.5rem",
                  padding: "10px 24px",
                  backgroundColor: "#000000",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "13px",
                  fontWeight: 500,
                  cursor: "pointer"
                }}
              >
                Continue Exploring
              </button>
            </div>
          ) : items.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "44px", color: "#c8c5ca" }}>
                shopping_bag
              </span>
              <h4 style={{ fontSize: "16px", fontWeight: 600, marginTop: "1rem", color: "#1a1c1d" }}>
                Your bag is empty
              </h4>
              <p style={{ fontSize: "13px", color: "#78767b", marginTop: "0.5rem" }}>
                Explore calibrated outerwear, sound hardware, and architectural objects.
              </p>
              <a
                href="/Collections"
                onClick={() => setIsOpen(false)}
                style={{
                  display: "inline-block",
                  marginTop: "1.25rem",
                  padding: "10px 20px",
                  backgroundColor: "#000000",
                  color: "#ffffff",
                  borderRadius: "4px",
                  fontSize: "13px",
                  fontWeight: 500,
                  textDecoration: "none"
                }}
              >
                View Collections
              </a>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    gap: "1rem",
                    paddingBottom: "1.25rem",
                    borderBottom: "1px solid #eeeeef"
                  }}
                >
                  <div
                    style={{
                      width: "72px",
                      height: "72px",
                      backgroundColor: "#f3f3f4",
                      borderRadius: "4px",
                      overflow: "hidden",
                      flexShrink: 0
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>

                  <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                      <div>
                        <p style={{ fontSize: "13px", fontWeight: 600, color: "#1a1c1d", margin: 0 }}>
                          {item.title}
                        </p>
                        {item.color && (
                          <p style={{ fontSize: "11px", color: "#78767b", margin: "2px 0 0 0" }}>
                            {item.color}
                          </p>
                        )}
                      </div>
                      <span style={{ fontSize: "13px", fontWeight: 600, color: "#1a1c1d" }}>
                        {formatPrice(item.price * (item.quantity || 1), currency)}
                      </span>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          border: "1px solid #e2e2e3",
                          borderRadius: "3px",
                          padding: "2px 8px",
                          gap: "10px",
                          fontSize: "12px"
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "#5f5e61", fontSize: "14px" }}
                        >
                          -
                        </button>
                        <span style={{ fontWeight: 600, minWidth: "12px", textAlign: "center" }}>
                          {item.quantity || 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "#5f5e61", fontSize: "14px" }}
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "11px",
                          color: "#78767b",
                          textDecoration: "underline"
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && !checkoutSuccess && (
          <div style={{ padding: "1.25rem 1.5rem", backgroundColor: "#f9f9fa", borderTop: "1px solid #eeeeef" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#5f5e61" }}>
                <span>Subtotal</span>
                <span style={{ fontWeight: 600, color: "#1a1c1d" }}>{formatPrice(subtotal, currency)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#5f5e61" }}>
                <span>Worldwide Shipping</span>
                <span style={{ color: "#16a34a", fontWeight: 500 }}>Complimentary</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "#1a1c1d",
                  paddingTop: "8px",
                  borderTop: "1px solid #e2e2e3"
                }}
              >
                <span>Estimated Total</span>
                <span>{formatPrice(subtotal, currency)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              disabled={checkoutLoading}
              style={{
                width: "100%",
                height: "44px",
                backgroundColor: checkoutLoading ? "#555" : "#000000",
                color: "#ffffff",
                border: "none",
                borderRadius: "4px",
                fontSize: "13px",
                fontWeight: 600,
                letterSpacing: "0.02em",
                cursor: checkoutLoading ? "wait" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                opacity: checkoutLoading ? 0.7 : 1,
              }}
            >
              <span>{checkoutLoading ? "Redirecting to Stripe..." : "Proceed to Checkout"}</span>
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>{checkoutLoading ? "hourglass_top" : "lock"}</span>
            </button>
            <p style={{ fontSize: "11px", color: "#78767b", textAlign: "center", marginTop: "8px", margin: "8px 0 0 0" }}>
              Carbon-neutral delivery. Lifetime craftsmanship guarantee.
            </p>
          </div>
        )}
      </aside>
    </>
  );
}

