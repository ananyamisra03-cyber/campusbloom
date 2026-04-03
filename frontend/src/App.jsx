import { useState, useEffect, useCallback } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { AuthPage } from "./components/AuthPage";
import { AppShell } from "./components/AppShell";
import { Dashboard } from "./sections/Dashboard";
import { CalendarTab, Expenses, Marks } from "./sections/AcademicSections";
import { Studies } from "./sections/Studies";
import { Timer, Habits, ExamPlanner } from "./sections/ActivitySections";
import { Internships, Extracurriculars, Materials, Notes, TodoTab, Store } from "./sections/OtherSections";
import { TH, STORE_ITEMS, getThemeBg } from "./utils/themes";
import api from "./utils/api";

// Floating particles (memoised positions so no flicker on re-render)
const PD = Array.from({ length: 12 }, (_, i) => ({
  id: i, size: 8 + (i * 6) % 14,
  x: (i * 19 + 5) % 100, y: (i * 23 + 10) % 100,
  dur: 9 + (i * 2.5) % 9, delay: (i * 1.7) % 5,
  emoji: ["✨","⭐","🌸","💫","🌙","🍀","🦋","🌺","💎","🌈","🎓","🏆"][i % 12],
}));

function Particles() {
  return (
    <div style={{ position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden" }}>
      {PD.map(p => (
        <div key={p.id} style={{
          position:"absolute", left:`${p.x}%`, top:`${p.y}%`,
          fontSize:p.size, opacity:.12,
          animation:`floatP ${p.dur}s ease-in-out ${p.delay}s infinite alternate`,
        }}>{p.emoji}</div>
      ))}
    </div>
  );
}

function Toast({ t, toast }) {
  if (!toast) return null;
  return (
    <div style={{
      position:"fixed", top:"clamp(10px,2vw,20px)", right:"clamp(10px,2vw,20px)",
      zIndex:9999, background:t.card, border:`1px solid ${t.cardBorder}`,
      borderRadius:14, padding:"11px 18px", display:"flex", gap:9, alignItems:"center",
      boxShadow:t.shadow, animation:"slideDown 0.35s ease", color:t.text,
      fontWeight:700, backdropFilter:"blur(18px)",
      maxWidth:"calc(100vw - 24px)", fontSize:"clamp(12px,3vw,14px)",
      fontFamily:"Nunito,sans-serif",
    }}>
      <span style={{ fontSize:20 }}>{toast.emoji}</span>{toast.msg}
    </div>
  );
}

// ─── Inner app (has auth context) ────────────────────────────────────────────
function InnerApp() {
  const { user, userData, loading, logout, saveKey, savePref } = useAuth();

  const [dark,        setDark]        = useState(() => JSON.parse(localStorage.getItem("cb_dark") || "false"));
  const [tab,         setTab]         = useState("dashboard");
  const [toast,       setToast]       = useState(null);
  const [activeThemeId, setActiveThemeId] = useState(null);

  const t = dark ? TH.dark : TH.light;
  const activeThemeItem = STORE_ITEMS.find(s => s.id === activeThemeId);
  const bg = getThemeBg(activeThemeItem, dark) || t.bg;

  // Sync dark + theme from user prefs when loaded
  useEffect(() => {
    if (user) {
      setDark(user.dark || false);
      setActiveThemeId(user.activeThemeId || null);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem("cb_dark", JSON.stringify(dark));
  }, [dark]);

  const notify = useCallback((msg, emoji = "✨") => {
    setToast({ msg, emoji });
    setTimeout(() => setToast(null), 3200);
  }, []);

  const handleSetDark = useCallback((v) => {
    setDark(v);
    savePref({ dark: v });
  }, [savePref]);

  const addPoints = useCallback(async (n) => {
    const np = (user?.points || 0) + n;
    await savePref({ points: np });
    notify(`+${n} points earned! 🎉`);
  }, [user, savePref, notify]);

  const applyTheme = useCallback(async (themeId) => {
    setActiveThemeId(themeId);
    await savePref({ activeThemeId: themeId });
  }, [savePref]);

  // Loading spinner
  if (loading) {
    return (
      <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:TH.light.bg }}>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:52, animation:"pulse 1.5s infinite" }}>🎓</div>
          <div style={{ marginTop:16, width:40, height:40, border:"3px solid #e8d5ff", borderTop:"3px solid #a855f7", borderRadius:"50%", animation:"spin 0.8s linear infinite", margin:"16px auto 0" }} />
          <p style={{ color:"#7c6faa", fontWeight:700, marginTop:12, fontFamily:"Nunito,sans-serif" }}>Loading CampusBloom…</p>
        </div>
      </div>
    );
  }

  // Shared section props
  const sectionProps = {
    t, user, userData, saveKey, addPoints, notify,
    applyTheme, activeThemeId, savePref, dark,
  };

  return (
    <div style={{ minHeight:"100vh", background:bg, transition:"background 0.6s", position:"relative", fontFamily:"Nunito,sans-serif" }}>
      <Particles />
      <Toast t={t} toast={toast} />

      {!user ? (
        <AuthPage t={t} dark={dark} setDark={handleSetDark} />
      ) : (
        <AppShell
          t={t} dark={dark} setDark={handleSetDark}
          tab={tab} setTab={setTab}
          user={user} onLogout={logout}
        >
          {tab === "dashboard"        && <Dashboard        {...sectionProps} setTab={setTab} />}
          {tab === "expenses"         && <Expenses         {...sectionProps} />}
          {tab === "marks"            && <Marks            {...sectionProps} />}
          {tab === "calendar"         && <CalendarTab      {...sectionProps} />}
          {tab === "studies"          && <Studies          {...sectionProps} />}
          {tab === "timer"            && <Timer            {...sectionProps} />}
          {tab === "habits"           && <Habits           {...sectionProps} />}
          {tab === "exam_planner"     && <ExamPlanner      {...sectionProps} />}
          {tab === "internships"      && <Internships      {...sectionProps} />}
          {tab === "extracurriculars" && <Extracurriculars {...sectionProps} />}
          {tab === "materials"        && <Materials        {...sectionProps} />}
          {tab === "notes"            && <Notes            {...sectionProps} />}
          {tab === "todo"             && <TodoTab          {...sectionProps} />}
          {tab === "store"            && <Store            {...sectionProps} />}
        </AppShell>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <InnerApp />
    </AuthProvider>
  );
}
