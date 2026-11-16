"use client";

import { useState, useEffect } from "react";
import AccountMenu from "./AccountMenu";
import CurrencyMenu from "./CurrencyMenu";
import { CartButton } from "./CartDrawer";

export default function Header({ onCategorySelect, activeCategory = "All" }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("All");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    function loadUser() {
      try {
        const stored = localStorage.getItem("user");
        if (stored) {
          setCurrentUser(JSON.parse(stored));
        } else {
          setCurrentUser(null);
        }
      } catch (e) {
        setCurrentUser(null);
      }
    }

    loadUser();
    window.addEventListener("auth-change", loadUser);
    window.addEventListener("storage", loadUser);

    try {
      const params = new URLSearchParams(window.location.search);
      const q = params.get("search") || params.get("q");
      if (q) setSearchQuery(q);
    } catch (e) {}

    return () => {
      window.removeEventListener("auth-change", loadUser);
      window.removeEventListener("storage", loadUser);
    };
  }, []);

  function handleSearchSubmit(e) {
    if (e) e.preventDefault();
    if (typeof window !== "undefined") {
      if (!window.location.pathname.includes("/Collections")) {
        window.location.href = `/Collections?search=${encodeURIComponent(searchQuery)}&category=${encodeURIComponent(searchCategory)}`;
      } else {
        window.dispatchEvent(new CustomEvent("nova-search", { detail: searchQuery }));
        if (onCategorySelect && searchCategory !== "All") {
          onCategorySelect(searchCategory);
        }
      }
    }
  }

  function handleCategoryClick(cat) {
    if (onCategorySelect) {
      onCategorySelect(cat);
    } else if (typeof window !== "undefined") {
      window.location.href = `/Collections?category=${encodeURIComponent(cat)}`;
    }
  }

  const displayName = currentUser ? (currentUser.username || currentUser.name || "Member") : "Sign in";

  return (
    <header style={{ width: "100%", position: "sticky", top: 0, zIndex: 100, backgroundColor: "#131921", color: "#ffffff", fontFamily: "Inter, sans-serif" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "6px 16px",
          maxWidth: "1600px",
          margin: "0 auto",
          minHeight: "60px",
          flexWrap: "nowrap"
        }}
      >
        <a
          href="/Collections"
          style={{
            display: "flex",
            alignItems: "center",
            padding: "6px 10px",
            border: "1px solid transparent",
            borderRadius: "2px",
            textDecoration: "none",
            color: "#ffffff",
            fontWeight: 700,
            fontSize: "18px",
            letterSpacing: "0.12em",
            whiteSpace: "nowrap"
          }}
        >
          NOVA STORE
        </a>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            padding: "6px 8px",
            border: "1px solid transparent",
            borderRadius: "2px",
            cursor: "pointer",
            whiteSpace: "nowrap"
          }}
          title="Delivery Destination"
        >
          <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#cccccc" }}>
            location_on
          </span>
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}>
            <span style={{ fontSize: "11px", color: "#cccccc" }}>Deliver to</span>
            <span style={{ fontSize: "13px", fontWeight: 700, color: "#ffffff" }}>Global Hub</span>
          </div>
        </div>

        <form
          onSubmit={handleSearchSubmit}
          style={{
            flex: 1,
            display: "flex",
            height: "40px",
            borderRadius: "4px",
            overflow: "hidden",
            boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
            margin: "0 8px"
          }}
        >
          <select
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
            style={{
              backgroundColor: "#f3f3f3",
              color: "#1a1c1d",
              border: "none",
              borderRight: "1px solid #dcdcdc",
              padding: "0 10px",
              fontSize: "12px",
              fontWeight: 500,
              cursor: "pointer",
              outline: "none"
            }}
          >
            <option value="All">All</option>
            <option value="Outerwear">Outerwear</option>
            <option value="Tech">Tech & Audio</option>
            <option value="Living">Living & Objects</option>
            <option value="Accessories">Accessories</option>
            <option value="Essentials">Essentials</option>
          </select>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              window.dispatchEvent(new CustomEvent("nova-search", { detail: e.target.value }));
            }}
            placeholder="Search NOVA STORE creations, outerwear, audio, objects..."
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              padding: "0 14px",
              fontSize: "14px",
              color: "#1a1c1d",
              backgroundColor: "#ffffff"
            }}
          />

          <button
            type="submit"
            aria-label="Search"
            style={{
              width: "48px",
              backgroundColor: "#000000",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#ffffff",
              transition: "background 0.2s"
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>search</span>
          </button>
        </form>

        <div style={{ display: "flex", alignItems: "center", padding: "4px 8px" }}>
          <CurrencyMenu />
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", padding: "4px 8px", lineHeight: 1.15 }}>
            <span style={{ fontSize: "11px", color: "#cccccc" }}>Hello, {displayName}</span>
            <div style={{ display: "flex", alignItems: "center" }}>
              <AccountMenu />
            </div>
          </div>
        </div>

        <a
          href="/payment-success"
          style={{
            display: "flex",
            flexDirection: "column",
            lineHeight: 1.15,
            padding: "6px 10px",
            textDecoration: "none",
            color: "#ffffff",
            whiteSpace: "nowrap"
          }}
        >
          <span style={{ fontSize: "11px", color: "#cccccc" }}>Returns</span>
          <span style={{ fontSize: "13px", fontWeight: 700 }}>&amp; Orders</span>
        </a>

        <div style={{ display: "flex", alignItems: "center", padding: "4px 8px" }}>
          <CartButton />
        </div>
      </div>

      <nav
        style={{
          backgroundColor: "#232f3e",
          color: "#ffffff",
          padding: "0 16px",
          display: "flex",
          alignItems: "center",
          gap: "18px",
          height: "38px",
          fontSize: "13px",
          overflowX: "auto",
          whiteSpace: "nowrap",
          borderTop: "1px solid rgba(255,255,255,0.08)"
        }}
      >
        <button
          type="button"
          onClick={() => handleCategoryClick("All")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "none",
            border: "none",
            color: "#ffffff",
            fontWeight: 700,
            cursor: "pointer",
            fontSize: "13px",
            padding: "4px 0"
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>menu</span>
          All
        </button>

        {[
          { name: "All Collections", val: "All" },
          { name: "New Arrivals", val: "New" },
          { name: "Outerwear", val: "Outerwear" },
          { name: "Tech & Audio", val: "Tech" },
          { name: "Living & Design", val: "Living" },
          { name: "Accessories", val: "Accessories" },
          { name: "Essentials", val: "Essentials" },
          { name: "Best Sellers", val: "Bestseller" }
        ].map((item) => (
          <button
            key={item.name}
            type="button"
            onClick={() => handleCategoryClick(item.val)}
            style={{
              background: "none",
              border: "none",
              color: activeCategory.toLowerCase() === item.val.toLowerCase() ? "#ffffff" : "#dddddd",
              fontWeight: activeCategory.toLowerCase() === item.val.toLowerCase() ? 600 : 400,
              cursor: "pointer",
              fontSize: "13px",
              padding: "4px 2px",
              borderBottom: activeCategory.toLowerCase() === item.val.toLowerCase() ? "2px solid #ffffff" : "2px solid transparent"
            }}
          >
            {item.name}
          </button>
        ))}

        <div style={{ marginLeft: "auto", fontSize: "12px", color: "#cccccc", letterSpacing: "0.02em" }}>
          Complimentary Worldwide Carbon-Neutral Delivery
        </div>
      </nav>
    </header>
  );
}
