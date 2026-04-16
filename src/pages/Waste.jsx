import React, { useState, useEffect, useRef } from "react";

const TODAY = new Date();
const fmtDate = (d) => d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
const fmtShort = (d) => d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
const kg = (g) => (g / 1000).toFixed(2) + " kg";

const HISTORY = Array.from({ length: 28 }, (_, i) => {
  const d = new Date(TODAY);
  d.setDate(TODAY.getDate() - i);
  const seed = (i * 7919 + 3571) % 2400;
  const grams = 800 + seed;
  return { date: d, grams };
});

const TODAY_GRAMS = 1260;
const MONTH_GRAMS = HISTORY.reduce((s, r) => s + r.grams, 0);
const WEEK_GRAMS = HISTORY.slice(0, 7).reduce((s, r) => s + r.grams, 0);
const GVALS = HISTORY.map((r) => r.grams);

const WEEKS = [3, 2, 1, 0].map((w) => {
  const slice = HISTORY.slice(w * 7, w * 7 + 7);
  return {
    label: w === 0 ? "This week" : `${w + 1}w ago`,
    total: slice.reduce((s, r) => s + r.grams, 0),
    isActive: w === 0,
  };
});

// ── Inline styles ─────────────────────────────────────────────────
const S = {
  root: {
    fontFamily: "'Inter', system-ui, sans-serif",
    background: "#F5F5F4",
    minHeight: "100vh",
    paddingBottom: "2rem",
  },
  header: {
    background: "#5D4037", // Added Brown Color
    borderBottom: "0.5px solid rgba(0,0,0,0.08)",
    padding: "1rem 1.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    background: "rgba(255, 255, 255, 0.15)",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    padding: "8px 12px",
    fontSize: "14px",
    cursor: "pointer",
    marginRight: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    background: "rgba(255, 255, 255, 0.2)",
    border: "0.5px solid rgba(255,255,255,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
  },
  card: {
    background: "#fff",
    border: "0.5px solid rgba(0,0,0,0.08)",
    borderRadius: 12,
    padding: "1.1rem 1.25rem",
  },
  label: {
    fontSize: 11,
    fontWeight: 500,
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: 6,
  },
  metric: {
    fontSize: 26,
    fontWeight: 600,
    color: "#111827",
    lineHeight: 1.1,
  },
  sub: { fontSize: 12, color: "#9CA3AF", marginTop: 3 },
  sectionTitle: { fontSize: 13, fontWeight: 500, color: "#111827", marginBottom: 2 },
  sectionSub: { fontSize: 11, color: "#9CA3AF", marginBottom: 16 },
  filterBtn: (active) => ({
    background: active ? "#F3F4F6" : "transparent",
    border: `0.5px solid ${active ? "rgba(0,0,0,0.15)" : "rgba(0,0,0,0.08)"}`,
    borderRadius: 6,
    fontSize: 11,
    fontWeight: 500,
    fontFamily: "inherit",
    padding: "5px 11px",
    cursor: "pointer",
    color: active ? "#111827" : "#6B7280",
    transition: "all 0.12s",
  }),
  tblHead: {
    fontSize: 10,
    fontWeight: 500,
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    padding: "8px 16px",
    borderBottom: "0.5px solid rgba(0,0,0,0.06)",
    background: "#FAFAFA",
    display: "grid",
    gridTemplateColumns: "130px 1fr 100px 80px",
  },
  badge: (type) => {
    const cfg = {
      Low: { bg: "#D1FAE5", color: "#065F46" },
      Moderate: { bg: "#FEF3C7", color: "#92400E" },
      High: { bg: "#FEE2E2", color: "#991B1B" },
    }[type];
    return {
      display: "inline-flex",
      alignItems: "center",
      fontSize: 10,
      fontWeight: 500,
      padding: "2px 8px",
      borderRadius: 99,
      background: cfg.bg,
      color: cfg.color,
    };
  },
};

