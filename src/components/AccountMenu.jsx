"use client";

import { useState, useEffect } from "react";

export default function AccountMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    function loadUser() {
      try {
        const stored = localStorage.getItem("user");
        if (stored) {
          const parsed = JSON.parse(stored);
          setCurrentUser(parsed);
          const email = parsed.emailaddress || parsed.email;
          if (email) {
            fetch(`/api/admin/check?email=${encodeURIComponent(email)}`)
              .then((res) => res.json())
              .then((data) => {
                if (data && typeof data.isAdmin === "boolean") {
                  setCurrentUser((prev) => {
                    if (!prev) return prev;
                    const updated = { ...prev, isAdmin: data.isAdmin };
                    try {
                      localStorage.setItem("user", JSON.stringify(updated));
                    } catch (e) {}
                    return updated;
                  });
                }
              })
              .catch(() => {});
          }
        } else {
          setCurrentUser(null);
        }
      } catch (e) {
        setCurrentUser(null);
      }
    }

    loadUser();

    function handleClickOutside(e) {
      if (!e.target.closest("#nova-account-dropdown-container")) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(e) {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("auth-change", loadUser);
    window.addEventListener("storage", loadUser);
    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("auth-change", loadUser);
      window.removeEventListener("storage", loadUser);
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function handleSignOut(e) {
    e.preventDefault();
    try {
      localStorage.removeItem("user");
      document.cookie = "user_session=; max-age=0; path=/;";
    } catch (err) {}
    setCurrentUser(null);
    window.dispatchEvent(new Event("auth-change"));
  }

  const initials = currentUser
    ? (currentUser.username || currentUser.name || "M").substring(0, 2).toUpperCase()
    : "M";

  return (
    <div className="nova-account-dropdown-wrapper" id="nova-account-dropdown-container" style={{ position: "relative", display: "inline-block" }}>
      <button
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Account Login"
        className="nova-account-trigger"
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: "0",
          display: "flex",
          alignItems: "center",
          gap: "2px",
          color: "inherit",
          fontSize: "13px",
          fontWeight: 700
        }}
      >
        <span>Account &amp; Lists</span>
        <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>arrow_drop_down</span>
      </button>

      <div
        aria-label="Account Options"
        className={`nova-account-menu ${isOpen ? "is-open" : ""}`}
        role="region"
      >
        {currentUser ? (
          <div className="nova-account-tab-pane is-active">
            <div className="nova-profile-badge">
              <div className="nova-avatar">{initials}</div>
              <div className="nova-profile-info">
                <p className="nova-profile-name">{currentUser.username || currentUser.name || "Member"}</p>
                <p className="nova-profile-email">{currentUser.emailaddress || currentUser.email || ""}</p>
                <span className="nova-profile-tier" style={currentUser.isAdmin ? { backgroundColor: "#eab308", color: "#000", fontWeight: 700 } : {}}>
                  {currentUser.isAdmin ? "Administrator" : "Tier 01 Member"}
                </span>
              </div>
            </div>
            <ul className="nova-account-links">
              {currentUser.isAdmin && (
                <li>
                  <a
                    className="nova-account-link-item"
                    href="/admin"
                    style={{
                      backgroundColor: "rgba(234, 179, 8, 0.12)",
                      border: "1px solid rgba(234, 179, 8, 0.35)",
                      borderRadius: "6px",
                      color: "#b45309",
                      fontWeight: 700,
                      marginBottom: "6px"
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ color: "#d97706" }}>admin_panel_settings</span>
                    <span>Admin Dashboard</span>
                    <span style={{ marginLeft: "auto", fontSize: "10px", backgroundColor: "#d97706", color: "#fff", padding: "1px 6px", borderRadius: "4px" }}>ADMIN</span>
                  </a>
                </li>
              )}
              <li>
                <a className="nova-account-link-item" href="/Collections">
                  <span className="material-symbols-outlined">inventory_2</span>
                  <span>Orders &amp; Acquisitions</span>
                </a>
              </li>
              <li>
                <a className="nova-account-link-item" href="/Collections">
                  <span className="material-symbols-outlined">favorite</span>
                  <span>Saved Items &amp; Vault</span>
                </a>
              </li>
              <li>
                <a className="nova-account-link-item" href="#preferences">
                  <span className="material-symbols-outlined">tune</span>
                  <span>Atelier Preferences</span>
                </a>
              </li>
            </ul>
            <a className="nova-btn-primary" href="/Collections">
              <span>Explore Collections</span>
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>arrow_forward</span>
            </a>
            <a
              className="nova-account-signout"
              href="#signout"
              onClick={handleSignOut}
            >
              <span>Sign Out</span>
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>logout</span>
            </a>
          </div>
        ) : (
          <div className="nova-account-tab-pane is-active">
            <p className="nova-guest-intro">
              Access your orders, architectural vault allocations, and bespoke atelier appointments.
            </p>
            <a className="nova-btn-primary" href="/sing">
              <span>Sign In</span>
            </a>
            <a className="nova-btn-secondary" href="/signup">
              <span>Create Account / Sign Up</span>
            </a>
            <ul
              className="nova-account-links"
              style={{ marginTop: "0.875rem", borderTop: "1px solid #eeeeef", paddingTop: "0.5rem" }}
            >
              <li>
                <a className="nova-account-link-item" href="#track-order">
                  <span className="material-symbols-outlined">local_shipping</span>
                  <span>Track Order</span>
                </a>
              </li>
              <li>
                <a className="nova-account-link-item" href="#concierge">
                  <span className="material-symbols-outlined">support_agent</span>
                  <span>Concierge Support</span>
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

