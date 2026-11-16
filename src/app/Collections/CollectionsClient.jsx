"use client";

import { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import CartDrawer, { addToCart } from "../../components/CartDrawer";
import { formatPrice } from "../../components/CurrencyMenu";

const DEFAULT_PRODUCTS = [
  {
    id: 1,
    title: "Architectural Cashmere Coat",
    category: "Outerwear",
    subCategory: "Outerwear",
    price: 850,
    rating: "4.9",
    reviews: 128,
    badge: "Limited Run",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBWfzgLoKx9dJMRk8nxWNFsz9gn4cNRcYfEVCEH1AlhPVqzx8qWlzN8sJNpIynhScjGmven1ay1UBY9RDP_Wg0r5jfZRVzeBYqvm0tJZVyvlU85JrXN0NjujSqTjNq01fJCVD8y2q8-Fr3kd_mOnUpYXaGlf_wU59RWZI_4y2PvWKfs1XafjSOTzql0qzC_CcNtObc78m1CBbWTQipsihsftgmR5EroLvW8OnWuiBk",
    alt: "Architectural cashmere long coat in carbon black",
    colors: "Nero Black",
    swatches: [{ color: "#000000", title: "Nero Black" }, { color: "#8E867E", title: "Warm Melange" }, { color: "#1C2331", title: "Midnight Navy" }]
  },
  {
    id: 2,
    title: "Aero Wireless Earbuds",
    category: "Tech",
    subCategory: "Tech & Audio",
    price: 280,
    rating: "4.8",
    reviews: 342,
    badge: "New",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBvNI4Ebw31UxKEv8ETJjlvjvgpTXbwz03EgiBi0V1qFToexQrcTybNeuMbqM6KNpdUiqruZOsErWS3OIJ_I82xg93t51EtMAqyTJthd1M4k0RE88H1_VO8Ni4G4paqs1vaj5dy1OXZsn1P5SSVqFiyiuv-y3oeL10uVYe4l0myzfUR7XOCCUw-vkyj2Me3wDVCHF9QJz38BLgviqRAdkV4c4CG1BOMZJy1f17zOrQ",
    alt: "Wireless titanium earbuds",
    colors: "Matte Silver",
    swatches: [{ color: "#C0C0C0", title: "Matte Silver" }, { color: "#111111", title: "Obsidian Black" }]
  },
  {
    id: 3,
    title: "Sculptural Ceramic Vase",
    category: "Living",
    subCategory: "Living & Design",
    price: 195,
    rating: "5.0",
    reviews: 64,
    badge: "",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDlMKXJmgI4Yn3Tugw3hk_5KzIibcwRgf2-WSzjx8JfMhsQRVnkj3kN6Ngl4tz4xIfG26oGvRbN1-3ys2oAwPx-lB4uOfnQRJIual6oasZfSbcODRew6kk1ikon04btkl53Vr3ou9hNogo4pq0kbaWe14Sgbosy8zQgxid7_cRiKKos5L-t10fPY482CVzyo5Q9lHGxxT5yonkzowXUknnxebbkCovhOCb4cvk6jmo",
    alt: "Sculptural ceramic vase",
    colors: "Bone",
    swatches: [{ color: "#E3DAC9", title: "Bone" }, { color: "#C87D55", title: "Terracotta Ash" }]
  },
  {
    id: 4,
    title: "Precision Matte Pen",
    category: "Essentials",
    subCategory: "Essentials",
    price: 120,
    rating: "4.7",
    reviews: 89,
    badge: "",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCxiL_QkPY2qL_h3zCtTX5VFlcGx8qxOUbqtFwNi_0IUVneQg4t5qtiVcvdsniOb_T7Gc0VXrMpH7hdEAhMCSEXZJY5rV9KBgoUFXQYF5LJ-Qp_lt9yuFmyHtzwfXZT49PvY3RUVBpG1-YMgExNWDT_c7oKwRB2rmvQwpJbqXf0gLScs3376EOjGxrSafpxH7WsezgnFkgf4gGGip8tfz_y1EVZLyicd5x5nslG-A0",
    alt: "Precision aluminum rollerball pen in matte black",
    colors: "Carbon Black",
    swatches: [{ color: "#000000", title: "Carbon Black" }, { color: "#C0C0C0", title: "Anodized Silver" }]
  },
  {
    id: 5,
    title: "Modular Leather Tote",
    category: "Accessories",
    subCategory: "Accessories",
    price: 620,
    rating: "4.9",
    reviews: 215,
    badge: "Bestseller",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBj-uEg0Ywfi7WmfAOEQ3V04N3NoGRzLGsBLrCK1hLVrhUgqT-ganG-dpbeCtcFHggjh4PzjCA3sEamRDZCdlqe4U46d5m6z7V0CUmLMhbAlCUVxPNdPRKGbNK0ZEU2KaN7M5tHmE5xwvz5wz4d00_fJBr7xXRGTSlC7J9zJi1p-EqvT26KnACQdCwQcSPA7X4RkEV1Ge9sXmmSpcku_cQlbuonaHAzGl0mhM5Owbo",
    alt: "Modular full-grain leather tote bag",
    colors: "Nero",
    swatches: [{ color: "#000000", title: "Nero" }, { color: "#C68B59", title: "Caramel" }, { color: "#2D5A27", title: "Forest" }]
  },
  {
    id: 6,
    title: "Minimalist Desk Lamp",
    category: "Living",
    subCategory: "Living",
    price: 340,
    rating: "4.8",
    reviews: 94,
    badge: "",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCvFGR4XmnFx6yb7Snpbxgv68KQTeq6zvg5HalC9DnDWw3B7KX7xvCXIgKn5oLb7w8as6oqbM6Au0ZDL3JnN-sQC-FaVxUsWgxDaHW3Oo438TcXbvuoNw-wG78FYV8grwMwzoCkmxKcQp1mUQII4VhpkS2GAjgIdXXdO3v71dmAmd-D0c5xctHT1LhrKMaEdAO1yfyCjt58j6WTAJObimHA6EQfVDkxmpMHfdicWr0",
    alt: "Cantilevered LED desk lamp",
    colors: "Gunmetal",
    swatches: [{ color: "#2C3539", title: "Gunmetal" }, { color: "#D1D5DB", title: "White Aluminum" }]
  },
  {
    id: 7,
    title: "Chronograph Nero Watch",
    category: "Accessories",
    subCategory: "Accessories",
    price: 590,
    rating: "4.9",
    reviews: 380,
    badge: "Iconic",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC65-pB_OfGvmSR1sa7fVOiwsCcSzLBxUeswHbX05-2SRT2JdXYQ9xOuT0BQL65EF0D8ANfJSSs3Ebw4SA7-mXVLo1hwiMy3v6qykSYYHQzZp732BZjp7bedDJU7ry8e9Bc4xM6ww18ofQkNZHvzXMBzwDmFsTm1xXZcdx5sRDZBuydw9Smj7fUkS0ecReg6SJRN-GpWe9mly0ta9c-Da7yQzzuk3fgGYELFumEgIQ",
    alt: "Minimalist chronograph luxury wristwatch",
    colors: "All-Black",
    swatches: [{ color: "#000000", title: "All-Black" }, { color: "#E5E7EB", title: "Steel / White" }]
  },
  {
    id: 8,
    title: "Merino Knit Crewneck",
    category: "Outerwear",
    subCategory: "Outerwear",
    price: 240,
    rating: "4.9",
    reviews: 176,
    badge: "",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDOAPDoLqaZg4Z9nv3VHmZa2i3ycYoAa1dJsi-03R1Hz55LcVYjNk23O-TVl0FbehddAftRyLXhh0or_YSt6Ntl8u4_ELjhHWgFYYQuRojy-XZp9cx5P8oEjx-UvMfEwMiaxaQRMKG1IowizJWPOeuYDpuvtTNk8wOZIn4nomQJYSCGwMUq0hpPbL97a0yfIPcwwlIb_BBJtfwGfimq49wS6Bmya2bcNEvwvzrh8Tc",
    alt: "Merino wool knit crewneck sweater",
    colors: "Charcoal",
    swatches: [{ color: "#36454F", title: "Charcoal" }, { color: "#D8C7B5", title: "Oatmeal" }, { color: "#8A9A86", title: "Sage" }]
  }
];

export default function CollectionsClient() {
  const [productsList, setProductsList] = useState(DEFAULT_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [priceBracket, setPriceBracket] = useState("all");
  const [customMinPrice, setCustomMinPrice] = useState("");
  const [customMaxPrice, setCustomMaxPrice] = useState("");
  const [appliedPriceRange, setAppliedPriceRange] = useState({ min: 0, max: Infinity });
  const [gridCols, setGridCols] = useState(4);
  const [currency, setCurrency] = useState("USD");
  const [sortBy, setSortBy] = useState("Featured Editorial");

  useEffect(() => {
    try {
      const savedCurr = localStorage.getItem("selected_currency");
      if (savedCurr) setCurrency(savedCurr);

      const params = new URLSearchParams(window.location.search);
      const q = params.get("search") || params.get("q");
      if (q) setSearchQuery(q);
      const c = params.get("category");
      if (c) setSelectedCategory(c);
    } catch (e) {}

    fetch("/api/getProduct")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((item, idx) => ({
            id: item.id || idx + 100,
            title: item.des || item.type || `Nova Creation ${idx + 1}`,
            description: item.des || "",
            category: item.type || "Outerwear",
            subCategory: item.type || "Archival Creation",
            price: typeof item.price === "number" ? item.price : parseFloat(item.price) || 120,
            rating: item.rating ? String(item.rating) : "4.9",
            reviews: 64 + idx * 18,
            badge: item.isnew ? "New" : item.isEdition ? "Limited Run" : "",
            image: item.imageurl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
            alt: item.des || item.type || "Nova Product",
            colors: item.colors || "Black",
            swatches: item.colors
              ? item.colors.split(",").map((c) => ({
                  color: c.trim().startsWith("#") ? c.trim() : c.trim().toLowerCase() === "red" ? "#dc2626" : c.trim().toLowerCase() === "blue" ? "#2563eb" : "#000000",
                  title: c.trim()
                }))
              : [{ color: "#000000", title: "Standard" }]
          }));

          const merged = [...mapped];
          DEFAULT_PRODUCTS.forEach((dp) => {
            if (!merged.some((m) => m.id === dp.id)) {
              merged.push(dp);
            }
          });
          setProductsList(merged);
        }
      })
      .catch(() => {});

    function handleCurrencyChange(e) {
      if (e.detail) setCurrency(e.detail);
    }

    function handleGlobalSearch(e) {
      if (typeof e.detail === "string") setSearchQuery(e.detail);
    }

    window.addEventListener("currency-change", handleCurrencyChange);
    window.addEventListener("nova-search", handleGlobalSearch);

    return () => {
      window.removeEventListener("currency-change", handleCurrencyChange);
      window.removeEventListener("nova-search", handleGlobalSearch);
    };
  }, []);

  function handleApplyCustomPrice(e) {
    if (e) e.preventDefault();
    const min = customMinPrice ? parseFloat(customMinPrice) || 0 : 0;
    const max = customMaxPrice ? parseFloat(customMaxPrice) || Infinity : Infinity;
    setAppliedPriceRange({ min, max });
    setPriceBracket("custom");
  }

  function handleSelectPriceBracket(bracket) {
    setPriceBracket(bracket);
    if (bracket === "all") {
      setAppliedPriceRange({ min: 0, max: Infinity });
    } else if (bracket === "under-200") {
      setAppliedPriceRange({ min: 0, max: 200 });
    } else if (bracket === "200-500") {
      setAppliedPriceRange({ min: 200, max: 500 });
    } else if (bracket === "500-1000") {
      setAppliedPriceRange({ min: 500, max: 1000 });
    } else if (bracket === "over-1000") {
      setAppliedPriceRange({ min: 1000, max: Infinity });
    }
  }

  const departmentList = ["All", "Outerwear", "Tech", "Living", "Accessories", "Essentials"];

  const filteredProducts = productsList.filter((p) => {
    const matchesCat =
      selectedCategory === "All" ||
      p.category.toLowerCase() === selectedCategory.toLowerCase() ||
      (selectedCategory === "New" && (p.badge === "New" || p.isnew)) ||
      (selectedCategory === "Bestseller" && p.badge === "Bestseller");

    const q = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.subCategory && p.subCategory.toLowerCase().includes(q)) ||
      (p.alt && p.alt.toLowerCase().includes(q));

    const matchesRating = parseFloat(p.rating || "0") >= minRating;
    const matchesPrice = p.price >= appliedPriceRange.min && p.price <= appliedPriceRange.max;

    return matchesCat && matchesQuery && matchesRating && matchesPrice;
  }).sort((a, b) => {
    if (sortBy === "Price: Low to High") return a.price - b.price;
    if (sortBy === "Price: High to Low") return b.price - a.price;
    if (sortBy === "Highest Rated") return parseFloat(b.rating) - parseFloat(a.rating);
    if (sortBy === "Newest Arrivals") return (b.badge === "New" ? 1 : 0) - (a.badge === "New" ? 1 : 0);
    return a.id - b.id;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#ffffff", color: "#1a1c1d", fontFamily: "Inter, sans-serif" }}>
      <Header onCategorySelect={(cat) => setSelectedCategory(cat)} activeCategory={selectedCategory} />

      <main style={{ maxWidth: "1600px", margin: "0 auto", padding: "16px 24px 60px", width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0 16px", borderBottom: "1px solid #e7e7e7", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ fontSize: "14px", color: "#565959" }}>
            <span>1-{filteredProducts.length} of {productsList.length} results</span>
            {searchQuery && (
              <span> for <strong style={{ color: "#c45500" }}>"{searchQuery}"</strong></span>
            )}
            {selectedCategory !== "All" && (
              <span> in <strong style={{ color: "#1a1c1d" }}>{selectedCategory}</strong></span>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <label htmlFor="sort-select" style={{ fontSize: "12px", color: "#565959" }}>Sort by:</label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: "5px 10px",
                  borderRadius: "6px",
                  border: "1px solid #d5d9d9",
                  backgroundColor: "#f0f2f2",
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "#0f1111",
                  cursor: "pointer",
                  outline: "none"
                }}
              >
                <option>Featured Editorial</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Highest Rated</option>
                <option>Newest Arrivals</option>
              </select>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <button
                type="button"
                onClick={() => setGridCols(3)}
                aria-label="3 Column Grid"
                style={{
                  background: gridCols === 3 ? "#e7e7e7" : "transparent",
                  border: "1px solid #d5d9d9",
                  borderRadius: "4px",
                  padding: "4px 8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>view_cozy</span>
              </button>
              <button
                type="button"
                onClick={() => setGridCols(4)}
                aria-label="4 Column Grid"
                style={{
                  background: gridCols === 4 ? "#e7e7e7" : "transparent",
                  border: "1px solid #d5d9d9",
                  borderRadius: "4px",
                  padding: "4px 8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>grid_view</span>
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: "28px" }}>
          <aside style={{ borderRight: "1px solid #e7e7e7", paddingRight: "20px" }}>
            <div style={{ marginBottom: "24px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#0f1111", marginBottom: "10px", letterSpacing: "0.02em" }}>
                Department
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
                {departmentList.map((dept) => (
                  <li key={dept}>
                    <button
                      type="button"
                      onClick={() => setSelectedCategory(dept)}
                      style={{
                        background: "none",
                        border: "none",
                        padding: 0,
                        fontSize: "13px",
                        color: selectedCategory.toLowerCase() === dept.toLowerCase() ? "#111111" : "#007185",
                        fontWeight: selectedCategory.toLowerCase() === dept.toLowerCase() ? 700 : 400,
                        cursor: "pointer",
                        textAlign: "left"
                      }}
                    >
                      {dept === "All" ? "All Departments" : dept}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ marginBottom: "24px", borderTop: "1px solid #e7e7e7", paddingTop: "16px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#0f1111", marginBottom: "10px" }}>
                Customer Reviews
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {[
                  { stars: 4, label: "4 Stars & Up" },
                  { stars: 3, label: "3 Stars & Up" },
                  { stars: 2, label: "2 Stars & Up" }
                ].map((r) => (
                  <button
                    key={r.stars}
                    type="button"
                    onClick={() => setMinRating(minRating === r.stars ? 0 : r.stars)}
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      cursor: "pointer",
                      fontSize: "13px",
                      color: minRating === r.stars ? "#000000" : "#007185",
                      fontWeight: minRating === r.stars ? 700 : 400
                    }}
                  >
                    <span style={{ color: "#de7921", fontSize: "15px", letterSpacing: "1px" }}>
                      {"★".repeat(r.stars)}{"☆".repeat(5 - r.stars)}
                    </span>
                    <span>{r.label}</span>
                  </button>
                ))}
                {minRating > 0 && (
                  <button
                    type="button"
                    onClick={() => setMinRating(0)}
                    style={{ background: "none", border: "none", color: "#565959", fontSize: "12px", cursor: "pointer", textAlign: "left", marginTop: "4px" }}
                  >
                    Clear review filter
                  </button>
                )}
              </div>
            </div>

            <div style={{ marginBottom: "24px", borderTop: "1px solid #e7e7e7", paddingTop: "16px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#0f1111", marginBottom: "10px" }}>
                Price
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "12px" }}>
                {[
                  { key: "all", label: "All Prices" },
                  { key: "under-200", label: "Under $200" },
                  { key: "200-500", label: "$200 to $500" },
                  { key: "500-1000", label: "$500 to $1,000" },
                  { key: "over-1000", label: "$1,000 & Above" }
                ].map((p) => (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => handleSelectPriceBracket(p.key)}
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      fontSize: "13px",
                      color: priceBracket === p.key ? "#111111" : "#007185",
                      fontWeight: priceBracket === p.key ? 700 : 400,
                      cursor: "pointer",
                      textAlign: "left"
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              <form onSubmit={handleApplyCustomPrice} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <input
                  type="number"
                  placeholder="$ Min"
                  value={customMinPrice}
                  onChange={(e) => setCustomMinPrice(e.target.value)}
                  style={{
                    width: "60px",
                    padding: "4px 6px",
                    border: "1px solid #888c8c",
                    borderRadius: "4px",
                    fontSize: "12px"
                  }}
                />
                <span style={{ color: "#565959" }}>–</span>
                <input
                  type="number"
                  placeholder="$ Max"
                  value={customMaxPrice}
                  onChange={(e) => setCustomMaxPrice(e.target.value)}
                  style={{
                    width: "60px",
                    padding: "4px 6px",
                    border: "1px solid #888c8c",
                    borderRadius: "4px",
                    fontSize: "12px"
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: "4px 10px",
                    backgroundColor: "#ffffff",
                    border: "1px solid #d5d9d9",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: 500,
                    cursor: "pointer",
                    boxShadow: "0 2px 5px rgba(213,217,217,.5)"
                  }}
                >
                  Go
                </button>
              </form>
            </div>

            <div style={{ borderTop: "1px solid #e7e7e7", paddingTop: "16px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#0f1111", marginBottom: "10px" }}>
                Condition &amp; Edition
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", cursor: "pointer", color: "#0f1111" }}>
                  <input
                    type="checkbox"
                    checked={selectedCategory === "New"}
                    onChange={(e) => setSelectedCategory(e.target.checked ? "New" : "All")}
                  />
                  New Releases
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", cursor: "pointer", color: "#0f1111" }}>
                  <input
                    type="checkbox"
                    checked={selectedCategory === "Bestseller"}
                    onChange={(e) => setSelectedCategory(e.target.checked ? "Bestseller" : "All")}
                  />
                  Bestsellers &amp; Iconic
                </label>
              </div>
            </div>

            {(selectedCategory !== "All" || searchQuery || minRating > 0 || priceBracket !== "all") && (
              <div style={{ marginTop: "24px", borderTop: "1px solid #e7e7e7", paddingTop: "16px" }}>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory("All");
                    setSearchQuery("");
                    setMinRating(0);
                    handleSelectPriceBracket("all");
                    setCustomMinPrice("");
                    setCustomMaxPrice("");
                  }}
                  style={{
                    padding: "6px 14px",
                    backgroundColor: "#000000",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    width: "100%"
                  }}
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </aside>

          <section>
            {filteredProducts.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 20px" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#888c8c" }}>search_off</span>
                <h3 style={{ fontSize: "18px", fontWeight: 700, marginTop: "16px", color: "#0f1111" }}>
                  No results found
                </h3>
                <p style={{ color: "#565959", fontSize: "14px", marginTop: "6px" }}>
                  Check your spelling or try clearing some filters to expand your search.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory("All");
                    setSearchQuery("");
                    setMinRating(0);
                    handleSelectPriceBracket("all");
                  }}
                  style={{
                    marginTop: "16px",
                    padding: "8px 20px",
                    backgroundColor: "#000000",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer"
                  }}
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
                  gap: "20px"
                }}
              >
                {filteredProducts.map((p) => (
                  <article
                    key={p.id}
                    style={{
                      border: "1px solid #e7e7e7",
                      borderRadius: "6px",
                      overflow: "hidden",
                      backgroundColor: "#ffffff",
                      display: "flex",
                      flexDirection: "column",
                      transition: "box-shadow 0.2s, transform 0.2s"
                    }}
                  >
                    <div style={{ position: "relative", width: "100%", paddingTop: "100%", backgroundColor: "#f7f7f7" }}>
                      <img
                        src={p.image}
                        alt={p.title}
                        style={{
                          position: "absolute",
                          inset: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover"
                        }}
                      />
                      {p.badge && (
                        <div
                          style={{
                            position: "absolute",
                            top: "8px",
                            left: "8px",
                            backgroundColor: "#000000",
                            color: "#ffffff",
                            fontSize: "10px",
                            fontWeight: 700,
                            letterSpacing: "0.06em",
                            padding: "2px 8px",
                            borderRadius: "2px",
                            textTransform: "uppercase"
                          }}
                        >
                          {p.badge}
                        </div>
                      )}
                    </div>

                    <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", flex: 1 }}>
                      <div style={{ fontSize: "11px", color: "#565959", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "4px" }}>
                        {p.subCategory || p.category}
                      </div>

                      <h2 style={{ fontSize: "15px", fontWeight: 600, color: "#0f1111", lineHeight: 1.35, marginBottom: "6px" }}>
                        {p.title}
                      </h2>

                      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                        <span style={{ color: "#de7921", fontSize: "14px", letterSpacing: "1px" }}>
                          {"★".repeat(Math.round(parseFloat(p.rating || "5")))}{"☆".repeat(5 - Math.round(parseFloat(p.rating || "5")))}
                        </span>
                        <span style={{ fontSize: "12px", color: "#007185", fontWeight: 500 }}>
                          {p.reviews}
                        </span>
                      </div>

                      <div style={{ marginTop: "auto", paddingTop: "8px" }}>
                        <div style={{ fontSize: "20px", fontWeight: 700, color: "#0f1111", marginBottom: "4px" }}>
                          {formatPrice(p.price, currency)}
                        </div>

                        <div style={{ fontSize: "12px", color: "#565959", marginBottom: "12px" }}>
                          <span style={{ color: "#067d62", fontWeight: 600 }}>FREE Delivery</span> by NOVA Express
                        </div>

                        {p.swatches && p.swatches.length > 1 && (
                          <div style={{ display: "flex", gap: "6px", marginBottom: "12px" }}>
                            {p.swatches.map((s, idx) => (
                              <span
                                key={idx}
                                title={s.title}
                                style={{
                                  width: "14px",
                                  height: "14px",
                                  borderRadius: "50%",
                                  backgroundColor: s.color,
                                  border: "1px solid #d5d9d9",
                                  display: "inline-block"
                                }}
                              />
                            ))}
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            addToCart({
                              id: p.id,
                              title: p.title,
                              price: p.price,
                              image: p.image,
                              colors: p.colors,
                              type: p.category
                            });
                          }}
                          style={{
                            width: "100%",
                            padding: "8px 0",
                            backgroundColor: "#000000",
                            color: "#ffffff",
                            border: "none",
                            borderRadius: "4px",
                            fontSize: "13px",
                            fontWeight: 600,
                            letterSpacing: "0.02em",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px",
                            transition: "background 0.2s"
                          }}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>shopping_bag</span>
                          Add to Bag
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
}
