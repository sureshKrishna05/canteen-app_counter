import React, { useState, useEffect, useCallback } from "react";
import HeaderBar from "../components/HeaderBar";
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
  prep_time_mins: 10,
  is_available: true,
};

const MenuPage = () => {
  const { profile } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null); // null = add mode
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [filterCat, setFilterCat] = useState("All");

  const canteenId = profile?.canteen_id;

  const loadItems = useCallback(async () => {
    if (!canteenId) return;
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
      if (editItem) {
        const updated = await updateMenuItem(editItem.id, {
          name: form.name.trim(),
          price: parseFloat(form.price),
          category: form.category,
          description: form.description,
          prep_time_mins: parseInt(form.prep_time_mins),
          is_available: form.is_available,
        });
        setItems(prev => prev.map(i => i.id === updated.id ? updated : i));
      } else {
        const created = await addMenuItem({
          canteen_id: canteenId,
          name: form.name.trim(),
          price: parseFloat(form.price),
          category: form.category,
          description: form.description,
          prep_time_mins: parseInt(form.prep_time_mins),
          is_available: form.is_available,
        });
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
    <div className="p-6 min-h-screen">
      <HeaderBar title="Menu Management" icon="🍽️" actionType="Back" />

      {!canteenId && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg mb-4">
          ⚠️ No canteen assigned to your account.
        </div>
      )}

      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        {/* Category filter */}
        <div className="flex gap-2 flex-wrap">
          {["All", ...CATEGORIES].map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                filterCat === cat
                  ? "bg-orange-500 text-white"
                  : "bg-white/70 text-gray-700 hover:bg-orange-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        {/* Add button */}
        <button
          onClick={openAdd}
          disabled={!canteenId}
          className="px-5 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition disabled:opacity-50"
        >
          + Add Item
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-orange-500" />
        </div>
      ) : displayed.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-gray-500">
          <div className="text-5xl mb-3">🍽️</div>
          <p className="font-medium">No menu items yet</p>
          <button onClick={openAdd} className="mt-3 text-orange-500 font-semibold hover:underline">
            Add your first item →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayed.map(item => (
            <div
              key={item.id}
              className={`bg-white rounded-xl shadow p-4 border-l-4 transition ${
                item.is_available ? "border-green-400" : "border-gray-300 opacity-70"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 text-base">{item.name}</h3>
                  <p className="text-xs text-orange-500 font-medium mt-0.5">{item.category}</p>
                  {item.description && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                  )}
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-lg font-bold text-gray-900">₹{item.price}</span>
                    {item.prep_time_mins && (
                      <span className="text-xs text-gray-400">⏱ {item.prep_time_mins} min</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                {/* Toggle availability */}
                <button
                  onClick={() => handleToggle(item)}
                  className={`text-xs px-3 py-1 rounded-full font-medium transition ${
                    item.is_available
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {item.is_available ? "● Available" : "○ Unavailable"}
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(item)}
                    className="text-xs px-3 py-1 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-xs px-3 py-1 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowForm(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-xl">✕</button>

            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {editItem ? "Edit Menu Item" : "Add Menu Item"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Masala Dosa"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                    placeholder="0"
                    min="0"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prep Time (min)</label>
                  <input
                    type="number"
                    value={form.prep_time_mins}
                    onChange={e => setForm(f => ({ ...f, prep_time_mins: e.target.value }))}
                    min="1"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Optional short description"
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="available"
                  checked={form.is_available}
                  onChange={e => setForm(f => ({ ...f, is_available: e.target.checked }))}
                  className="w-4 h-4 accent-orange-500"
                />
                <label htmlFor="available" className="text-sm text-gray-700">Available now</label>
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 px-4 py-2 rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-600 transition disabled:opacity-50"
                >
                  {saving ? "Saving..." : editItem ? "Save Changes" : "Add Item"}
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