const TrendChart = ({ data }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);

    const pad = { top: 10, right: 12, bottom: 28, left: 42 };
    const w = W - pad.left - pad.right;
    const h = H - pad.top - pad.bottom;

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const xAt = (i) => pad.left + (i / (data.length - 1)) * w;
    const yAt = (v) => pad.top + h - ((v - min) / range) * h;

    ctx.strokeStyle = "rgba(0,0,0,0.05)";
    ctx.lineWidth = 0.5;
    ctx.setLineDash([3, 5]);
    const ticks = 4;
    for (let t = 0; t <= ticks; t++) {
      const y = pad.top + (t / ticks) * h;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(pad.left + w, y);
      ctx.stroke();
      const val = max - (t / ticks) * range;
      ctx.setLineDash([]);
      ctx.fillStyle = "#9CA3AF";
      ctx.font = "10px Inter, system-ui, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText((val / 1000).toFixed(1) + "k", pad.left - 6, y + 3.5);
      ctx.setLineDash([3, 5]);
    }
    ctx.setLineDash([]);

    const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + h);
    grad.addColorStop(0, "rgba(224,90,43,0.12)");
    grad.addColorStop(1, "rgba(224,90,43,0)");
    ctx.beginPath();
    ctx.moveTo(xAt(0), yAt(data[0]));
    for (let i = 1; i < data.length; i++) {
      const cp1x = xAt(i - 1) + (xAt(i) - xAt(i - 1)) * 0.5;
      ctx.bezierCurveTo(cp1x, yAt(data[i - 1]), cp1x, yAt(data[i]), xAt(i), yAt(data[i]));
    }
    ctx.lineTo(xAt(data.length - 1), pad.top + h);
    ctx.lineTo(xAt(0), pad.top + h);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(xAt(0), yAt(data[0]));
    for (let i = 1; i < data.length; i++) {
      const cp1x = xAt(i - 1) + (xAt(i) - xAt(i - 1)) * 0.5;
      ctx.bezierCurveTo(cp1x, yAt(data[i - 1]), cp1x, yAt(data[i]), xAt(i), yAt(data[i]));
    }
    ctx.strokeStyle = "#e05a2b";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = "#9CA3AF";
    ctx.font = "10px Inter, system-ui, sans-serif";
    ctx.textAlign = "center";
    const history = [...HISTORY].reverse();
    [0, 6, 13, 20, 27].forEach((i) => {
      if (i < history.length) {
        ctx.fillText(fmtShort(history[i].date), xAt(i), H - 6);
      }
    });
  }, [data]);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />;
};

