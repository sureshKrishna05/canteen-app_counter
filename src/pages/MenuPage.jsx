import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getMenuItems,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleMenuItemAvailability,
} from "../database/supabaseService";

const CATEGORIES = ["Breakfast", "Lunch", "Snacks", "Drinks"];

const EMPTY_FORM = {
  name: "",
  price: "",
  category: "Snacks",
  description: "",
  image_url: "",
  prep_time_mins: 10,
  is_available: true,
};

const MenuPage = () => {
  const { profile } = useAuth();
  const canteenId = profile?.canteen_id;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(!!canteenId);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [filterCat, setFilterCat] = useState("All");

  const loadItems = useCallback(async () => {
    if (!canteenId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await getMenuItems(canteenId);
      setItems(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [canteenId]);

  useEffect(() => { loadItems(); }, [loadItems]);

  const openAdd = () => {
    setEditItem(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({
      name: item.name,
      price: item.price,
      category: item.category || "Snacks",
      description: item.description || "",
      image_url: item.image_url || "",
      prep_time_mins: item.prep_time_mins || 10,
      is_available: item.is_available,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.price) {
      setError("Name and price are required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = {
        name: form.name.trim(),
        price: parseFloat(form.price),
        category: form.category,
        description: form.description,
        image_url: form.image_url.trim() || null,
        prep_time_mins: parseInt(form.prep_time_mins),
        is_available: form.is_available,
      };

      if (editItem) {
        const updated = await updateMenuItem(editItem.id, payload);
        setItems(prev => prev.map(i => i.id === updated.id ? updated : i));
      } else {
        const created = await addMenuItem({ canteen_id: canteenId, ...payload });
        setItems(prev => [...prev, created]);
      }
      setShowForm(false);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this menu item?")) return;
    try {
      await deleteMenuItem(id);
      setItems(prev => prev.filter(i => i.id !== id));
    } catch (e) {
      alert("Failed to delete: " + e.message);
    }
  };

  const handleToggle = async (item) => {
    try {
      const updated = await toggleMenuItemAvailability(item.id, !item.is_available);
      setItems(prev => prev.map(i => i.id === updated.id ? updated : i));
    } catch (e) {
      alert("Failed: " + e.message);
    }
  };

  const displayed = filterCat === "All"
    ? items
    : items.filter(i => i.category === filterCat);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#F7F8FA",
      fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
    }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.75); }
        }
        .menu-card {
          transition: box-shadow 0.18s, border-color 0.18s, transform 0.18s;
        }
        .menu-card:hover {
          box-shadow: 0 6px 28px rgba(0,0,0,0.09) !important;
          transform: translateY(-2px) !important;
        }
        .back-btn:hover { background: rgba(255,255,255,0.18) !important; }
        .add-btn:hover  { background: #ea580c !important; }
        .cat-pill:hover { background: #fff7ed !important; color: #ea580c !important; }
      `}</style>

      {/* ── Improved Header ─────────────────────────────────────────── */}
      <div style={{
        background: "linear-gradient(135deg, #1c0a00 0%, #7c2d12 55%, #c2410c 100%)",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: -50, right: -50,
          width: 220, height: 220, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(251,146,60,0.15) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: -40, left: "35%",
          width: 160, height: 160, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(254,215,170,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", top: "50%", left: -30,
          transform: "translateY(-50%)",
          width: 100, height: 100, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          pointerEvents: "none",
        }} />

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "1rem 2rem", position: "relative" }}>
          <div style={{ marginBottom: "1rem" }}>
            <button
              className="back-btn"
              onClick={() => window.history.back()}
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.14)",
                borderRadius: 8,
                color: "rgba(255,255,255,0.85)",
                fontSize: 13, fontWeight: 500,
                padding: "6px 14px",
                cursor: "pointer",
                display: "flex", alignItems: "center", gap: 6,
                backdropFilter: "blur(6px)",
                transition: "background 0.15s",
                fontFamily: "inherit",
              }}
            >
              ← Back
            </button>
          </div>

          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            paddingBottom: "1.5rem",
            animation: "fadeSlideUp 0.35s ease both",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{
                width: 56, height: 56,
                background: "linear-gradient(135deg, rgba(251,146,60,0.25), rgba(253,186,116,0.15))",
                border: "1px solid rgba(251,146,60,0.4)",
                borderRadius: 16,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 28,
                backdropFilter: "blur(8px)",
                boxShadow: "0 4px 20px rgba(251,146,60,0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
                flexShrink: 0,
              }}>
                🍽️
              </div>
              <div>
                <h1 style={{
                  fontSize: 22, fontWeight: 800,
                  color: "#ffffff", margin: 0,
                  letterSpacing: "-0.6px",
                  fontFamily: "'Sora', 'Inter', system-ui, sans-serif",
                  textShadow: "0 2px 8px rgba(0,0,0,0.3)",
                }}>
                  Menu Management
                </h1>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", margin: "4px 0 0", fontWeight: 400 }}>
                  Manage your canteen items &amp; availability
                </p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {items.length > 0 && (
                <div style={{
                  display: "flex", alignItems: "center", gap: 7,
                  background: "rgba(251,146,60,0.12)",
                  border: "1px solid rgba(251,146,60,0.3)",
                  borderRadius: 99,
                  padding: "6px 14px",
                  backdropFilter: "blur(6px)",
                }}>
                  <span style={{
                    width: 7, height: 7, borderRadius: "50%",
                    background: "#fb923c",
                    boxShadow: "0 0 8px rgba(251,146,60,0.8)",
                    display: "inline-block",
                    animation: "pulse-dot 2s ease-in-out infinite",
                  }} />
                  <span style={{
                    fontSize: 12, fontWeight: 700,
                    color: "#fb923c",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}>
                    {items.length} Items
                  </span>
                </div>
              )}
              <button
                className="add-btn"
                onClick={openAdd}
                disabled={!canteenId}
                style={{
                  background: "#f97316",
                  border: "none",
                  borderRadius: 10,
                  color: "#ffffff",
                  fontSize: 14, fontWeight: 700,
                  padding: "9px 20px",
                  cursor: canteenId ? "pointer" : "not-allowed",
                  opacity: canteenId ? 1 : 0.5,
                  transition: "background 0.15s",
                  fontFamily: "inherit",
                  boxShadow: "0 2px 12px rgba(249,115,22,0.4)",
                  letterSpacing: "0.01em",
                }}
              >
                + Add Item
              </button>
            </div>
          </div>
        </div>
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          height: 1,
          background: "linear-gradient(90deg, transparent, rgba(251,146,60,0.4), transparent)",
        }} />
      </div>

      {/* ── Page Body ───────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 2rem" }}>
        {!canteenId && (
          <div style={{
            background: "#FFFBEB", border: "1px solid #FDE68A",
            borderRadius: 10, padding: "14px 18px",
            fontSize: 14, color: "#92400E",
            marginBottom: "1.5rem",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <span>⚠️</span> No canteen assigned to your account.
          </div>
        )}

        <div style={{
          display: "flex", flexWrap: "wrap", gap: 8,
          marginBottom: "1.5rem",
          animation: "fadeSlideUp 0.35s ease 0.05s both",
        }}>
          {["All", ...CATEGORIES].map(cat => (
            <button
              key={cat}
              className={filterCat !== cat ? "cat-pill" : ""}
              onClick={() => setFilterCat(cat)}
              style={{
                padding: "6px 16px",
                borderRadius: 99,
                fontSize: 13, fontWeight: 600,
                border: filterCat === cat ? "none" : "1px solid #E5E7EB",
                background: filterCat === cat
                  ? "linear-gradient(135deg, #f97316, #ea580c)"
                  : "#ffffff",
                color: filterCat === cat ? "#ffffff" : "#6B7280",
                cursor: "pointer",
                transition: "all 0.15s",
                boxShadow: filterCat === cat ? "0 2px 10px rgba(249,115,22,0.35)" : "none",
                fontFamily: "inherit",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 200 }}>
            <div style={{
              width: 36, height: 36,
              border: "3px solid #E5E7EB",
              borderTop: "3px solid #f97316",
              borderRadius: "50%",
              animation: "spin 0.7s linear infinite",
            }} />
          </div>
        ) : displayed.length === 0 ? (
          <div style={{
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            height: 200,
            background: "#ffffff", border: "1px solid #E5E7EB",
            borderRadius: 14, color: "#9CA3AF",
            animation: "fadeSlideUp 0.35s ease both",
          }}>
            <span style={{ fontSize: 40, marginBottom: 12 }}>🍽️</span>
            <p style={{ fontSize: 15, fontWeight: 500, color: "#6B7280", margin: 0 }}>
              No menu items yet
            </p>
            <button
              onClick={openAdd}
              style={{
                marginTop: 12, fontSize: 14, fontWeight: 600,
                color: "#f97316", background: "none", border: "none",
                cursor: "pointer", fontFamily: "inherit",
              }}
            >
              Add your first item →
            </button>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 16,
          }}>
            {displayed.map((item, idx) => (
              <div
                key={item.id}
                className="menu-card"
                style={{
                  background: "#ffffff",
                  borderRadius: 14,
                  border: "1px solid #E5E7EB",
                  borderLeft: `4px solid ${item.is_available ? "#4ade80" : "#D1D5DB"}`,
                  padding: "1.25rem",
                  opacity: item.is_available ? 1 : 0.7,
                  animation: `fadeSlideUp 0.4s ease ${idx * 0.04}s both`,
                }}
              >
                <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      style={{
                        width: 64, height: 64, borderRadius: 10,
                        objectFit: "cover", background: "#F3F4F6",
                        flexShrink: 0,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                      }}
                      onError={e => { e.target.src = "https://via.placeholder.com/150?text=No+Image"; }}
                    />
                  ) : (
                    <div style={{
                      width: 64, height: 64, borderRadius: 10,
                      background: "#FFF7ED",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 26, flexShrink: 0,
                    }}>
                      🍽️
                    </div>
                  )}

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: 0 }}>
                      {item.name}
                    </p>
                    <p style={{ fontSize: 11, color: "#f97316", fontWeight: 600, margin: "3px 0 0", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                      {item.category}
                    </p>
                    {item.description && (
                      <p style={{
                        fontSize: 12, color: "#9CA3AF", margin: "5px 0 0",
                        overflow: "hidden", display: "-webkit-box",
                        WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                      }}>
                        {item.description}
                      </p>
                    )}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
                      <span style={{ fontSize: 18, fontWeight: 800, color: "#111827", letterSpacing: "-0.3px" }}>
                        ₹{item.price}
                      </span>
                      {item.prep_time_mins && (
                        <span style={{ fontSize: 11, color: "#9CA3AF" }}>
                          ⏱ {item.prep_time_mins} min
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  marginTop: 14, paddingTop: 12,
                  borderTop: "1px solid #F3F4F6",
                }}>
                  <button
                    onClick={() => handleToggle(item)}
                    style={{
                      fontSize: 11, fontWeight: 600,
                      padding: "4px 12px", borderRadius: 99,
                      border: "none", cursor: "pointer",
                      background: item.is_available ? "#F0FDF4" : "#F3F4F6",
                      color: item.is_available ? "#15803D" : "#6B7280",
                      transition: "all 0.15s",
                      fontFamily: "inherit",
                    }}
                  >
                    {item.is_available ? "● Available" : "○ Unavailable"}
                  </button>

                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      onClick={() => openEdit(item)}
                      style={{
                        fontSize: 11, fontWeight: 600,
                        padding: "4px 12px", borderRadius: 8,
                        border: "none", cursor: "pointer",
                        background: "#EFF6FF", color: "#2563EB",
                        transition: "background 0.15s",
                        fontFamily: "inherit",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      style={{
                        fontSize: 11, fontWeight: 600,
                        padding: "4px 12px", borderRadius: 8,
                        border: "none", cursor: "pointer",
                        background: "#FEF2F2", color: "#DC2626",
                        transition: "background 0.15s",
                        fontFamily: "inherit",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Add / Edit Modal ─────────────────────────────────────────── */}
      {showForm && (
        <div
          onClick={() => setShowForm(false)}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 50, padding: "1rem",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: 20,
              width: "100%",
              maxWidth: 500,
              padding: "2rem",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h2 style={{ marginTop: 0 }}>{editItem ? "Edit Item" : "Add New Item"}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <input
                placeholder="Item Name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                style={{ padding: "0.75rem", borderRadius: 8, border: "1px solid #ddd" }}
              />
              <input
                type="number"
                placeholder="Price"
                value={form.price}
                onChange={e => setForm({ ...form, price: e.target.value })}
                style={{ padding: "0.75rem", borderRadius: 8, border: "1px solid #ddd" }}
              />
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                style={{ padding: "0.75rem", borderRadius: 8, border: "1px solid #ddd" }}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <textarea
                placeholder="Description"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                style={{ padding: "0.75rem", borderRadius: 8, border: "1px solid #ddd", minHeight: 80 }}
              />
              {error && <p style={{ color: "#DC2626", fontSize: 12 }}>{error}</p>}
              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  style={{
                    flex: 1, padding: "0.75rem", borderRadius: 8,
                    background: "#f97316", color: "#fff", border: "none", cursor: "pointer"
                  }}
                >
                  {saving ? "Saving..." : "Save Item"}
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  style={{
                    flex: 1, padding: "0.75rem", borderRadius: 8,
                    background: "#F3F4F6", color: "#374151", border: "none", cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuPage;