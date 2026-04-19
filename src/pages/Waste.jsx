import React, { useState, useEffect, useRef } from "react";
import { getDustbinLogs, getMyProfile } from "../database/supabaseService";

const TODAY = new Date();

const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const fmtShort = (d) =>
  new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });

const kg = (g) => (g / 1000).toFixed(2) + " kg";

/* ---------------- STYLES ---------------- */

const S = {
  root: {
    fontFamily: "Inter, sans-serif",
    background: "#F5F5F4",
    minHeight: "100vh",
    paddingBottom: "2rem",
  },

  header: {
    background: "#5D4037",
    padding: "1rem 1.5rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  backButton: {
    border: "none",
    background: "rgba(255,255,255,0.15)",
    color: "#fff",
    padding: "8px 12px",
    borderRadius: 8,
    cursor: "pointer",
  },

  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    background: "rgba(255,255,255,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  card: {
    background: "#fff",
    borderRadius: 12,
    padding: "1rem",
    border: "1px solid rgba(0,0,0,0.06)",
  },

  label: {
    fontSize: 11,
    color: "#6B7280",
    marginBottom: 6,
    textTransform: "uppercase",
  },

  metric: {
    fontSize: 26,
    fontWeight: 700,
  },

  tblHead: {
    display: "grid",
    gridTemplateColumns: "120px 120px 1fr 90px",
    padding: "10px 16px",
    fontSize: 11,
    fontWeight: 600,
    color: "#6B7280",
    background: "#FAFAFA",
    borderBottom: "1px solid rgba(0,0,0,0.05)",
  },

  row: {
    display: "grid",
    gridTemplateColumns: "120px 120px 1fr 90px",
    padding: "10px 16px",
    borderBottom: "1px solid rgba(0,0,0,0.05)",
    fontSize: 13,
    alignItems: "center",
  },
};

/* ---------------- COMPONENT ---------------- */

const WasteMonitor = () => {
  const [history, setHistory] = useState([]);
  const [liveGrams, setLiveGrams] = useState(0);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    const profile = await getMyProfile();

    if (!profile?.canteen_id) return;

    const logs = await getDustbinLogs(profile.canteen_id);

    const formatted = logs.map((item) => ({
      ...item,
      grams: Number(item.weight_kg) * 1000,
      date: new Date(item.created_at),
    }));

    setHistory(formatted);

    if (formatted.length > 0) {
      setLiveGrams(formatted[0].grams);
    }
  };

  const todayGrams = history[0]?.grams || 0;

  const weekTotal = history
    .slice(0, 7)
    .reduce((sum, item) => sum + item.grams, 0);

  const monthTotal = history.reduce((sum, item) => sum + item.grams, 0);

  return (
    <div style={S.root}>
      {/* HEADER */}
      <div style={S.header}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button
            style={S.backButton}
            onClick={() => window.history.back()}
          >
            ← Back
          </button>

          <div style={S.iconBox}>🗑️</div>

          <div>
            <div style={{ color: "#fff", fontWeight: 700 }}>
              Food Waste Monitor
            </div>

            <div
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.7)",
              }}
            >
              IoT Dustbin Sensor · {fmtDate(TODAY)}
            </div>
          </div>
        </div>

        <div style={{ textAlign: "right", color: "#fff" }}>
          <div style={{ fontSize: 11 }}>Today's Waste</div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>
            {kg(todayGrams)}
          </div>
          <div style={{ fontSize: 11 }}>{liveGrams}g live reading</div>
        </div>
      </div>

      {/* KPI CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 12,
          padding: "1rem 1.5rem",
        }}
      >
        <div style={S.card}>
          <div style={S.label}>Today</div>
          <div style={S.metric}>{kg(todayGrams)}</div>
        </div>

        <div style={S.card}>
          <div style={S.label}>This Week</div>
          <div style={S.metric}>{kg(weekTotal)}</div>
        </div>

        <div style={S.card}>
          <div style={S.label}>Total Logs</div>
          <div style={S.metric}>{kg(monthTotal)}</div>
        </div>
      </div>

      {/* TABLE */}
      <div
        style={{
          ...S.card,
          margin: "0 1.5rem",
          padding: 0,
          overflow: "hidden",
        }}
      >
        <div style={{ padding: "1rem", fontWeight: 700 }}>
          Dustbin Logs History
        </div>

        <div style={S.tblHead}>
          <span>Date</span>
          <span>Dustbin</span>
          <span>ID</span>
          <span>Weight</span>
        </div>

        <div style={{ maxHeight: 450, overflowY: "auto" }}>
          {history.map((row, i) => (
            <div key={row.id || i} style={S.row}>
              <span>{fmtShort(row.date)}</span>
              <span>{row.dustbin_id}</span>
              <span>{row.id}</span>
              <span>{row.weight_kg} kg</span>
            </div>
          ))}

          {history.length === 0 && (
            <div style={{ padding: 20, color: "#6B7280" }}>
              No dustbin logs found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WasteMonitor;