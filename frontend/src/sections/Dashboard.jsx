import { useState } from "react";
import { Card, Badge, PH } from "../components/ui";
import { QUOTES } from "../utils/themes";

export function Dashboard({ t, user, userData, setTab }) {
  const [hov, setHov] = useState(null);
  const doy = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const quote = QUOTES[doy % QUOTES.length];
  const tasks = userData?.tasks || [];
  const today = new Date().toISOString().slice(0, 10);
  const tmrw  = new Date(); tmrw.setDate(tmrw.getDate() + 1); const tmrwStr = tmrw.toISOString().slice(0, 10);
  const upcoming = tasks.filter(tk => !tk.done).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 5);
  const dcColor = d => d === today ? "#ef4444" : d === tmrwStr ? "#f59e0b" : Math.ceil((new Date(d) - new Date(today)) / 86400000) <= 3 ? "#f97316" : null;
  const dcLabel = d => d === today ? "⚡ Today!" : d === tmrwStr ? "⚠️ Tomorrow" : `📅 ${d}`;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const greetEmoji = hour < 12 ? "🌤️" : hour < 17 ? "☀️" : "🌙";

  const cards = [
    { id:"expenses",      emoji:"💰", label:"Expenses",      desc:"Budget & spending tracker",      grad:"linear-gradient(135deg,#f59e0b,#ef4444)" },
    { id:"marks",         emoji:"📊", label:"Marks",         desc:"Track performance by term",       grad:"linear-gradient(135deg,#6366f1,#8b5cf6)" },
    { id:"calendar",      emoji:"📅", label:"Calendar",      desc:`Tasks · ${upcoming.length} upcoming`, grad:"linear-gradient(135deg,#06b6d4,#3b82f6)" },
    { id:"studies",       emoji:"📚", label:"Studies",       desc:"Subjects → Modules → Topics",    grad:"linear-gradient(135deg,#10b981,#06b6d4)" },
    { id:"timer",         emoji:"⏱️",  label:"Timer",         desc:"Sessions & study points",         grad:"linear-gradient(135deg,#ec4899,#f43f5e)" },
    { id:"habits",        emoji:"🌱", label:"Habits",        desc:"Build daily habits",              grad:"linear-gradient(135deg,#22c55e,#16a34a)" },
    { id:"exam_planner",  emoji:"📝", label:"Exam Planner",  desc:"Plan & track your syllabus",      grad:"linear-gradient(135deg,#f97316,#dc2626)" },
    { id:"internships",   emoji:"💼", label:"Internships",   desc:"Applications & placement",        grad:"linear-gradient(135deg,#0ea5e9,#6366f1)" },
    { id:"extracurriculars", emoji:"🎭", label:"Extracurriculars", desc:"Activities & achievements", grad:"linear-gradient(135deg,#a855f7,#ec4899)" },
    { id:"materials",     emoji:"📁", label:"Materials",     desc:"Files by subject",                grad:"linear-gradient(135deg,#f97316,#eab308)" },
    { id:"notes",         emoji:"✍️",  label:"Notes",         desc:"Jot anything, anytime",           grad:"linear-gradient(135deg,#a855f7,#ec4899)" },
    { id:"todo",          emoji:"✅", label:"To-Do",         desc:"Tasks & projects",                grad:"linear-gradient(135deg,#14b8a6,#10b981)" },
    { id:"store",         emoji:"🛍️", label:"Store",         desc:`Spend points · ${user?.points || 0} pts`, grad:"linear-gradient(135deg,#f59e0b,#a855f7)" },
  ];

  return (
    <div style={{ animation: "fadeIn 0.45s ease" }}>
      {/* Hero */}
      <Card t={t} style={{ marginBottom: "clamp(14px,3vw,20px)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div style={{ flex: 1, minWidth: "clamp(200px,50%,300px)" }}>
            <h1 style={{ fontFamily: "Pacifico,cursive", fontSize: "clamp(20px,4vw,28px)", background: `linear-gradient(135deg,${t.accent},${t.accent2})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              {greeting}, {user?.name?.split(" ")[0]}! {greetEmoji}
            </h1>
            <div style={{ marginTop: 12, padding: "12px 16px", background: t.tag, borderRadius: 12, borderLeft: `4px solid ${t.accent}` }}>
              <p style={{ color: t.text, fontWeight: 700, fontSize: "clamp(12px,2.5vw,14px)", lineHeight: 1.6 }}>{quote.emoji} {quote.text}</p>
              <p style={{ color: t.textSub, fontWeight: 700, fontSize: 11, marginTop: 5 }}>— {quote.author}</p>
            </div>
          </div>
          <div style={{ padding: "12px 18px", background: t.tag, borderRadius: 14, textAlign: "center", flexShrink: 0 }}>
            <div style={{ fontSize: 24 }}>⭐</div>
            <div style={{ fontSize: "clamp(18px,4vw,22px)", fontWeight: 900, color: "#f59e0b", marginTop: 2 }}>{user?.points || 0}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: t.textSub }}>Points</div>
          </div>
        </div>
      </Card>

      {/* Deadlines */}
      <div style={{ marginBottom: "clamp(14px,3vw,20px)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 4, height: 18, borderRadius: 99, background: "linear-gradient(180deg,#06b6d4,#3b82f6)" }} />
            <h2 style={{ color: t.text, fontWeight: 900, fontSize: "clamp(13px,3vw,16px)" }}>📅 Upcoming Deadlines</h2>
          </div>
          <button onClick={() => setTab("calendar")} style={{ background: t.tag, borderRadius: 9, padding: "4px 11px", color: t.textSub, fontWeight: 800, fontSize: 12, fontFamily: "Nunito,sans-serif" }}>View all →</button>
        </div>
        {upcoming.length === 0 ? (
          <Card t={t}><div style={{ textAlign: "center", color: t.textSub, fontWeight: 700, padding: "12px 0", fontSize: 14 }}>🎉 No upcoming deadlines! You're all clear.</div></Card>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(180px,100%),1fr))", gap: 10 }}>
            {upcoming.map((tk, i) => { const dc = dcColor(tk.date); return (
              <div key={tk.id} onClick={() => setTab("calendar")}
                style={{ background: t.card, border: `1.5px solid ${dc ? dc + "55" : t.cardBorder}`, borderRadius: 13, padding: "12px 14px", backdropFilter: "blur(14px)", cursor: "pointer", animation: `popIn 0.3s ease ${i * 0.06}s both` }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                <div style={{ color: t.text, fontWeight: 800, fontSize: 13, marginBottom: 5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{tk.title}</div>
                <Badge color={dc || t.textSub}>{dcLabel(tk.date)}</Badge>
              </div>
            );})}
          </div>
        )}
      </div>

      {/* Section cards */}
      <div style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 4, height: 18, borderRadius: 99, background: t.btnGrad }} />
        <h2 style={{ color: t.text, fontWeight: 900, fontSize: "clamp(13px,3vw,16px)" }}>Your Sections</h2>
        <span style={{ color: t.textSub, fontSize: 12, fontWeight: 600 }}>— tap to open</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(195px,100%),1fr))", gap: "clamp(10px,2vw,14px)" }}>
        {cards.map((card, i) => (
          <button key={card.id} onClick={() => setTab(card.id)}
            onMouseEnter={() => setHov(card.id)} onMouseLeave={() => setHov(null)}
            style={{
              background: hov === card.id ? card.grad.replace("linear-gradient(135deg,", "").replace(")", "").split(",")[0] + "18)" : t.card,
              border: `1.5px solid ${hov === card.id ? "rgba(168,85,247,0.35)" : t.cardBorder}`,
              borderRadius: 18, padding: "clamp(14px,3vw,18px)", backdropFilter: "blur(14px)",
              boxShadow: t.shadow, cursor: "pointer", textAlign: "left",
              transition: "all 0.22s ease",
              transform: hov === card.id ? "translateY(-4px) scale(1.02)" : "translateY(0) scale(1)",
              animation: `popIn 0.38s ease ${i * 0.04}s both`, display: "flex", flexDirection: "column",
              fontFamily: "Nunito,sans-serif",
            }}>
            <div style={{ width: 44, height: 44, borderRadius: 13, background: card.grad, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 10, transition: "transform 0.22s", transform: hov === card.id ? "rotate(-6deg) scale(1.1)" : "rotate(0) scale(1)", flexShrink: 0 }}>{card.emoji}</div>
            <div style={{ color: t.text, fontWeight: 800, fontSize: "clamp(13px,2.5vw,15px)", marginBottom: 3 }}>{card.label}</div>
            <div style={{ color: t.textSub, fontSize: "clamp(11px,2vw,12px)", fontWeight: 600, lineHeight: 1.5, flex: 1 }}>{card.desc}</div>
            <div style={{ marginTop: 12, fontSize: 12, fontWeight: 800, background: card.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", opacity: hov === card.id ? 1 : 0.45, transition: "opacity 0.2s" }}>
              Open <span style={{ transition: "transform 0.2s", display: "inline-block", transform: hov === card.id ? "translateX(4px)" : "translateX(0)" }}>→</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
