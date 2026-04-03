import { useState } from "react";

export const Card = ({ t, children, style }) => (
  <div style={{
    background: t.card, border: `1.5px solid ${t.cardBorder}`,
    borderRadius: 16, padding: "clamp(14px,3vw,20px)",
    backdropFilter: "blur(16px)", boxShadow: t.shadow, ...style,
  }}>{children}</div>
);

export const FInput = ({ t, placeholder, value, onChange, type = "text", style }) => (
  <input
    type={type} placeholder={placeholder} value={value}
    onChange={e => onChange(e.target.value)}
    style={{
      width: "100%", padding: "10px 13px", borderRadius: 11,
      background: t.input, border: `1.5px solid ${t.inputBorder}`,
      color: t.text, fontWeight: 600, fontSize: 14, marginBottom: 10,
      fontFamily: "Nunito,sans-serif", ...style,
    }}
  />
);

export const Btn = ({ t, children, onClick, variant = "primary", small, disabled, style }) => (
  <button onClick={onClick} disabled={disabled} style={{
    width: small ? undefined : "100%",
    padding: small ? "7px 14px" : "12px",
    borderRadius: small ? 9 : 12,
    background: variant === "primary" ? t.btnGrad : t.tag,
    color: variant === "primary" ? "white" : t.textSub,
    fontWeight: 800, fontSize: small ? 12 : 14,
    boxShadow: variant === "primary" ? "0 3px 12px rgba(168,85,247,0.28)" : "none",
    opacity: disabled ? 0.6 : 1, fontFamily: "Nunito,sans-serif",
    cursor: disabled ? "not-allowed" : "pointer", ...style,
  }}>{children}</button>
);

