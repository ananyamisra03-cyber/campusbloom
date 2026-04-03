import { useState, useEffect } from "react";
import { NAV } from "../utils/themes";

export function AppShell({ t, dark, setDark, tab, setTab, user, onLogout, children }) {
  const [open, setOpen]     = useState(false);
  const [mobile, setMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const h = () => {
      const m = window.innerWidth < 768;
      setMobile(m);
      if (!m) setOpen(true);
    };
    h();
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  const sideW = mobile ? 240 : open ? 218 : 62;

  return (
    <div style={{ display: "flex", minHeight: "100vh", position: "relative", zIndex: 1 }}>
      {/* Mobile overlay */}
      {mobile && open && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 300 }}
          onClick={() => setOpen(false)} />
      )}
      {/* Sidebar */}
      <aside style={{
        width: sideW, minHeight: "100vh",
        background: t.navBg, backdropFilter: "blur(20px)",
        borderRight: `1.5px solid ${t.cardBorder}`,
        transition: "all 0.28s", display: "flex", flexDirection: "column",
        padding: "16px 0", position: mobile ? "fixed" : "sticky",
        top: 0, left: mobile ? (open ? 0 : -260) : 0,
        height: "100vh", overflow: "hidden", zIndex: 301, flexShrink: 0,
      }}>
        {/* Logo row */}
        <div style={{ padding: "0 10px 14px", display: "flex", alignItems: "center", gap: 9, borderBottom: `1px solid ${t.cardBorder}` }}>
          <span style={{ fontSize: 26, flexShrink: 0 }}>🎓</span>
          {(open) && <span style={{ fontFamily: "Pacifico,cursive", fontSize: 14, background: t.btnGrad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", whiteSpace: "nowrap" }}>CampusBloom</span>}
        </div>
        {/* User chip */}
        {open && (
          <div style={{ padding: "10px 10px", borderBottom: `1px solid ${t.cardBorder}` }}>
            <div style={{ background: t.tag, borderRadius: 11, padding: "8px 10px" }}>
              <p style={{ color: t.text, fontWeight: 800, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>👋 {user?.name}</p>
              <p style={{ color: t.textSub, fontSize: 11, marginTop: 2 }}>⭐ {user?.points || 0} pts</p>
            </div>
          </div>
        )}
        {/* Nav */}
        <nav style={{ flex: 1, overflowY: "auto", padding: "8px 5px" }}>
          {NAV.map(item => (
            <button key={item.id} onClick={() => { setTab(item.id); if (mobile) setOpen(false); }}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10,
                padding: "10px 9px", borderRadius: 12,
                background: tab === item.id ? t.btnGrad : "transparent",
                color: tab === item.id ? "white" : t.textSub,
                fontWeight: 700, fontSize: 13, transition: "all 0.18s",
                marginBottom: 2, justifyContent: open ? "flex-start" : "center",
                fontFamily: "Nunito,sans-serif",
              }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
              {open && <span style={{ whiteSpace: "nowrap" }}>{item.label}</span>}
            </button>
          ))}
        </nav>
        {/* Bottom controls */}
        <div style={{ padding: "10px 5px", borderTop: `1px solid ${t.cardBorder}` }}>
          <button onClick={() => setDark(!dark)} style={{ width: "100%", padding: "9px", borderRadius: 11, background: t.tag, color: t.text, fontWeight: 700, fontSize: 18, display: "flex", alignItems: "center", gap: 8, justifyContent: open ? "flex-start" : "center", fontFamily: "Nunito,sans-serif" }}>
            {dark ? "☀️" : "🌙"}{open && <span style={{ fontSize: 12 }}>{dark ? "Light" : "Dark"}</span>}
          </button>
          <button onClick={onLogout} style={{ width: "100%", padding: "9px", borderRadius: 11, background: "transparent", color: "#ef4444aa", fontWeight: 700, fontSize: open ? 13 : 18, marginTop: 3, display: "flex", alignItems: "center", gap: 8, justifyContent: open ? "flex-start" : "center", fontFamily: "Nunito,sans-serif" }}>
            🚪{open && " Logout"}
          </button>
          {!mobile && (
            <button onClick={() => setOpen(o => !o)} style={{ width: "100%", padding: "9px", borderRadius: 11, background: "transparent", color: t.textSub, fontWeight: 700, fontSize: 17, marginTop: 3, display: "flex", alignItems: "center", gap: 8, justifyContent: open ? "flex-start" : "center", fontFamily: "Nunito,sans-serif" }}>
              {open ? "◀" : "▶"}
            </button>
          )}
        </div>
      </aside>
      {/* Main */}
      <main style={{ flex: 1, padding: "clamp(14px,3vw,26px)", overflow: "auto", maxHeight: "100vh", paddingBottom: mobile ? 80 : undefined, minWidth: 0 }}>
        {mobile && (
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <button onClick={() => setOpen(o => !o)} style={{ width: 40, height: 40, borderRadius: 12, background: t.card, border: `1.5px solid ${t.cardBorder}`, color: t.text, fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>☰</button>
            <span style={{ fontFamily: "Pacifico,cursive", fontSize: 17, background: t.btnGrad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>CampusBloom</span>
            <div style={{ marginLeft: "auto", color: t.textSub, fontWeight: 800, fontSize: 13 }}>⭐ {user?.points || 0}</div>
          </div>
        )}
        {children}
      </main>
      {/* Mobile bottom nav */}
      {mobile && (
        <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: t.navBg, backdropFilter: "blur(20px)", borderTop: `1.5px solid ${t.cardBorder}`, display: "flex", zIndex: 200, padding: "6px 0 calc(6px + env(safe-area-inset-bottom))" }}>
          {[{ id: "dashboard", icon: "🏠" }, { id: "calendar", icon: "📅" }, { id: "timer", icon: "⏱️" }, { id: "todo", icon: "✅" }, { id: "store", icon: "🛍️" }].map(item => (
            <button key={item.id} onClick={() => setTab(item.id)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "6px 0", background: "none", color: tab === item.id ? t.accent : t.textSub, fontWeight: 700, fontFamily: "Nunito,sans-serif" }}>
              <span style={{ fontSize: 21 }}>{item.icon}</span>
              <span style={{ fontSize: 9, fontWeight: 800 }}>{NAV.find(n => n.id === item.id)?.label}</span>
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}
