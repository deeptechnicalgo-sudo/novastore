"use client";

import { useState, useEffect } from "react";

export default function AdminDashboardClient() {
  const [authStatus, setAuthStatus] = useState("loading");
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState("analytics");

  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productSearch, setProductSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const [notification, setNotification] = useState(null);
  const [submittingProduct, setSubmittingProduct] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const initialForm = {
    des: "",
    price: "",
    imageurl: "",
    type: "Outerwear",
    colors: "Nero Black",
    rating: "4.9",
    isnew: true,
    isEdition: false
  };
  const [formData, setFormData] = useState(initialForm);

  function showNotify(message, type = "success") {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  }

  useEffect(() => {
    async function verifyAdmin() {
      try {
        let email = null;
        let storedUser = null;

        const stored = localStorage.getItem("user");
        if (stored) {
          storedUser = JSON.parse(stored);
          email = storedUser.emailaddress || storedUser.email;
        }

        const res = await fetch(`/api/admin/check${email ? `?email=${encodeURIComponent(email)}` : ""}`);
        const data = await res.json();

        if (data && data.isAdmin) {
          setAuthStatus("admin");
          const finalUser = data.user || storedUser;
          setCurrentUser(finalUser);
          if (finalUser) {
            localStorage.setItem("user", JSON.stringify({ ...finalUser, isAdmin: true }));
          }
          loadStats();
          loadProducts();
        } else if (storedUser || (data && data.user)) {
          setAuthStatus("not-admin");
          setCurrentUser(data.user || storedUser);
        } else {
          setAuthStatus("unauthorized");
        }
      } catch (err) {
        setAuthStatus("unauthorized");
      }
    }

    verifyAdmin();
  }, []);

  async function loadStats() {
    setLoadingStats(true);
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (e) {
    } finally {
      setLoadingStats(false);
    }
  }

  async function loadProducts() {
    setLoadingProducts(true);
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (e) {
    } finally {
      setLoadingProducts(false);
    }
  }

  async function loadUsers() {
    setLoadingUsers(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (e) {
    } finally {
      setLoadingUsers(false);
    }
  }

  useEffect(() => {
    if (activeTab === "users" && users.length === 0) {
      loadUsers();
    }
  }, [activeTab]);

  async function handleProductSubmit(e) {
    e.preventDefault();
    if (!formData.des || !formData.price || !formData.type) {
      showNotify("Please fill in title, price, and category", "error");
      return;
    }

    setSubmittingProduct(true);
    try {
      if (editingId) {
        const res = await fetch("/api/admin/products", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, ...formData })
        });
        const data = await res.json();
        if (data.success) {
          showNotify("Product updated successfully!");
          setEditingId(null);
          setFormData(initialForm);
          setActiveTab("products");
          loadProducts();
          loadStats();
        } else {
          showNotify(data.error || "Failed to update product", "error");
        }
      } else {
        const res = await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });
        const data = await res.json();
        if (data.success) {
          showNotify("New creation successfully published to store!");
          setFormData(initialForm);
          setActiveTab("products");
          loadProducts();
          loadStats();
        } else {
          showNotify(data.error || "Failed to add product", "error");
        }
      }
    } catch (err) {
      showNotify("Network communication error", "error");
    } finally {
      setSubmittingProduct(false);
    }
  }

  function handleEditClick(prod) {
    setEditingId(prod.id);
    setFormData({
      des: prod.des || "",
      price: prod.price || "",
      imageurl: prod.imageurl || "",
      type: prod.type || "Outerwear",
      colors: prod.colors || "Standard",
      rating: prod.rating ? String(prod.rating) : "4.9",
      isnew: Boolean(prod.isnew),
      isEdition: Boolean(prod.isEdition)
    });
    setActiveTab("add-product");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDeleteClick(id, title) {
    if (!confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/products?id=${encodeURIComponent(id)}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        showNotify("Product removed from catalog");
        setProducts((prev) => prev.filter((p) => p.id !== id));
        loadStats();
      } else {
        showNotify(data.error || "Could not delete product", "error");
      }
    } catch (err) {
      showNotify("Network error while deleting", "error");
    }
  }

  async function handleToggleAdmin(email, currentStatus) {
    try {
      const newStatus = !currentStatus;
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, isAdmin: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        showNotify(`Updated admin role for ${email}`);
        setUsers((prev) =>
          prev.map((u) => (u.emailaddress === email ? { ...u, isAdmin: newStatus } : u))
        );
      } else {
        showNotify(data.error || "Failed to update role", "error");
      }
    } catch (e) {
      showNotify("Network error", "error");
    }
  }

  function handleSignOut() {
    try {
      localStorage.removeItem("user");
      document.cookie = "user_session=; max-age=0; path=/;";
    } catch (e) {}
    window.location.href = "/sing";
  }

  if (authStatus === "loading") {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#090d16",
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Inter, sans-serif"
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              border: "3px solid rgba(255,255,255,0.1)",
              borderTopColor: "#fbbf24",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 16px"
            }}
          />
          <h2 style={{ fontSize: "16px", fontWeight: 600, letterSpacing: "0.08em" }}>
            AUTHENTICATING ACCESS...
          </h2>
          <p style={{ fontSize: "13px", color: "#9ca3af", marginTop: "4px" }}>
            Verifying Supabase administrative role credentials
          </p>
        </div>
      </div>
    );
  }

  if (authStatus === "unauthorized") {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#090d16",
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Inter, sans-serif",
          padding: "24px"
        }}
      >
        <div
          style={{
            maxWidth: "460px",
            width: "100%",
            backgroundColor: "#111827",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "12px",
            padding: "36px 30px",
            textAlign: "center"
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              backgroundColor: "rgba(239, 68, 68, 0.15)",
              color: "#ef4444",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px"
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "30px" }}>lock</span>
          </div>
          <h1 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>
            Sign In Required
          </h1>
          <p style={{ fontSize: "14px", color: "#9ca3af", lineHeight: "1.6", marginBottom: "24px" }}>
            You need to be signed in to access the NOVA STORE Administrative Console.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <a
              href="/sing?callbackUrl=/admin"
              style={{
                backgroundColor: "#fbbf24",
                color: "#000000",
                padding: "10px 20px",
                borderRadius: "6px",
                fontWeight: 600,
                fontSize: "14px",
                textDecoration: "none"
              }}
            >
              Sign In to Continue
            </a>
            <a
              href="/Collections"
              style={{
                backgroundColor: "rgba(255,255,255,0.08)",
                color: "#ffffff",
                padding: "10px 20px",
                borderRadius: "6px",
                fontWeight: 500,
                fontSize: "14px",
                textDecoration: "none"
              }}
            >
              Back to Store
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (authStatus === "not-admin") {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#090d16",
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Inter, sans-serif",
          padding: "24px"
        }}
      >
        <div
          style={{
            maxWidth: "520px",
            width: "100%",
            backgroundColor: "#111827",
            border: "1px solid rgba(251, 191, 36, 0.3)",
            borderRadius: "14px",
            padding: "40px 32px",
            textAlign: "center"
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              backgroundColor: "rgba(251, 191, 36, 0.15)",
              color: "#fbbf24",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px"
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "32px" }}>shield</span>
          </div>
          <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "8px" }}>
            Administrative Privileges Required
          </h1>
          <p style={{ fontSize: "14px", color: "#d1d5db", lineHeight: "1.6", marginBottom: "16px" }}>
            Signed in as <strong style={{ color: "#fbbf24" }}>{currentUser?.emailaddress || currentUser?.email}</strong>.
          </p>
          <div
            style={{
              backgroundColor: "rgba(0,0,0,0.4)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "8px",
              padding: "16px",
              textAlign: "left",
              fontSize: "13px",
              color: "#9ca3af",
              lineHeight: "1.6",
              marginBottom: "24px"
            }}
          >
            <p style={{ fontWeight: 600, color: "#f3f4f6", marginBottom: "4px" }}>
              How to enable Admin access:
            </p>
            1. Open your <strong>Supabase Dashboard</strong>.<br />
            2. Go to the <strong>Users</strong> table.<br />
            3. Find your user row and set the <strong>isAdmin</strong> column to <strong>true</strong>.<br />
            4. Refresh this page to enter the console.
          </div>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <button
              onClick={() => window.location.reload()}
              style={{
                backgroundColor: "#fbbf24",
                color: "#000000",
                border: "none",
                padding: "11px 22px",
                borderRadius: "6px",
                fontWeight: 600,
                fontSize: "14px",
                cursor: "pointer"
              }}
            >
              Re-check Admin Status
            </button>
            <a
              href="/Collections"
              style={{
                backgroundColor: "rgba(255,255,255,0.08)",
                color: "#ffffff",
                padding: "11px 22px",
                borderRadius: "6px",
                fontWeight: 500,
                fontSize: "14px",
                textDecoration: "none"
              }}
            >
              Return to Store
            </a>
          </div>
        </div>
      </div>
    );
  }

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !productSearch ||
      (p.des && p.des.toLowerCase().includes(productSearch.toLowerCase())) ||
      (p.type && p.type.toLowerCase().includes(productSearch.toLowerCase())) ||
      (p.colors && p.colors.toLowerCase().includes(productSearch.toLowerCase()));

    const matchesCategory =
      categoryFilter === "All" ||
      (p.type && p.type.toLowerCase() === categoryFilter.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#090d16",
        color: "#ffffff",
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif"
      }}
    >
      {notification && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: 9999,
            padding: "12px 20px",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
            backgroundColor: notification.type === "error" ? "#ef4444" : "#10b981",
            color: "#ffffff"
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
            {notification.type === "error" ? "error" : "check_circle"}
          </span>
          <span>{notification.message}</span>
        </div>
      )}

      <header
        style={{
          backgroundColor: "#0d1322",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          padding: "14px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                backgroundColor: "#fbbf24",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#000000",
                fontWeight: 800
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "22px" }}>
                shield_person
              </span>
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "16px", fontWeight: 800, letterSpacing: "0.06em" }}>
                  NOVA STORE
                </span>
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    backgroundColor: "rgba(251, 191, 36, 0.2)",
                    color: "#fbbf24",
                    border: "1px solid rgba(251, 191, 36, 0.4)",
                    padding: "1px 6px",
                    borderRadius: "4px"
                  }}
                >
                  ADMIN SUITE
                </span>
              </div>
              <span style={{ fontSize: "11px", color: "#9ca3af" }}>
                Supabase &amp; Stripe Management Console
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 12px",
              backgroundColor: "rgba(255,255,255,0.04)",
              borderRadius: "6px",
              fontSize: "12px",
              color: "#d1d5db"
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                backgroundColor: "#10b981",
                borderRadius: "50%",
                display: "inline-block"
              }}
            />
            <span>{currentUser?.emailaddress || currentUser?.email || "Super Admin"}</span>
          </div>

          <a
            href="/Collections"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "13px",
              color: "#ffffff",
              backgroundColor: "rgba(255,255,255,0.08)",
              padding: "7px 14px",
              borderRadius: "6px",
              textDecoration: "none",
              fontWeight: 500
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>store</span>
            <span>View Live Store</span>
          </a>

          <button
            onClick={handleSignOut}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "13px",
              color: "#ef4444",
              background: "none",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              padding: "6px 12px",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>logout</span>
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      <div
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          backgroundColor: "#0a0f1d",
          padding: "0 28px",
          display: "flex",
          gap: "8px",
          overflowX: "auto"
        }}
      >
        {[
          { id: "analytics", label: "Analytics & Overview", icon: "monitoring" },
          { id: "products", label: "Catalog Products", icon: "inventory_2" },
          { id: "add-product", label: editingId ? "Edit Product" : "+ Add New Product", icon: editingId ? "edit" : "add_box" },
          { id: "users", label: "Registered Users & Roles", icon: "group" }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id !== "add-product" && editingId) {
                  setEditingId(null);
                  setFormData(initialForm);
                }
                setActiveTab(tab.id);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "14px 18px",
                backgroundColor: "transparent",
                border: "none",
                borderBottom: isActive ? "2px solid #fbbf24" : "2px solid transparent",
                color: isActive ? "#fbbf24" : "#9ca3af",
                fontWeight: isActive ? 600 : 400,
                fontSize: "13px",
                cursor: "pointer",
                whiteSpace: "nowrap"
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                {tab.icon}
              </span>
              <span>{tab.label}</span>
              {tab.id === "products" && (
                <span
                  style={{
                    backgroundColor: "rgba(255,255,255,0.1)",
                    color: "#ffffff",
                    fontSize: "11px",
                    padding: "1px 6px",
                    borderRadius: "10px"
                  }}
                >
                  {products.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <main style={{ padding: "28px", maxWidth: "1400px", margin: "0 auto" }}>
        {activeTab === "analytics" && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px"
              }}
            >
              <div>
                <h1 style={{ fontSize: "22px", fontWeight: 700, margin: 0 }}>
                  Store Performance &amp; Analytics
                </h1>
                <p style={{ fontSize: "13px", color: "#9ca3af", marginTop: "4px" }}>
                  Real-time database analytics from Supabase `Products` and `Users`
                </p>
              </div>

              <button
                onClick={() => {
                  loadStats();
                  loadProducts();
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  backgroundColor: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#ffffff",
                  padding: "8px 14px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  cursor: "pointer"
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                  refresh
                </span>
                <span>Refresh Metrics</span>
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "18px",
                marginBottom: "28px"
              }}
            >
              <div
                style={{
                  backgroundColor: "#111827",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "10px",
                  padding: "20px"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", color: "#9ca3af" }}>
                  <span style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Total Catalog Valuation
                  </span>
                  <span className="material-symbols-outlined" style={{ color: "#fbbf24" }}>
                    monetization_on
                  </span>
                </div>
                <div style={{ fontSize: "28px", fontWeight: 700, marginTop: "10px", color: "#fbbf24" }}>
                  ${stats ? stats.totalCatalogValue.toLocaleString() : "..."}
                </div>
                <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}>
                  Aggregate value of all active store items
                </div>
              </div>

              <div
                style={{
                  backgroundColor: "#111827",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "10px",
                  padding: "20px"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", color: "#9ca3af" }}>
                  <span style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Total Products
                  </span>
                  <span className="material-symbols-outlined" style={{ color: "#60a5fa" }}>
                    inventory
                  </span>
                </div>
                <div style={{ fontSize: "28px", fontWeight: 700, marginTop: "10px" }}>
                  {stats ? stats.totalProducts : "..."}
                </div>
                <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}>
                  Active listings in Supabase
                </div>
              </div>

              <div
                style={{
                  backgroundColor: "#111827",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "10px",
                  padding: "20px"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", color: "#9ca3af" }}>
                  <span style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Average Item Price
                  </span>
                  <span className="material-symbols-outlined" style={{ color: "#34d399" }}>
                    price_check
                  </span>
                </div>
                <div style={{ fontSize: "28px", fontWeight: 700, marginTop: "10px" }}>
                  ${stats ? stats.averagePrice : "..."}
                </div>
                <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}>
                  Mean retail price across departments
                </div>
              </div>

              <div
                style={{
                  backgroundColor: "#111827",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "10px",
                  padding: "20px"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", color: "#9ca3af" }}>
                  <span style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Registered Users
                  </span>
                  <span className="material-symbols-outlined" style={{ color: "#a78bfa" }}>
                    group
                  </span>
                </div>
                <div style={{ fontSize: "28px", fontWeight: 700, marginTop: "10px" }}>
                  {stats ? stats.totalUsers : "..."}
                </div>
                <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}>
                  {stats ? `${stats.totalAdmins} with Administrator role` : ""}
                </div>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
                gap: "24px",
                marginBottom: "28px"
              }}
            >
              <div
                style={{
                  backgroundColor: "#111827",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "10px",
                  padding: "24px"
                }}
              >
                <h3 style={{ fontSize: "15px", fontWeight: 600, margin: "0 0 16px 0" }}>
                  Product Distribution by Department
                </h3>
                {stats && stats.categoryBreakdown && stats.categoryBreakdown.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    {stats.categoryBreakdown.map((cat) => (
                      <div key={cat.name}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: "13px",
                            marginBottom: "6px"
                          }}
                        >
                          <span>{cat.name}</span>
                          <span style={{ color: "#9ca3af" }}>
                            {cat.count} items ({cat.percentage}%)
                          </span>
                        </div>
                        <div
                          style={{
                            height: "6px",
                            backgroundColor: "rgba(255,255,255,0.08)",
                            borderRadius: "3px",
                            overflow: "hidden"
                          }}
                        >
                          <div
                            style={{
                              width: `${cat.percentage}%`,
                              height: "100%",
                              backgroundColor: "#fbbf24",
                              borderRadius: "3px"
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: "#9ca3af", fontSize: "13px" }}>No category distribution data.</p>
                )}
              </div>

              <div
                style={{
                  backgroundColor: "#111827",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "10px",
                  padding: "24px"
                }}
              >
                <h3 style={{ fontSize: "15px", fontWeight: 600, margin: "0 0 16px 0" }}>
                  Pricing Tier Segmentation
                </h3>
                {stats && stats.priceBrackets ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {[
                      { label: "Under $200 (Entry Essentials)", val: stats.priceBrackets.under200, color: "#34d399" },
                      { label: "$200 - $500 (Signature Atelier)", val: stats.priceBrackets.between200and500, color: "#60a5fa" },
                      { label: "$500 - $1,000 (Luxury Outerwear & Tech)", val: stats.priceBrackets.between500and1000, color: "#fbbf24" },
                      { label: "Over $1,000 (Archival / High Craft)", val: stats.priceBrackets.over1000, color: "#f87171" }
                    ].map((tier) => (
                      <div
                        key={tier.label}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "10px 14px",
                          backgroundColor: "rgba(255,255,255,0.03)",
                          borderRadius: "6px",
                          border: "1px solid rgba(255,255,255,0.05)"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span
                            style={{
                              width: "10px",
                              height: "10px",
                              backgroundColor: tier.color,
                              borderRadius: "2px"
                            }}
                          />
                          <span style={{ fontSize: "13px" }}>{tier.label}</span>
                        </div>
                        <span style={{ fontSize: "13px", fontWeight: 700, color: tier.color }}>
                          {tier.val} items
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: "#9ca3af", fontSize: "13px" }}>Loading pricing data...</p>
                )}
              </div>
            </div>

            <div
              style={{
                backgroundColor: "#111827",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "10px",
                padding: "24px"
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "16px"
                }}
              >
                <h3 style={{ fontSize: "15px", fontWeight: 600, margin: 0 }}>
                  Catalog Badges &amp; Highlights
                </h3>
                <button
                  onClick={() => setActiveTab("add-product")}
                  style={{
                    backgroundColor: "#fbbf24",
                    color: "#000000",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "4px",
                    fontWeight: 600,
                    fontSize: "12px",
                    cursor: "pointer"
                  }}
                >
                  + Add New Creation
                </button>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "16px"
                }}
              >
                <div
                  style={{
                    padding: "16px",
                    backgroundColor: "rgba(255,255,255,0.03)",
                    borderRadius: "8px",
                    border: "1px solid rgba(255,255,255,0.06)"
                  }}
                >
                  <span style={{ fontSize: "12px", color: "#9ca3af" }}>New Arrivals Flagged</span>
                  <div style={{ fontSize: "24px", fontWeight: 700, marginTop: "6px", color: "#10b981" }}>
                    {stats ? stats.newArrivalsCount : 0}
                  </div>
                </div>

                <div
                  style={{
                    padding: "16px",
                    backgroundColor: "rgba(255,255,255,0.03)",
                    borderRadius: "8px",
                    border: "1px solid rgba(255,255,255,0.06)"
                  }}
                >
                  <span style={{ fontSize: "12px", color: "#9ca3af" }}>Limited Edition Runs</span>
                  <div style={{ fontSize: "24px", fontWeight: 700, marginTop: "6px", color: "#ec4899" }}>
                    {stats ? stats.limitedEditionCount : 0}
                  </div>
                </div>

                <div
                  style={{
                    padding: "16px",
                    backgroundColor: "rgba(255,255,255,0.03)",
                    borderRadius: "8px",
                    border: "1px solid rgba(255,255,255,0.06)"
                  }}
                >
                  <span style={{ fontSize: "12px", color: "#9ca3af" }}>Payment Gateway</span>
                  <div style={{ fontSize: "14px", fontWeight: 600, marginTop: "8px", color: "#60a5fa" }}>
                    Stripe Checkout Active
                  </div>
                </div>

                <div
                  style={{
                    padding: "16px",
                    backgroundColor: "rgba(255,255,255,0.03)",
                    borderRadius: "8px",
                    border: "1px solid rgba(255,255,255,0.06)"
                  }}
                >
                  <span style={{ fontSize: "12px", color: "#9ca3af" }}>Database Engine</span>
                  <div style={{ fontSize: "14px", fontWeight: 600, marginTop: "8px", color: "#34d399" }}>
                    Supabase PostgreSQL Live
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "products" && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "16px",
                marginBottom: "20px"
              }}
            >
              <div>
                <h1 style={{ fontSize: "22px", fontWeight: 700, margin: 0 }}>
                  Store Catalog &amp; Products
                </h1>
                <p style={{ fontSize: "13px", color: "#9ca3af", marginTop: "4px" }}>
                  Manage, edit, or delete items from your live Supabase inventory
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingId(null);
                  setFormData(initialForm);
                  setActiveTab("add-product");
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  backgroundColor: "#fbbf24",
                  color: "#000000",
                  border: "none",
                  padding: "10px 18px",
                  borderRadius: "6px",
                  fontWeight: 700,
                  fontSize: "13px",
                  cursor: "pointer"
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                  add
                </span>
                <span>Add New Creation</span>
              </button>
            </div>

            <div
              style={{
                backgroundColor: "#111827",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "10px",
                padding: "16px",
                marginBottom: "20px",
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
                alignItems: "center"
              }}
            >
              <div style={{ position: "relative", flex: "1 1 280px" }}>
                <span
                  className="material-symbols-outlined"
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#6b7280",
                    fontSize: "18px"
                  }}
                >
                  search
                </span>
                <input
                  type="text"
                  placeholder="Filter by title, department, color..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  style={{
                    width: "100%",
                    backgroundColor: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "6px",
                    padding: "8px 12px 8px 38px",
                    color: "#ffffff",
                    fontSize: "13px",
                    outline: "none"
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "8px", overflowX: "auto" }}>
                {["All", "Outerwear", "Tech", "Living", "Accessories", "Essentials"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      border: "1px solid",
                      borderColor: categoryFilter === cat ? "#fbbf24" : "rgba(255,255,255,0.1)",
                      backgroundColor: categoryFilter === cat ? "rgba(251, 191, 36, 0.15)" : "transparent",
                      color: categoryFilter === cat ? "#fbbf24" : "#9ca3af",
                      cursor: "pointer",
                      whiteSpace: "nowrap"
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div
              style={{
                backgroundColor: "#111827",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "10px",
                overflow: "hidden"
              }}
            >
              {loadingProducts ? (
                <div style={{ padding: "40px", textAlign: "center", color: "#9ca3af" }}>
                  Loading catalog products...
                </div>
              ) : filteredProducts.length === 0 ? (
                <div style={{ padding: "40px", textAlign: "center" }}>
                  <p style={{ color: "#9ca3af", marginBottom: "16px" }}>
                    No products found matching your search.
                  </p>
                  <button
                    onClick={() => {
                      setProductSearch("");
                      setCategoryFilter("All");
                    }}
                    style={{
                      backgroundColor: "rgba(255,255,255,0.08)",
                      border: "none",
                      color: "#fff",
                      padding: "8px 16px",
                      borderRadius: "6px",
                      cursor: "pointer"
                    }}
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                    <thead>
                      <tr
                        style={{
                          borderBottom: "1px solid rgba(255,255,255,0.08)",
                          backgroundColor: "rgba(255,255,255,0.02)",
                          fontSize: "12px",
                          textTransform: "uppercase",
                          color: "#9ca3af",
                          letterSpacing: "0.05em"
                        }}
                      >
                        <th style={{ padding: "14px 16px" }}>Product</th>
                        <th style={{ padding: "14px 16px" }}>Department</th>
                        <th style={{ padding: "14px 16px" }}>Price</th>
                        <th style={{ padding: "14px 16px" }}>Rating</th>
                        <th style={{ padding: "14px 16px" }}>Colorways</th>
                        <th style={{ padding: "14px 16px" }}>Badges</th>
                        <th style={{ padding: "14px 16px", textAlign: "right" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((prod) => (
                        <tr
                          key={prod.id}
                          style={{
                            borderBottom: "1px solid rgba(255,255,255,0.05)",
                            fontSize: "13px"
                          }}
                        >
                          <td style={{ padding: "12px 16px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                              <img
                                src={prod.imageurl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"}
                                alt={prod.des || "Product"}
                                style={{
                                  width: "44px",
                                  height: "44px",
                                  objectFit: "cover",
                                  borderRadius: "6px",
                                  backgroundColor: "#1f2937"
                                }}
                                onError={(e) => {
                                  e.target.src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600";
                                }}
                              />
                              <div>
                                <div style={{ fontWeight: 600, color: "#f3f4f6" }}>
                                  {prod.des || "Untitled Creation"}
                                </div>
                                <div style={{ fontSize: "11px", color: "#6b7280" }}>
                                  ID: {prod.id}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td style={{ padding: "12px 16px" }}>
                            <span
                              style={{
                                backgroundColor: "rgba(255,255,255,0.06)",
                                padding: "3px 8px",
                                borderRadius: "4px",
                                fontSize: "12px"
                              }}
                            >
                              {prod.type || "Outerwear"}
                            </span>
                          </td>

                          <td style={{ padding: "12px 16px", fontWeight: 700, color: "#fbbf24" }}>
                            ${typeof prod.price === "number" ? prod.price.toFixed(2) : prod.price}
                          </td>

                          <td style={{ padding: "12px 16px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                              <span
                                className="material-symbols-outlined"
                                style={{ fontSize: "15px", color: "#fbbf24" }}
                              >
                                star
                              </span>
                              <span>{prod.rating || "4.9"}</span>
                            </div>
                          </td>

                          <td style={{ padding: "12px 16px", color: "#9ca3af" }}>
                            {prod.colors || "Standard"}
                          </td>

                          <td style={{ padding: "12px 16px" }}>
                            <div style={{ display: "flex", gap: "6px" }}>
                              {prod.isnew && (
                                <span
                                  style={{
                                    backgroundColor: "rgba(16, 185, 129, 0.15)",
                                    color: "#10b981",
                                    border: "1px solid rgba(16, 185, 129, 0.3)",
                                    fontSize: "10px",
                                    padding: "2px 6px",
                                    borderRadius: "4px",
                                    fontWeight: 600
                                  }}
                                >
                                  NEW
                                </span>
                              )}
                              {prod.isEdition && (
                                <span
                                  style={{
                                    backgroundColor: "rgba(236, 72, 153, 0.15)",
                                    color: "#ec4899",
                                    border: "1px solid rgba(236, 72, 153, 0.3)",
                                    fontSize: "10px",
                                    padding: "2px 6px",
                                    borderRadius: "4px",
                                    fontWeight: 600
                                  }}
                                >
                                  LIMITED
                                </span>
                              )}
                            </div>
                          </td>

                          <td style={{ padding: "12px 16px", textAlign: "right" }}>
                            <div style={{ display: "inline-flex", gap: "8px" }}>
                              <button
                                onClick={() => handleEditClick(prod)}
                                title="Edit Product"
                                style={{
                                  backgroundColor: "rgba(255,255,255,0.06)",
                                  border: "1px solid rgba(255,255,255,0.1)",
                                  color: "#ffffff",
                                  padding: "6px 10px",
                                  borderRadius: "4px",
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center"
                                }}
                              >
                                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                                  edit
                                </span>
                              </button>

                              <button
                                onClick={() => handleDeleteClick(prod.id, prod.des)}
                                title="Delete Product"
                                style={{
                                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                                  border: "1px solid rgba(239, 68, 68, 0.3)",
                                  color: "#ef4444",
                                  padding: "6px 10px",
                                  borderRadius: "4px",
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center"
                                }}
                              >
                                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                                  delete
                                </span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "add-product" && (
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px"
              }}
            >
              <div>
                <h1 style={{ fontSize: "22px", fontWeight: 700, margin: 0 }}>
                  {editingId ? `Edit Product #${editingId}` : "Add New Creation to Store"}
                </h1>
                <p style={{ fontSize: "13px", color: "#9ca3af", marginTop: "4px" }}>
                  Fill in product parameters to publish directly to Supabase `Products`
                </p>
              </div>

              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setFormData(initialForm);
                    setActiveTab("products");
                  }}
                  style={{
                    backgroundColor: "rgba(255,255,255,0.08)",
                    border: "none",
                    color: "#ffffff",
                    padding: "8px 14px",
                    borderRadius: "6px",
                    fontSize: "13px",
                    cursor: "pointer"
                  }}
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <form
              onSubmit={handleProductSubmit}
              style={{
                backgroundColor: "#111827",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "12px",
                padding: "28px",
                display: "flex",
                flexDirection: "column",
                gap: "20px"
              }}
            >
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                  Product Title / Name (des) <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Architectural Cashmere Coat"
                  value={formData.des}
                  onChange={(e) => setFormData({ ...formData, des: e.target.value })}
                  style={{
                    width: "100%",
                    backgroundColor: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "6px",
                    padding: "10px 14px",
                    color: "#ffffff",
                    fontSize: "14px",
                    outline: "none"
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                    Price in USD ($) <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    required
                    placeholder="e.g. 350.00"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    style={{
                      width: "100%",
                      backgroundColor: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "6px",
                      padding: "10px 14px",
                      color: "#ffffff",
                      fontSize: "14px",
                      outline: "none"
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                    Department / Category (type) <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    style={{
                      width: "100%",
                      backgroundColor: "#1f2937",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "6px",
                      padding: "10px 14px",
                      color: "#ffffff",
                      fontSize: "14px",
                      outline: "none"
                    }}
                  >
                    <option value="Outerwear">Outerwear</option>
                    <option value="Tech">Tech &amp; Audio</option>
                    <option value="Living">Living &amp; Design</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Essentials">Essentials</option>
                    <option value="Tailoring">Tailoring</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                  Image URL (imageurl)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.imageurl}
                  onChange={(e) => setFormData({ ...formData, imageurl: e.target.value })}
                  style={{
                    width: "100%",
                    backgroundColor: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "6px",
                    padding: "10px 14px",
                    color: "#ffffff",
                    fontSize: "14px",
                    outline: "none"
                  }}
                />

                <div
                  style={{
                    marginTop: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    backgroundColor: "rgba(0,0,0,0.25)",
                    padding: "12px",
                    borderRadius: "8px"
                  }}
                >
                  <img
                    src={formData.imageurl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"}
                    alt="Preview"
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "cover",
                      borderRadius: "6px",
                      backgroundColor: "#1f2937"
                    }}
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600";
                    }}
                  />
                  <div style={{ fontSize: "12px", color: "#9ca3af" }}>
                    <strong>Live Preview:</strong> Enter an image URL from Unsplash or your CDN to preview the storefront appearance.
                  </div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                    Available Colors (colors)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Nero Black, Matte Silver"
                    value={formData.colors}
                    onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                    style={{
                      width: "100%",
                      backgroundColor: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "6px",
                      padding: "10px 14px",
                      color: "#ffffff",
                      fontSize: "14px",
                      outline: "none"
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                    Product Rating (rating)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    placeholder="e.g. 4.9"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    style={{
                      width: "100%",
                      backgroundColor: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "6px",
                      padding: "10px 14px",
                      color: "#ffffff",
                      fontSize: "14px",
                      outline: "none"
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "24px",
                  padding: "14px",
                  backgroundColor: "rgba(255,255,255,0.03)",
                  borderRadius: "8px"
                }}
              >
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "13px" }}>
                  <input
                    type="checkbox"
                    checked={formData.isnew}
                    onChange={(e) => setFormData({ ...formData, isnew: e.target.checked })}
                    style={{ width: "16px", height: "16px", accentColor: "#fbbf24" }}
                  />
                  <span>Mark as <strong>New Arrival</strong> (`isnew`)</span>
                </label>

                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "13px" }}>
                  <input
                    type="checkbox"
                    checked={formData.isEdition}
                    onChange={(e) => setFormData({ ...formData, isEdition: e.target.checked })}
                    style={{ width: "16px", height: "16px", accentColor: "#fbbf24" }}
                  />
                  <span>Mark as <strong>Limited Edition Run</strong> (`isEdition`)</span>
                </label>
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
                <button
                  type="submit"
                  disabled={submittingProduct}
                  style={{
                    flex: 1,
                    backgroundColor: "#fbbf24",
                    color: "#000000",
                    border: "none",
                    padding: "12px",
                    borderRadius: "6px",
                    fontWeight: 700,
                    fontSize: "14px",
                    cursor: submittingProduct ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px"
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                    {editingId ? "save" : "publish"}
                  </span>
                  <span>{submittingProduct ? "Saving to Supabase..." : editingId ? "Update Product" : "Publish Creation to Store"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setFormData(initialForm);
                    setEditingId(null);
                  }}
                  style={{
                    backgroundColor: "rgba(255,255,255,0.08)",
                    color: "#ffffff",
                    border: "none",
                    padding: "12px 20px",
                    borderRadius: "6px",
                    fontWeight: 500,
                    fontSize: "14px",
                    cursor: "pointer"
                  }}
                >
                  Reset Form
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === "users" && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px"
              }}
            >
              <div>
                <h1 style={{ fontSize: "22px", fontWeight: 700, margin: 0 }}>
                  User Accounts &amp; Administrator Roles
                </h1>
                <p style={{ fontSize: "13px", color: "#9ca3af", marginTop: "4px" }}>
                  View registered users and toggle the `isAdmin` boolean flag directly in Supabase
                </p>
              </div>

              <button
                onClick={loadUsers}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  backgroundColor: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#ffffff",
                  padding: "8px 14px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  cursor: "pointer"
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                  refresh
                </span>
                <span>Refresh Users</span>
              </button>
            </div>

            <div
              style={{
                backgroundColor: "#111827",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "10px",
                overflow: "hidden"
              }}
            >
              {loadingUsers ? (
                <div style={{ padding: "40px", textAlign: "center", color: "#9ca3af" }}>
                  Loading registered users from Supabase...
                </div>
              ) : users.length === 0 ? (
                <div style={{ padding: "40px", textAlign: "center", color: "#9ca3af" }}>
                  No users found in database.
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                    <thead>
                      <tr
                        style={{
                          borderBottom: "1px solid rgba(255,255,255,0.08)",
                          backgroundColor: "rgba(255,255,255,0.02)",
                          fontSize: "12px",
                          textTransform: "uppercase",
                          color: "#9ca3af",
                          letterSpacing: "0.05em"
                        }}
                      >
                        <th style={{ padding: "14px 16px" }}>User</th>
                        <th style={{ padding: "14px 16px" }}>Email</th>
                        <th style={{ padding: "14px 16px" }}>Terms Check</th>
                        <th style={{ padding: "14px 16px" }}>Role Status</th>
                        <th style={{ padding: "14px 16px", textAlign: "right" }}>Toggle Admin Access</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => {
                        const isAdminUser = Boolean(u.isAdmin);
                        return (
                          <tr
                            key={u.id || u.emailaddress}
                            style={{
                              borderBottom: "1px solid rgba(255,255,255,0.05)",
                              fontSize: "13px"
                            }}
                          >
                            <td style={{ padding: "12px 16px", fontWeight: 600 }}>
                              {u.username || "Registered Member"}
                            </td>
                            <td style={{ padding: "12px 16px", color: "#9ca3af" }}>
                              {u.emailaddress}
                            </td>
                            <td style={{ padding: "12px 16px" }}>
                              {u.Check ? (
                                <span style={{ color: "#10b981", fontSize: "12px" }}>Verified</span>
                              ) : (
                                <span style={{ color: "#6b7280", fontSize: "12px" }}>Standard</span>
                              )}
                            </td>
                            <td style={{ padding: "12px 16px" }}>
                              {isAdminUser ? (
                                <span
                                  style={{
                                    backgroundColor: "rgba(251, 191, 36, 0.2)",
                                    color: "#fbbf24",
                                    border: "1px solid rgba(251, 191, 36, 0.4)",
                                    fontSize: "11px",
                                    padding: "2px 8px",
                                    borderRadius: "4px",
                                    fontWeight: 700
                                  }}
                                >
                                  ADMINISTRATOR
                                </span>
                              ) : (
                                <span
                                  style={{
                                    backgroundColor: "rgba(255,255,255,0.06)",
                                    color: "#9ca3af",
                                    fontSize: "11px",
                                    padding: "2px 8px",
                                    borderRadius: "4px"
                                  }}
                                >
                                  Customer
                                </span>
                              )}
                            </td>
                            <td style={{ padding: "12px 16px", textAlign: "right" }}>
                              <button
                                onClick={() => handleToggleAdmin(u.emailaddress, isAdminUser)}
                                style={{
                                  backgroundColor: isAdminUser ? "rgba(239, 68, 68, 0.15)" : "rgba(16, 185, 129, 0.15)",
                                  border: `1px solid ${isAdminUser ? "rgba(239, 68, 68, 0.4)" : "rgba(16, 185, 129, 0.4)"}`,
                                  color: isAdminUser ? "#ef4444" : "#10b981",
                                  padding: "6px 12px",
                                  borderRadius: "6px",
                                  fontSize: "12px",
                                  fontWeight: 600,
                                  cursor: "pointer"
                                }}
                              >
                                {isAdminUser ? "Revoke Admin Role" : "Grant Admin Access"}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
