"use client";

import { useState, useEffect, useRef } from "react";

export default function SearchBar({ onSearch, placeholder = "Search creations, coats, audio..." }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  function handleChange(e) {
    const val = e.target.value;
    setQuery(val);
    if (onSearch) {
      onSearch(val);
    }
    window.dispatchEvent(new CustomEvent("nova-search", { detail: val }));
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      if (typeof window !== "undefined" && !window.location.pathname.includes("/Collections")) {
        window.location.href = `/Collections?search=${encodeURIComponent(query)}`;
      }
    } else if (e.key === "Escape") {
      handleClear();
    }
  }

  function handleClear() {
    setQuery("");
    if (onSearch) {
      onSearch("");
    }
    window.dispatchEvent(new CustomEvent("nova-search", { detail: "" }));
    setIsOpen(false);
  }

  return (
    <div style={{ display: "inline-flex", alignItems: "center", position: "relative" }}>
      {isOpen ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            backgroundColor: "#f3f3f4",
            padding: "4px 8px 4px 10px",
            borderRadius: "6px",
            border: "1px solid rgba(200, 197, 202, 0.6)",
            maxWidth: "280px"
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#5f5e61" }}>
            search
          </span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              fontSize: "12px",
              color: "#1a1c1d",
              width: "180px",
              fontFamily: "inherit"
            }}
          />
          <button
            type="button"
            onClick={handleClear}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "2px",
              display: "flex",
              alignItems: "center",
              color: "#78767b"
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>close</span>
          </button>
        </div>
      ) : (
        <button
          aria-label="Search"
          className="icon-button"
          type="button"
          onClick={() => setIsOpen(true)}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "4px",
            display: "inline-flex",
            alignItems: "center",
            color: "inherit"
          }}
        >
          <span className="material-symbols-outlined" data-icon="search">search</span>
        </button>
      )}
    </div>
  );
}