export const PH = ({ t, emoji, title, sub }) => (
  <div style={{ marginBottom: "clamp(14px,3vw,22px)" }}>
    <h1 style={{
      display: "flex", alignItems: "center", gap: 10,
      fontSize: "clamp(20px,4vw,26px)", fontWeight: 900,
      color: t.text, flexWrap: "wrap",
    }}>
      <span style={{ fontSize: "clamp(24px,5vw,32px)" }}>{emoji}</span>
      <span style={{ background: `linear-gradient(135deg,${t.accent},${t.accent2})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{title}</span>
    </h1>
    {sub && <p style={{ color: t.textSub, fontWeight: 600, marginTop: 3, fontSize: "clamp(12px,2vw,14px)" }}>{sub}</p>}
  </div>
);

export const Badge = ({ color, children }) => (
  <span style={{ fontSize: 11, fontWeight: 800, padding: "2px 8px", borderRadius: 99, background: color + "22", color, whiteSpace: "nowrap" }}>{children}</span>
);

export const Spinner = ({ t }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
    <div style={{ width: 34, height: 34, border: `3px solid ${t.tag}`, borderTop: `3px solid ${t.accent}`, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
  </div>
);

export const SL = ({ t }) => (
  <div style={{ fontSize: 11, fontWeight: 700, color: t.textSub, marginBottom: 5, display: "block" }} />
);

// Labeled input group
export const LabelInput = ({ t, label, children }) => (
  <div style={{ marginBottom: 10 }}>
    <label style={{ fontSize: 11, fontWeight: 700, color: t.textSub, display: "block", marginBottom: 4 }}>{label}</label>
    {children}
  </div>
);

export const SelectInput = ({ t, value, onChange, children, style }) => (
  <select value={value} onChange={e => onChange(e.target.value)} style={{
    width: "100%", padding: "10px 13px", borderRadius: 11,
    background: t.input, border: `1.5px solid ${t.inputBorder}`,
    color: t.text, fontWeight: 700, fontSize: 13,
    fontFamily: "Nunito,sans-serif", ...style,
  }}>{children}</select>
);

export const TextArea = ({ t, value, onChange, placeholder, rows = 3, style }) => (
  <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
    style={{
      width: "100%", padding: "10px 13px", borderRadius: 11,
      background: t.input, border: `1.5px solid ${t.inputBorder}`,
      color: t.text, fontWeight: 600, fontSize: 13, resize: "vertical",
      lineHeight: 1.6, fontFamily: "Nunito,sans-serif", ...style,
    }}
  />
);

// Mini calendar date picker popup
export function DatePicker({ t, value, onChange, onClose }) {
  const init = value ? new Date(value + "T12:00:00") : new Date();
  const [c, setC] = useState({ y: init.getFullYear(), m: init.getMonth() });
  const MN = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const pad = n => String(n).padStart(2, "0");
  const fd = new Date(c.y, c.m, 1).getDay();
  const dim = new Date(c.y, c.m + 1, 0).getDate();
  const cells = Array(fd).fill(null).concat(Array.from({ length: dim }, (_, i) => i + 1));
  const td = new Date().toISOString().slice(0, 10);
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9200,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(0,0,0,0.5)", backdropFilter: "blur(5px)", padding: 16,
    }} onClick={onClose}>
      <div style={{
        background: t.card, border: `1.5px solid ${t.cardBorder}`,
        borderRadius: 18, padding: 18, boxShadow: "0 24px 60px rgba(0,0,0,0.3)",
        backdropFilter: "blur(20px)", width: "min(292px,94vw)", animation: "popIn 0.22s ease",
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <button onClick={() => setC(cc => cc.m === 0 ? { y: cc.y - 1, m: 11 } : { y: cc.y, m: cc.m - 1 })}
            style={{ width: 32, height: 32, borderRadius: 9, background: t.tag, color: t.text, fontWeight: 900, fontSize: 16 }}>‹</button>
          <span style={{ color: t.text, fontWeight: 800, fontSize: 14 }}>{MN[c.m]} {c.y}</span>
          <button onClick={() => setC(cc => cc.m === 11 ? { y: cc.y + 1, m: 0 } : { y: cc.y, m: cc.m + 1 })}
            style={{ width: 32, height: 32, borderRadius: 9, background: t.tag, color: t.text, fontWeight: 900, fontSize: 16 }}>›</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, marginBottom: 4 }}>
          {["S","M","T","W","T","F","S"].map((d, i) => (
            <div key={i} style={{ textAlign: "center", fontSize: 10, fontWeight: 800, color: t.textSub, padding: "2px 0" }}>{d}</div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2 }}>
          {cells.map((d, i) => {
            if (!d) return <div key={i} />;
            const ds = `${c.y}-${pad(c.m + 1)}-${pad(d)}`;
            const isSel = ds === value, isToday = ds === td;
            return (
              <button key={i} onClick={() => { onChange(ds); onClose(); }}
                style={{
                  padding: "6px 2px", borderRadius: 8, textAlign: "center",
                  background: isSel ? t.btnGrad : isToday ? t.tag : "transparent",
                  color: isSel ? "white" : isToday ? t.accent : t.text,
                  fontWeight: isSel || isToday ? 800 : 600, fontSize: 13,
                  border: isToday && !isSel ? `1.5px solid ${t.accent}` : "none",
                }}>{d}</button>
            );
          })}
        </div>
        <button onClick={() => { onChange(td); onClose(); }}
          style={{ width: "100%", marginTop: 10, padding: "9px", borderRadius: 11, background: t.btnGrad, color: "white", fontWeight: 800, fontSize: 12 }}>📅 Today</button>
        <button onClick={onClose}
          style={{ width: "100%", marginTop: 7, padding: "9px", borderRadius: 11, background: t.tag, color: t.textSub, fontWeight: 700, fontSize: 12 }}>Cancel</button>
      </div>
    </div>
  );
}

export const DateButton = ({ t, value, onClick, placeholder = "Pick a date…" }) => (
  <button onClick={onClick} style={{
    width: "100%", padding: "10px 13px", borderRadius: 11,
    background: t.input, border: `1.5px solid ${t.inputBorder}`,
    color: value ? t.text : t.textSub, fontWeight: 700, fontSize: 13,
    textAlign: "left", fontFamily: "Nunito,sans-serif",
  }}>{value || `📅 ${placeholder}`}</button>
);
