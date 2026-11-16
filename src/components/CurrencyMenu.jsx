"use client";

import { useState, useEffect } from "react";

export const CURRENCIES = {
  USD: { code: "USD", symbol: "$", rate: 1.0, label: "US Dollar" },
  EUR: { code: "EUR", symbol: "€", rate: 0.92, label: "Euro" },
  GBP: { code: "GBP", symbol: "£", rate: 0.79, label: "British Pound" },
  JPY: { code: "JPY", symbol: "¥", rate: 155, label: "Japanese Yen" },
};

export function formatPrice(baseUsd, currencyCode = "USD") {
  const curr = CURRENCIES[currencyCode] || CURRENCIES.USD;
  const num = typeof baseUsd === "string" ? parseFloat(baseUsd.replace(/[^0-9.]/g, "")) : baseUsd;
  if (isNaN(num)) return baseUsd;
  const converted = Math.round(num * curr.rate);
  if (currencyCode === "JPY") {
    return `${curr.symbol}${converted.toLocaleString()}`;
  }
  return `${curr.symbol}${converted.toLocaleString()}`;
}

export default function CurrencyMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [current, setCurrent] = useState("USD");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("selected_currency");
      if (saved && CURRENCIES[saved]) {
        setCurrent(saved);
      }
    } catch (e) {}

    function handleClickOutside(e) {
      if (!e.target.closest("#nova-currency-wrapper")) {
        setIsOpen(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  function handleSelect(code) {
    setCurrent(code);
    setIsOpen(false);
    try {
      localStorage.setItem("selected_currency", code);
      window.dispatchEvent(new CustomEvent("currency-change", { detail: code }));
    } catch (e) {}
  }

  return (
    <div style={{ position: "relative", display: "inline-block" }} id="nova-currency-wrapper">
      <button
        aria-expanded={isOpen}
        aria-label="Currency Selector"
        className="icon-button currency-btn"
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: "4px 8px",
          borderRadius: "4px",
          fontSize: "12px",
          fontWeight: 600,
          letterSpacing: "0.04em",
          color: "inherit"
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>currency_exchange</span>
        <span>{current}</span>
      </button>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            width: "160px",
            backgroundColor: "#ffffff",
            border: "1px solid rgba(200, 197, 202, 0.6)",
            borderRadius: "4px",
            boxShadow: "0 12px 28px -4px rgba(0, 0, 0, 0.1)",
            padding: "4px 0",
            zIndex: 150
          }}
        >
          {Object.values(CURRENCIES).map((c) => (
            <button
              key={c.code}
              type="button"
              onClick={() => handleSelect(c.code)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 12px",
                fontSize: "12px",
                fontWeight: current === c.code ? 600 : 400,
                color: current === c.code ? "#000000" : "#5f5e61",
                backgroundColor: current === c.code ? "#f3f3f4" : "transparent",
                border: "none",
                cursor: "pointer",
                textAlign: "left"
              }}
            >
              <span>{c.code} ({c.symbol})</span>
              {current === c.code && (
                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>check</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