const WeekBarChart = ({ weeks }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);

    const pad = { top: 20, right: 12, bottom: 28, left: 46 };
    const w = W - pad.left - pad.right;
    const h = H - pad.top - pad.bottom;
    const maxVal = Math.max(...weeks.map((wk) => wk.total)) * 1.15;

    ctx.setLineDash([3, 5]);
    ctx.strokeStyle = "rgba(0,0,0,0.05)";
    ctx.lineWidth = 0.5;
    for (let t = 0; t <= 3; t++) {
      const y = pad.top + (t / 3) * h;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(pad.left + w, y);
      ctx.stroke();
      const val = maxVal - (t / 3) * maxVal;
      ctx.setLineDash([]);
      ctx.fillStyle = "#9CA3AF";
      ctx.font = "10px Inter, system-ui, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText((val / 1000).toFixed(1) + "k", pad.left - 6, y + 3.5);
      ctx.setLineDash([3, 5]);
    }
    ctx.setLineDash([]);

    const barW = Math.min(40, (w / weeks.length) * 0.5);
    const gap = w / weeks.length;

    weeks.forEach((wk, i) => {
      const barH = (wk.total / maxVal) * h;
      const x = pad.left + i * gap + gap / 2 - barW / 2;
      const y = pad.top + h - barH;

      ctx.beginPath();
      ctx.roundRect(x, y, barW, barH, [4, 4, 0, 0]);
      ctx.fillStyle = wk.isActive ? "#e05a2b" : "rgba(224,90,43,0.2)";
      ctx.fill();

      ctx.fillStyle = wk.isActive ? "#e05a2b" : "#9CA3AF";
      ctx.font = `${wk.isActive ? 500 : 400} 10px Inter, system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText((wk.total / 1000).toFixed(2) + "kg", x + barW / 2, y - 5);

      ctx.fillStyle = "#9CA3AF";
      ctx.font = "10px Inter, system-ui, sans-serif";
      ctx.fillText(wk.label, x + barW / 2, pad.top + h + 16);
    });
  }, [weeks]);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />;
};

const WasteMonitor = () => {
  const [liveGrams, setLiveGrams] = useState(TODAY_GRAMS);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const id = setInterval(() => {
      setLiveGrams((g) => Math.max(0, g + Math.floor(Math.random() * 30 - 5)));
    }, 4000);
    return () => clearInterval(id);
  }, []);

  const filtered = HISTORY.filter((rec) => {
    const daysAgo = Math.floor((TODAY - rec.date) / 86400000);
    if (filter === "all") return true;
    if (filter === "w1") return daysAgo < 7;
    if (filter === "w2") return daysAgo >= 7 && daysAgo < 14;
    if (filter === "w3") return daysAgo >= 14 && daysAgo < 21;
    if (filter === "w4") return daysAgo >= 21;
    return true;
  });

  const filteredTotal = filtered.reduce((s, r) => s + r.grams, 0);
  const trendData = [...HISTORY].reverse().map((r) => r.grams);

  const filters = [
    { key: "all", label: "All" },
    { key: "w1", label: "This week" },
    { key: "w2", label: "Week 2" },
    { key: "w3", label: "Week 3" },
    { key: "w4", label: "Week 4" },
  ];

  return (
    <div style={S.root}>
      {/* Header */}
      <div style={S.header}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <button style={S.backButton} onClick={() => window.history.back()}>
             ← Back
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={S.iconBox}>🗑️</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>Food Waste Monitor</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>IoT Dustbin Sensor · {fmtDate(TODAY)}</div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ ...S.label, color: "rgba(255,255,255,0.7)" }}>Today's waste</div>
            <div style={{ fontSize: 22, fontWeight: 600, color: "#fff" }}>
              {(TODAY_GRAMS / 1000).toFixed(2)} kg
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>{liveGrams}g live reading</div>
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "#D1FAE5", borderRadius: 99,
            padding: "4px 10px", fontSize: 11, fontWeight: 500, color: "#065F46",
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: "50%", background: "#10b981",
              animation: "pulse 1.6s infinite",
              display: "inline-block",
            }} />
            Live
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
      `}</style>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, padding: "1.2rem 1.5rem 0" }}>
        {[
          { label: "Today", value: kg(TODAY_GRAMS), sub: TODAY_GRAMS + "g from sensor" },
          { label: "This week", value: kg(WEEK_GRAMS), sub: WEEK_GRAMS + "g current week" },
          { label: "Last 28 days", value: kg(MONTH_GRAMS), sub: "full month total" },
        ].map((c, i) => (
          <div key={i} style={S.card}>
            <div style={S.label}>{c.label}</div>
            <div style={S.metric}>{c.value}</div>
            <div style={S.sub}>{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 10, padding: "10px 1.5rem 0" }}>
        <div style={S.card}>
          <div style={S.sectionTitle}>28-day trend</div>
          <div style={S.sectionSub}>Daily waste readings from sensor (g)</div>
          <div style={{ width: "100%", height: 130 }}>
            <TrendChart data={trendData} />
          </div>
          <div style={{ display: "flex", gap: 20, paddingTop: 12, borderTop: "0.5px solid rgba(0,0,0,0.06)", marginTop: 14 }}>
            {[
              { label: "Peak day", value: kg(Math.max(...GVALS)), color: "#e05a2b" },
              { label: "Lowest day", value: kg(Math.min(...GVALS)), color: "#059669" },
              { label: "Daily avg", value: kg(Math.round(GVALS.reduce((a, b) => a + b, 0) / GVALS.length)), color: "#111827" },
            ].map((s, i) => (
              <div key={i}>
                <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 2 }}>{s.label}</div>
                <div style={{ fontSize: 13, fontWeight: 500, color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={S.card}>
          <div style={S.sectionTitle}>Weekly totals</div>
          <div style={S.sectionSub}>Last 4 weeks (kg)</div>
          <div style={{ width: "100%", height: 130 }}>
            <WeekBarChart weeks={WEEKS} />
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ ...S.card, margin: "10px 1.5rem 0", padding: 0, overflow: "hidden" }}>
        <div style={{
          padding: "1rem 1.25rem", display: "flex", alignItems: "center",
          justifyContent: "space-between", borderBottom: "0.5px solid rgba(0,0,0,0.06)",
        }}>
          <div>
            <div style={S.sectionTitle}>Daily history</div>
            <div style={{ fontSize: 11, color: "#9CA3AF" }}>28 days · most recent first</div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {filters.map((f) => (
              <button key={f.key} onClick={() => setFilter(f.key)} style={S.filterBtn(filter === f.key)}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div style={S.tblHead}>
          <span>Date</span><span>Volume</span><span>Level</span><span>Raw (g)</span>
        </div>

        <div style={{ maxHeight: 340, overflowY: "auto" }}>
          {filtered.map((rec, i) => {
            const isToday = rec.date.toDateString() === TODAY.toDateString();
            const level = rec.grams < 1200 ? "Low" : rec.grams < 2000 ? "Moderate" : "High";
            return (
              <div key={i} style={{
                display: "grid",
                gridTemplateColumns: "130px 1fr 100px 80px",
                padding: "10px 16px",
                borderBottom: i < filtered.length - 1 ? "0.5px solid rgba(0,0,0,0.05)" : "none",
                alignItems: "center",
                fontSize: 12,
                background: isToday ? "#FFF7ED" : "transparent",
                transition: "background 0.1s",
              }}
                onMouseEnter={(e) => { if (!isToday) e.currentTarget.style.background = "#FAFAFA"; }}
                onMouseLeave={(e) => { if (!isToday) e.currentTarget.style.background = "transparent"; }}
              >
                <span style={{ fontWeight: isToday ? 500 : 400, color: "#111827" }}>
                  {isToday ? "Today" : fmtShort(rec.date)}
                </span>
                <span style={{ fontWeight: 500, color: "#111827" }}>
                  {(rec.grams / 1000).toFixed(2)} kg
                </span>
                <span><span style={S.badge(level)}>{level}</span></span>
                <span style={{ color: "#9CA3AF" }}>{rec.grams}g</span>
              </div>
            );
          })}
        </div>

        <div style={{
          padding: "9px 16px", borderTop: "0.5px solid rgba(0,0,0,0.06)",
          background: "#FAFAFA", display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span style={{ fontSize: 11, color: "#9CA3AF" }}>
            {filtered.length} of {HISTORY.length} records
          </span>
          <span style={{ fontSize: 12, color: "#6B7280" }}>
            Total: <strong style={{ color: "#111827" }}>{kg(filteredTotal)}</strong>
          </span>
        </div>
      </div>
    </div>
  );
};

export default WasteMonitor;