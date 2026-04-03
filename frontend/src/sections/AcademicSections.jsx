import { useState } from "react";
import { Card, FInput, Btn, PH, Badge, LabelInput, SelectInput, TextArea, DatePicker, DateButton } from "../components/ui";

// ─── CALENDAR ─────────────────────────────────────────────────────────────────
export function CalendarTab({ t, userData, saveKey, notify }) {
  const [tasks,    setTasks]    = useState(userData?.tasks    || []);
  const [form,     setForm]     = useState({ title: "", date: "" });
  const [editing,  setEditing]  = useState(null);
  const [showDP,   setShowDP]   = useState(false);
  const [showEdDP, setShowEdDP] = useState(false);
  const [calView,  setCalView]  = useState(false);
  const [calM,     setCalM]     = useState({ y: new Date().getFullYear(), m: new Date().getMonth() });

  const MN  = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const pad = n => String(n).padStart(2, "0");
  const today = new Date().toISOString().slice(0, 10);
  const tmrw  = new Date(); tmrw.setDate(tmrw.getDate() + 1); const ts = tmrw.toISOString().slice(0, 10);

  const persist  = async v => { setTasks(v); await saveKey("tasks", v); };
  const add      = () => { if (!form.title || !form.date) return; persist([...tasks, { ...form, id: Date.now(), done: false }]); setForm({ title: "", date: "" }); notify("Task added! 📅"); };
  const toggle   = id => persist(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const saveEdit = () => { persist(tasks.map(t => t.id === editing.id ? editing : t)); setEditing(null); };
  const upcoming = tasks.filter(t => !t.done).sort((a, b) => a.date.localeCompare(b.date));
  const uc       = d => d === today ? "#ef4444" : d === ts ? "#f59e0b" : Math.ceil((new Date(d) - new Date(today)) / 86400000) <= 3 ? "#f97316" : t.accent;

  const fd    = new Date(calM.y, calM.m, 1).getDay();
  const dim   = new Date(calM.y, calM.m + 1, 0).getDate();
  const cells = Array(fd).fill(null).concat(Array.from({ length: dim }, (_, i) => i + 1));

  return (
    <div style={{ animation: "fadeIn 0.45s ease" }}>
      {showDP   && <DatePicker t={t} value={form.date}    onChange={v => setForm({ ...form, date: v })}    onClose={() => setShowDP(false)} />}
      {showEdDP && editing && <DatePicker t={t} value={editing.date} onChange={v => setEditing({ ...editing, date: v })} onClose={() => setShowEdDP(false)} />}

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: "clamp(14px,3vw,22px)" }}>
        <PH t={t} emoji="📅" title="Calendar & Tasks" sub="Stay on top of your schedule 🗓️" />
        <button onClick={() => setCalView(v => !v)} style={{ padding: "8px 16px", borderRadius: 12, background: calView ? t.btnGrad : t.tag, color: calView ? "white" : t.textSub, fontWeight: 800, fontSize: 13, flexShrink: 0, fontFamily: "Nunito,sans-serif" }}>
          {calView ? "📋 List" : "🗓️ Calendar"}
        </button>
      </div>

      {tasks.filter(t => t.date === ts && !t.done).length > 0 && (
        <div style={{ background: "linear-gradient(135deg,#f59e0b22,#ec489922)", border: "1.5px solid #f59e0b66", borderRadius: 13, padding: "12px 16px", marginBottom: 14, display: "flex", gap: 10, alignItems: "center" }}>
          <span style={{ fontSize: 24 }}>🔔</span>
          <div><div style={{ color: t.text, fontWeight: 800, fontSize: 14 }}>Reminder!</div><div style={{ color: t.textSub, fontSize: 12 }}>Tasks due tomorrow!</div></div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "clamp(240px,30%,290px) 1fr", gap: "clamp(10px,2vw,18px)" }}>
        <Card t={t}>
          <h3 style={{ color: t.text, fontWeight: 800, marginBottom: 12, fontSize: 15 }}>Add Task</h3>
          <FInput t={t} placeholder="Task title" value={form.title} onChange={v => setForm({ ...form, title: v })} />
          <LabelInput t={t} label="📅 Due Date">
            <DateButton t={t} value={form.date} onClick={() => setShowDP(true)} />
          </LabelInput>
          <div style={{ marginTop: 4 }}><Btn t={t} onClick={add}>Add Task ➕</Btn></div>
        </Card>

        {calView ? (
          <Card t={t}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <button onClick={() => setCalM(c => c.m === 0 ? { y: c.y - 1, m: 11 } : { y: c.y, m: c.m - 1 })} style={{ width: 32, height: 32, borderRadius: 9, background: t.tag, color: t.text, fontWeight: 900, fontSize: 16 }}>‹</button>
              <span style={{ color: t.text, fontWeight: 900, fontSize: 14 }}>{MN[calM.m]} {calM.y}</span>
              <button onClick={() => setCalM(c => c.m === 11 ? { y: c.y + 1, m: 0 } : { y: c.y, m: c.m + 1 })} style={{ width: 32, height: 32, borderRadius: 9, background: t.tag, color: t.text, fontWeight: 900, fontSize: 16 }}>›</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, marginBottom: 4 }}>
              {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => <div key={d} style={{ textAlign: "center", fontSize: 10, fontWeight: 800, color: t.textSub }}>{d}</div>)}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2 }}>
              {cells.map((d, i) => {
                if (!d) return <div key={i} style={{ height: "clamp(44px,7vw,60px)" }} />;
                const ds  = `${calM.y}-${pad(calM.m + 1)}-${pad(d)}`;
                const dts = tasks.filter(tk => tk.date === ds && !tk.done);
                const isT = ds === today;
                return (
                  <div key={i} style={{ height: "clamp(44px,7vw,60px)", borderRadius: 8, background: isT ? t.btnGrad : t.tag, padding: "3px 4px", border: isT ? "none" : `1px solid ${t.cardBorder}`, overflow: "hidden" }}>
                    <div style={{ fontSize: 10, fontWeight: 800, color: isT ? "white" : t.text }}>{d}</div>
                    {dts.slice(0, 2).map(tk => <div key={tk.id} style={{ fontSize: 9, fontWeight: 700, color: isT ? "rgba(255,255,255,0.9)" : uc(tk.date), background: isT ? "rgba(255,255,255,0.2)" : uc(tk.date) + "22", borderRadius: 3, padding: "1px 3px", marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{tk.title}</div>)}
                    {dts.length > 2 && <div style={{ fontSize: 9, color: isT ? "rgba(255,255,255,0.7)" : t.textSub }}>+{dts.length - 2}</div>}
                  </div>
                );
              })}
            </div>
          </Card>
        ) : (
          <Card t={t}>
            <h3 style={{ color: t.text, fontWeight: 800, marginBottom: 12, fontSize: 15 }}>Upcoming Tasks</h3>
            {upcoming.length === 0 && <div style={{ textAlign: "center", color: t.textSub, padding: 18, fontSize: 14 }}>🎉 All caught up!</div>}
            {upcoming.map(task => (
              <div key={task.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: `1px solid ${t.cardBorder}` }}>
                <button onClick={() => toggle(task.id)} style={{ width: 24, height: 24, borderRadius: 7, border: `2px solid ${t.accent}`, background: task.done ? t.accent : "transparent", color: "white", fontSize: 12, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>{task.done ? "✓" : ""}</button>
                {editing?.id === task.id ? (
                  <div style={{ flex: 1, display: "flex", gap: 7, flexWrap: "wrap" }}>
                    <input value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} style={{ flex: 1, minWidth: 100, padding: "7px 11px", borderRadius: 9, background: t.input, border: `1.5px solid ${t.inputBorder}`, color: t.text, fontWeight: 700, fontSize: 13, fontFamily: "Nunito,sans-serif" }} />
                    <button onClick={() => setShowEdDP(true)} style={{ padding: "7px 11px", borderRadius: 9, background: t.input, border: `1.5px solid ${t.inputBorder}`, color: editing.date ? t.text : t.textSub, fontWeight: 700, fontSize: 12, fontFamily: "Nunito,sans-serif" }}>{editing.date || "📅"}</button>
                    <button onClick={saveEdit} style={{ padding: "7px 12px", borderRadius: 9, background: t.btnGrad, color: "white", fontWeight: 700, fontSize: 12, fontFamily: "Nunito,sans-serif" }}>Save</button>
                  </div>
                ) : (
                  <>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ color: t.text, fontWeight: 700, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{task.title}</div>
                      <div style={{ color: uc(task.date), fontSize: 11, fontWeight: 700, marginTop: 2 }}>{task.date === today ? "⚡ Due Today!" : task.date === ts ? "⚠️ Tomorrow!" : `📅 ${task.date}`}</div>
                    </div>
                    <button onClick={() => setEditing(task)} style={{ background: "none", fontSize: 16, padding: 3, flexShrink: 0 }}>✏️</button>
                    <button onClick={() => persist(tasks.filter(x => x.id !== task.id))} style={{ background: "none", fontSize: 16, padding: 3, flexShrink: 0 }}>🗑️</button>
                  </>
                )}
              </div>
            ))}
          </Card>
        )}
      </div>
    </div>
  );
}

// ─── EXPENSES ─────────────────────────────────────────────────────────────────
export function Expenses({ t, userData, saveKey, notify }) {
  const now = new Date();
  const [expenses,  setExpenses]  = useState(userData?.expenses || []);
  const [budgets,   setBudgets]   = useState(userData?.budgets  || {});
  const [vm, setVm] = useState(now.getMonth());
  const [vy, setVy] = useState(now.getFullYear());
  const [form,      setForm]      = useState({ name:"", amount:"", cat:"Food", date: now.toISOString().slice(0, 10) });
  const [editingB,  setEditingB]  = useState(false);
  const [budgetInp, setBudgetInp] = useState("5000");
  const [showDP,    setShowDP]    = useState(false);
  const [yearEdit,  setYearEdit]  = useState(false);
  const [yearInp,   setYearInp]   = useState("");

  const cC = { Food:"#f59e0b", Transport:"#3b82f6", Education:"#8b5cf6", Fun:"#ec4899", Health:"#10b981", Other:"#6b7280" };
  const cE = { Food:"🍕", Transport:"🚌", Education:"📚", Fun:"🎮", Health:"💊", Other:"📦" };
  const MN = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const bk = `${vy}-${String(vm + 1).padStart(2, "0")}`;
  const budget = budgets[bk] ?? 5000;

  const pExp = async v => { setExpenses(v); await saveKey("expenses", v); };
  const pBud = async v => { setBudgets(v); await saveKey("budgets", v); };

  const mExp = expenses.filter(e => { const d = new Date(e.date); return d.getMonth() === vm && d.getFullYear() === vy; });
  const total = mExp.reduce((s, e) => s + Number(e.amount), 0);
  const savings = budget - total;
  const spct = budget > 0 ? Math.min((total / budget) * 100, 100) : 0;
  const svpct = budget > 0 ? Math.max((savings / budget) * 100, 0) : 0;
  const isO = total > budget, isW = total > budget * 0.8 && !isO;

  const add = () => {
    if (!form.name || !form.amount || !form.date) return;
    const d = new Date(form.date); const em = d.getMonth(); const ey = d.getFullYear();
    const bkk = `${ey}-${String(em + 1).padStart(2, "0")}`; const budg = budgets[bkk] ?? 5000;
    const mt = expenses.filter(e => { const dd = new Date(e.date); return dd.getMonth() === em && dd.getFullYear() === ey; }).reduce((s, e) => s + Number(e.amount), 0) + Number(form.amount);
    pExp([...expenses, { ...form, id: Date.now(), amount: Number(form.amount) }]);
    setVm(em); setVy(ey);
    setForm({ name:"", amount:"", cat:"Food", date: now.toISOString().slice(0, 10) });
    if (mt > budg) notify("🚨 Budget exceeded!", "🚨");
    else if (mt > budg * 0.8) notify("⚠️ 80%+ budget used!", "⚠️");
    else notify("Expense added! 💰");
  };

  const savB = async () => {
    const v = Number(budgetInp); if (v > 0) { await pBud({ ...budgets, [bk]: v }); notify(`Budget for ${MN[vm]} set! 🎯`); }
    setEditingB(false);
  };

  const applyYearBudget = async () => {
    const v = Number(yearInp); if (v <= 0) return;
    const pm = Math.round(v / 12); const updated = { ...budgets };
    for (let i = 0; i < 12; i++) updated[`${vy}-${String(i + 1).padStart(2, "0")}`] = pm;
    setBudgets(updated); await saveKey("budgets", updated);
    setYearEdit(false); notify(`Yearly ₹${v.toLocaleString()} → ₹${pm.toLocaleString()}/mo! 🎯`);
  };

  const ctot = ["Food","Transport","Education","Fun","Health","Other"].map(c => ({ cat: c, total: mExp.filter(e => e.cat === c).reduce((s, e) => s + Number(e.amount), 0) })).filter(c => c.total > 0);
  const yExp = expenses.filter(e => new Date(e.date).getFullYear() === vy);
  const yTotal = yExp.reduce((s, e) => s + Number(e.amount), 0);
  const yBudget = Array.from({ length: 12 }, (_, i) => budgets[`${vy}-${String(i + 1).padStart(2, "0")}`] ?? 5000).reduce((s, v) => s + v, 0);
  const ySav = yBudget - yTotal;
  const mTotals = Array.from({ length: 12 }, (_, i) => ({ m: MN[i].slice(0, 3), idx: i, total: expenses.filter(e => { const d = new Date(e.date); return d.getMonth() === i && d.getFullYear() === vy; }).reduce((s, e) => s + Number(e.amount), 0) }));
  const maxMT = Math.max(...mTotals.map(m => m.total), 1);

  return (
    <div style={{ animation: "fadeIn 0.45s ease" }}>
      {showDP && <DatePicker t={t} value={form.date} onChange={v => setForm({ ...form, date: v })} onClose={() => setShowDP(false)} />}
      <PH t={t} emoji="💰" title="Expenses Tracker" sub="Monthly budgets & spending 📈" />

      {/* Month nav */}
      <Card t={t} style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => vm === 0 ? [setVm(11), setVy(y => y - 1)] : setVm(m => m - 1)} style={{ width: 34, height: 34, borderRadius: 10, background: t.tag, color: t.text, fontWeight: 900, fontSize: 16, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>
        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{ fontFamily: "Pacifico,cursive", fontSize: "clamp(16px,3.5vw,20px)", background: t.btnGrad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{MN[vm]} {vy}</div>
          <div style={{ color: t.textSub, fontSize: 11, fontWeight: 700, marginTop: 1 }}>{mExp.length} expense{mExp.length !== 1 ? "s" : ""}</div>
        </div>
        <button onClick={() => vm === 11 ? [setVm(0), setVy(y => y + 1)] : setVm(m => m + 1)} style={{ width: 34, height: 34, borderRadius: 10, background: t.tag, color: t.text, fontWeight: 900, fontSize: 16, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>›</button>
        {!(vm === now.getMonth() && vy === now.getFullYear()) && <button onClick={() => { setVm(now.getMonth()); setVy(now.getFullYear()); }} style={{ padding: "7px 13px", borderRadius: 10, background: t.btnGrad, color: "white", fontWeight: 800, fontSize: 12, whiteSpace: "nowrap", fontFamily: "Nunito,sans-serif" }}>Today</button>}
      </Card>

      {isO && <div style={{ background:"linear-gradient(135deg,#ef444422,#f9731622)",border:"2px solid #ef444466",borderRadius:13,padding:"13px 16px",marginBottom:14,display:"flex",gap:10,alignItems:"center" }}><span style={{fontSize:26}}>🚨</span><div><div style={{color:"#ef4444",fontWeight:900,fontSize:14}}>Budget Exceeded for {MN[vm]}!</div><div style={{color:t.textSub,fontSize:12}}>Overspent by ₹{Math.abs(savings).toLocaleString()}.</div></div></div>}
      {isW && <div style={{ background:"linear-gradient(135deg,#f59e0b22,#eab30822)",border:"2px solid #f59e0b66",borderRadius:13,padding:"13px 16px",marginBottom:14,display:"flex",gap:10,alignItems:"center" }}><span style={{fontSize:26}}>⚠️</span><div><div style={{color:"#f59e0b",fontWeight:900,fontSize:14}}>Approaching Limit!</div><div style={{color:t.textSub,fontSize:12}}>Used {spct.toFixed(0)}% · ₹{savings.toLocaleString()} left.</div></div></div>}

      {/* Summary */}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(120px,100%),1fr))",gap:10,marginBottom:14 }}>
        {[{l:`${MN[vm].slice(0,3)} Budget`,v:`₹${budget.toLocaleString()}`,e:"🎯",c:t.accent},{l:"Spent",v:`₹${total.toLocaleString()}`,e:"💸",c:isO?"#ef4444":"#f59e0b"},{l:"Savings",v:`₹${Math.max(savings,0).toLocaleString()}`,e:"🏦",c:"#10b981"},{l:"Used",v:`${spct.toFixed(0)}%`,e:isO?"🚨":isW?"⚠️":"📊",c:isO?"#ef4444":isW?"#f59e0b":"#6366f1"}].map((s,i)=>(
          <Card key={i} t={t} style={{padding:"12px 14px"}}><div style={{fontSize:22,marginBottom:4}}>{s.e}</div><div style={{fontSize:"clamp(15px,3vw,19px)",fontWeight:900,color:s.c}}>{s.v}</div><div style={{color:t.textSub,fontSize:11,fontWeight:700,marginTop:2}}>{s.l}</div></Card>
        ))}
      </div>

      {/* Budget bars */}
      <Card t={t} style={{ marginBottom: 14 }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10,flexWrap:"wrap",gap:7 }}>
          <div style={{ display:"flex",alignItems:"center",gap:8,flexWrap:"wrap" }}>
            <span style={{color:t.text,fontWeight:800,fontSize:13}}>💳 {MN[vm]} {vy} Budget</span>
            {editingB ? (
              <span style={{display:"flex",gap:5,alignItems:"center"}}>
                <input value={budgetInp} onChange={e=>setBudgetInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&savB()} style={{width:80,padding:"3px 8px",borderRadius:7,background:t.input,border:`1.5px solid ${t.inputBorder}`,color:t.text,fontWeight:700,fontSize:12,fontFamily:"Nunito,sans-serif"}}/>
                <button onClick={savB} style={{padding:"3px 10px",borderRadius:7,background:t.btnGrad,color:"white",fontWeight:700,fontSize:11,fontFamily:"Nunito,sans-serif"}}>Save</button>
                <button onClick={()=>setEditingB(false)} style={{padding:"3px 8px",borderRadius:7,background:t.tag,color:t.textSub,fontWeight:700,fontSize:11,fontFamily:"Nunito,sans-serif"}}>✕</button>
              </span>
            ) : <button onClick={()=>{setBudgetInp(String(budget));setEditingB(true);}} style={{background:t.tag,borderRadius:7,padding:"3px 9px",color:t.textSub,fontWeight:700,fontSize:11,fontFamily:"Nunito,sans-serif"}}>✏️ Edit</button>}
          </div>
          <div style={{color:isO?"#ef4444":"#10b981",fontWeight:900,fontSize:13}}>{isO?`Over ₹${Math.abs(savings).toLocaleString()}`:`₹${savings.toLocaleString()} left`}</div>
        </div>
        {[{l:`💸 ₹${total.toLocaleString()}`,p:spct,bg:isO?"linear-gradient(90deg,#ef4444,#f97316)":isW?"linear-gradient(90deg,#f59e0b,#ef4444)":"linear-gradient(90deg,#a855f7,#ec4899)"},{l:`🏦 ₹${Math.max(savings,0).toLocaleString()}`,p:svpct,bg:"linear-gradient(90deg,#10b981,#06b6d4)"}].map((bar,i)=>(
          <div key={i} style={{marginBottom:i===0?8:0}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:11,fontWeight:700,color:t.textSub,marginBottom:4}}><span>{bar.l}</span><span>{bar.p.toFixed(1)}%</span></div>
            <div style={{height:11,background:t.tag,borderRadius:99,overflow:"hidden"}}><div style={{height:"100%",borderRadius:99,transition:"width 0.8s ease",width:`${bar.p}%`,background:bar.bg}}/></div>
          </div>
        ))}
      </Card>

      {/* Form + list */}
      <div style={{ display:"grid",gridTemplateColumns:"clamp(240px,30%,280px) 1fr",gap:"clamp(10px,2vw,18px)" }}>
        <div>
          <Card t={t} style={{marginBottom:12}}>
            <h3 style={{color:t.text,fontWeight:800,marginBottom:12,fontSize:14}}>➕ Add Expense</h3>
            <FInput t={t} placeholder="Expense name" value={form.name} onChange={v=>setForm({...form,name:v})}/>
            <FInput t={t} placeholder="Amount (₹)" type="number" value={form.amount} onChange={v=>setForm({...form,amount:v})}/>
            <LabelInput t={t} label="📅 Date"><DateButton t={t} value={form.date} onClick={()=>setShowDP(true)}/></LabelInput>
            <div style={{marginBottom:10,marginTop:6}}>
              <SelectInput t={t} value={form.cat} onChange={v=>setForm({...form,cat:v})}>
                {["Food","Transport","Education","Fun","Health","Other"].map(c=><option key={c} value={c}>{cE[c]} {c}</option>)}
              </SelectInput>
            </div>
            <Btn t={t} onClick={add}>Add ➕</Btn>
          </Card>
          {ctot.length>0&&<Card t={t}><h4 style={{color:t.text,fontWeight:800,marginBottom:10,fontSize:13}}>By Category</h4>{ctot.sort((a,b)=>b.total-a.total).map(({cat,total:ct})=>(<div key={cat} style={{marginBottom:9}}><div style={{display:"flex",justifyContent:"space-between",fontSize:12,fontWeight:700,marginBottom:4}}><span style={{color:t.text}}>{cE[cat]} {cat}</span><span style={{color:cC[cat]}}>₹{ct.toLocaleString()}</span></div><div style={{height:6,background:t.tag,borderRadius:99,overflow:"hidden"}}><div style={{height:"100%",width:`${(ct/total)*100}%`,background:cC[cat],borderRadius:99}}/></div></div>))}</Card>}
        </div>
        <Card t={t}>
          <h3 style={{color:t.text,fontWeight:800,marginBottom:12,fontSize:14}}>{MN[vm]} {vy} Expenses</h3>
          {mExp.length===0?<div style={{textAlign:"center",color:t.textSub,padding:24}}><div style={{fontSize:40,marginBottom:8}}>🌸</div><div style={{fontWeight:700,fontSize:14}}>No expenses for {MN[vm]}</div></div>
          :[...mExp].sort((a,b)=>new Date(b.date)-new Date(a.date)).map(e=>(
            <div key={e.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:`1px solid ${t.cardBorder}`}}>
              <div style={{width:38,height:38,borderRadius:10,background:cC[e.cat]+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{cE[e.cat]}</div>
              <div style={{flex:1,minWidth:0}}><div style={{color:t.text,fontWeight:700,fontSize:13,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{e.name}</div><div style={{color:t.textSub,fontSize:11,marginTop:1}}>📅 {e.date} · <span style={{color:cC[e.cat]}}>{e.cat}</span></div></div>
              <div style={{color:isO?"#ef4444":t.accent,fontWeight:900,fontSize:14,flexShrink:0}}>₹{Number(e.amount).toLocaleString()}</div>
              <button onClick={()=>pExp(expenses.filter(x=>x.id!==e.id))} style={{background:"none",color:"#ef4444",fontSize:16,opacity:.55,padding:2,flexShrink:0}}>🗑️</button>
            </div>
          ))}
        </Card>
      </div>

      {/* Yearly */}
      <div style={{marginTop:22}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8,marginBottom:12}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:4,height:18,borderRadius:99,background:t.btnGrad}}/><h2 style={{color:t.text,fontWeight:900,fontSize:"clamp(14px,3vw,16px)"}}>📆 {vy} — Yearly</h2></div>
          {yearEdit ? (
            <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
              <span style={{color:t.textSub,fontSize:12,fontWeight:700}}>Yearly budget:</span>
              <input value={yearInp} onChange={e=>setYearInp(e.target.value)} placeholder="e.g. 120000" style={{width:100,padding:"4px 9px",borderRadius:8,background:t.input,border:`1.5px solid ${t.inputBorder}`,color:t.text,fontWeight:700,fontSize:12,fontFamily:"Nunito,sans-serif"}}/>
              <button onClick={applyYearBudget} style={{padding:"4px 12px",borderRadius:8,background:t.btnGrad,color:"white",fontWeight:800,fontSize:11,fontFamily:"Nunito,sans-serif"}}>Save</button>
              <button onClick={()=>setYearEdit(false)} style={{padding:"4px 9px",borderRadius:8,background:t.tag,color:t.textSub,fontWeight:700,fontSize:11,fontFamily:"Nunito,sans-serif"}}>✕</button>
            </div>
          ) : <button onClick={()=>{setYearInp(String(yBudget));setYearEdit(true);}} style={{background:t.tag,borderRadius:9,padding:"5px 12px",color:t.textSub,fontWeight:800,fontSize:12,fontFamily:"Nunito,sans-serif"}}>✏️ Edit Yearly Budget</button>}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(120px,100%),1fr))",gap:10,marginBottom:14}}>
          {[{l:"Yearly Budget",v:`₹${yBudget.toLocaleString()}`,e:"📋",c:t.accent},{l:"Total Spent",v:`₹${yTotal.toLocaleString()}`,e:"💸",c:yTotal>yBudget?"#ef4444":"#f59e0b"},{l:"Yearly Savings",v:`₹${Math.max(ySav,0).toLocaleString()}`,e:"🏦",c:"#10b981"}].map((s,i)=>(
            <Card key={i} t={t} style={{padding:"12px 14px"}}><div style={{fontSize:22,marginBottom:4}}>{s.e}</div><div style={{fontSize:"clamp(15px,3vw,18px)",fontWeight:900,color:s.c}}>{s.v}</div><div style={{color:t.textSub,fontSize:11,fontWeight:700,marginTop:2}}>{s.l}</div></Card>
          ))}
        </div>
        <Card t={t}>
          <h4 style={{color:t.text,fontWeight:800,marginBottom:14,fontSize:13}}>Monthly Spending — {vy}</h4>
          <div style={{display:"flex",alignItems:"flex-end",gap:"clamp(3px,1vw,6px)",height:100}}>
            {mTotals.map(mm=>{const bH=maxMT>0?Math.max((mm.total/maxMT)*82,mm.total>0?5:0):0;const iS=mm.idx===vm;const iOv=mm.total>(budgets[`${vy}-${String(mm.idx+1).padStart(2,"0")}`]??5000);return(
              <div key={mm.idx} onClick={()=>setVm(mm.idx)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,cursor:"pointer"}}>
                {mm.total>0&&<div style={{color:iOv?"#ef4444":t.textSub,fontSize:"clamp(7px,1.4vw,9px)",fontWeight:800,whiteSpace:"nowrap"}}>₹{mm.total>=1000?(mm.total/1000).toFixed(1)+"k":mm.total}</div>}
                <div style={{width:"100%",height:bH,borderRadius:"4px 4px 0 0",background:iS?t.btnGrad:iOv?"linear-gradient(180deg,#ef4444,#f97316)":t.tag,border:iS?`2px solid ${t.accent}`:"2px solid transparent",transition:"all 0.3s",minHeight:mm.total>0?5:0}}/>
                <div style={{color:iS?t.accent:t.textSub,fontSize:"clamp(8px,1.4vw,10px)",fontWeight:iS?900:600}}>{mm.m}</div>
              </div>
            );})}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── MARKS ────────────────────────────────────────────────────────────────────
export function Marks({ t, userData, saveKey, notify }) {
  const [subjects, setSubjects] = useState(userData?.marks || []);
  const [sf,   setSf]   = useState({ name: "", color: "#8b5cf6" });
  const [tf,   setTf]   = useState({ subjectId: "", termName: "Mid Term", marks: "", max: "100", classAvg: "" });
  const [etn,  setEtn]  = useState(null);
  const [etnV, setEtnV] = useState("");
  const [summId, setSummId] = useState(null);
  const sC = ["#8b5cf6","#3b82f6","#10b981","#f59e0b","#ec4899","#06b6d4","#f97316"];
  const defT = ["Mid Term","End Term","Assessment 1","Assessment 2","Quiz 1","Quiz 2","Practical","Project"];

  const persist = async v => { setSubjects(v); await saveKey("marks", v); };
  const pc = p => p >= 75 ? "#10b981" : p >= 50 ? "#f59e0b" : "#ef4444";
  const addSub = () => { if (!sf.name) return; persist([...subjects, { id: Date.now(), name: sf.name, color: sf.color, terms: [] }]); setSf({ name:"", color:"#8b5cf6" }); notify("Subject added!"); };
  const addTerm = () => { if (!tf.subjectId || !tf.marks) return; const sid = Number(tf.subjectId); persist(subjects.map(s => s.id === sid ? { ...s, terms: [...s.terms, { id: Date.now(), name: tf.termName || "Term", marks: Number(tf.marks), max: Number(tf.max) || 100, classAvg: Number(tf.classAvg) || 0, mistakes: "", expanded: false }] } : s)); setTf({ subjectId: tf.subjectId, termName: "Mid Term", marks: "", max: "100", classAvg: "" }); notify("Term added!"); };
  const togTerm = (sid, tid) => persist(subjects.map(s => s.id === sid ? { ...s, terms: s.terms.map(term => term.id === tid ? { ...term, expanded: !term.expanded } : term) } : s));
  const updMist = (sid, tid, v) => persist(subjects.map(s => s.id === sid ? { ...s, terms: s.terms.map(term => term.id === tid ? { ...term, mistakes: v } : term) } : s));
  const saveTN  = (sid, tid) => { persist(subjects.map(s => s.id === sid ? { ...s, terms: s.terms.map(term => term.id === tid ? { ...term, name: etnV } : term) } : s)); setEtn(null); };
  const allT = subjects.flatMap(s => s.terms);
  const oAvg = allT.length ? Math.round(allT.reduce((sum, term) => sum + (term.marks / term.max) * 100, 0) / allT.length) : 0;
  const sAvg = sub => sub.terms.length ? Math.round(sub.terms.reduce((sum, t) => sum + (t.marks / t.max) * 100, 0) / sub.terms.length) : null;
  const summSub = subjects.find(s => s.id === summId);
  const getSumm = sub => { if (!sub.terms.length) return null; const c = sub.terms.reduce((s, t) => s + (t.marks / t.max) * 100, 0); return { total: Math.min(Math.round(c), 100), terms: sub.terms }; };

  return (
    <div style={{ animation: "fadeIn 0.45s ease" }}>
      {summId && summSub && (
        <div style={{ position:"fixed",inset:0,zIndex:9100,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.5)",backdropFilter:"blur(5px)",padding:16 }} onClick={()=>setSummId(null)}>
          <div style={{ background:t.card,border:`1.5px solid ${t.cardBorder}`,borderRadius:20,padding:"clamp(18px,4vw,26px)",boxShadow:"0 20px 60px rgba(0,0,0,0.4)",backdropFilter:"blur(20px)",width:"min(460px,94vw)",maxHeight:"85vh",overflow:"auto",animation:"popIn 0.28s ease" }} onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
              <div style={{width:38,height:38,borderRadius:11,background:`${summSub.color}22`,border:`2px solid ${summSub.color}44`,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{width:13,height:13,borderRadius:"50%",background:summSub.color}}/></div>
              <div><div style={{color:t.text,fontWeight:900,fontSize:16}}>{summSub.name}</div><div style={{color:t.textSub,fontSize:11}}>Marks Summary</div></div>
              <button onClick={()=>setSummId(null)} style={{marginLeft:"auto",background:"none",color:t.textSub,fontSize:20,padding:3}}>✕</button>
            </div>
            {(()=>{ const s=getSumm(summSub); if(!s) return <div style={{color:t.textSub,textAlign:"center",padding:20}}>No terms yet.</div>;
              return (<><div style={{textAlign:"center",marginBottom:18,padding:16,background:t.tag,borderRadius:14}}>
                <div style={{fontSize:12,fontWeight:700,color:t.textSub,marginBottom:5}}>Cumulative Score (scaled /100)</div>
                <div style={{fontSize:"clamp(40px,8vw,50px)",fontWeight:900,color:pc(s.total)}}>{s.total}<span style={{fontSize:22,color:t.textSub}}>/100</span></div>
                <div style={{height:9,background:t.cardBorder,borderRadius:99,overflow:"hidden",marginTop:9}}><div style={{height:"100%",width:`${s.total}%`,background:`linear-gradient(90deg,${summSub.color},${summSub.color}88)`,borderRadius:99,transition:"width 1s ease"}}/></div>
                <div style={{marginTop:7,fontSize:16}}>{s.total>=75?"🌟 Excellent!":s.total>=50?"👍 Good Job!":"💪 Keep Going!"}</div>
              </div>
              <h4 style={{color:t.text,fontWeight:800,marginBottom:10,fontSize:13}}>Individual Terms</h4>
              {s.terms.map(term=>{const pct=Math.round((term.marks/term.max)*100);return(
                <div key={term.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:`1px solid ${t.cardBorder}`}}>
                  <Badge color={summSub.color}>{term.name}</Badge>
                  <div style={{flex:1}}><span style={{color:t.text,fontWeight:800}}>{term.marks}<span style={{color:t.textSub,fontSize:12}}>/{term.max}</span></span> <Badge color={pc(pct)}>{pct}%</Badge></div>
                  <span style={{color:t.textSub,fontSize:11}}>→ {pct} pts</span>
                </div>
              );})}
            </>); })()}
          </div>
        </div>
      )}

      <PH t={t} emoji="📊" title="Marks & Grades" sub="Track performance by subject & term 🏆" />
      <div style={{ display:"grid",gridTemplateColumns:"clamp(250px,30%,285px) 1fr",gap:"clamp(10px,2vw,18px)" }}>
        <div>
          <Card t={t} style={{marginBottom:12,textAlign:"center"}}><div style={{fontSize:"clamp(36px,7vw,44px)",fontWeight:900,color:pc(oAvg)}}>{oAvg||"—"}%</div><div style={{color:t.textSub,fontWeight:700,fontSize:12}}>Overall Average</div><div style={{marginTop:5,fontSize:18}}>{oAvg>=75?"🌟":oAvg>=50?"👍":oAvg>0?"💪":"📝"} {oAvg>=75?"Excellent!":oAvg>=50?"Good Job!":oAvg>0?"Keep Going!":"Add marks"}</div></Card>
          <Card t={t} style={{marginBottom:12}}>
            <h3 style={{color:t.text,fontWeight:800,marginBottom:10,fontSize:14}}>➕ Add Subject</h3>
            <FInput t={t} placeholder="Subject name" value={sf.name} onChange={v=>setSf({...sf,name:v})}/>
            <LabelInput t={t} label="Color"><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{sC.map(c=><button key={c} onClick={()=>setSf({...sf,color:c})} style={{width:22,height:22,borderRadius:"50%",background:c,border:`3px solid ${sf.color===c?t.text:"transparent"}`}}/>)}</div></LabelInput>
            <div style={{marginTop:6}}><Btn t={t} onClick={addSub}>Add Subject ➕</Btn></div>
          </Card>
          <Card t={t}>
            <h3 style={{color:t.text,fontWeight:800,marginBottom:10,fontSize:14}}>📝 Add Term Marks</h3>
            <LabelInput t={t} label="Subject"><SelectInput t={t} value={tf.subjectId} onChange={v=>setTf({...tf,subjectId:v})}><option value="">Select…</option>{subjects.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</SelectInput></LabelInput>
            <LabelInput t={t} label="Term Name">
              <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:5}}>{defT.map(n=><button key={n} onClick={()=>setTf({...tf,termName:n})} style={{padding:"3px 8px",borderRadius:6,background:tf.termName===n?t.btnGrad:t.tag,color:tf.termName===n?"white":t.textSub,fontWeight:700,fontSize:10,fontFamily:"Nunito,sans-serif"}}>{n}</button>)}</div>
              <input value={tf.termName} onChange={e=>setTf({...tf,termName:e.target.value})} placeholder="Custom…" style={{width:"100%",padding:"8px 11px",borderRadius:9,background:t.input,border:`1.5px solid ${t.inputBorder}`,color:t.text,fontWeight:700,fontSize:12,fontFamily:"Nunito,sans-serif"}}/>
            </LabelInput>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
              <LabelInput t={t} label="Marks"><input type="number" value={tf.marks} onChange={e=>setTf({...tf,marks:e.target.value})} placeholder="e.g. 13" style={{width:"100%",padding:"8px 11px",borderRadius:9,background:t.input,border:`1.5px solid ${t.inputBorder}`,color:t.text,fontWeight:700,fontSize:13,fontFamily:"Nunito,sans-serif"}}/></LabelInput>
              <LabelInput t={t} label="Out of"><input type="number" value={tf.max} onChange={e=>setTf({...tf,max:e.target.value})} placeholder="15" style={{width:"100%",padding:"8px 11px",borderRadius:9,background:t.input,border:`1.5px solid ${t.inputBorder}`,color:t.text,fontWeight:700,fontSize:13,fontFamily:"Nunito,sans-serif"}}/></LabelInput>
            </div>
            <LabelInput t={t} label="Class Avg (optional)"><input type="number" value={tf.classAvg} onChange={e=>setTf({...tf,classAvg:e.target.value})} placeholder="e.g. 10" style={{width:"100%",padding:"8px 11px",borderRadius:9,background:t.input,border:`1.5px solid ${t.inputBorder}`,color:t.text,fontWeight:700,fontSize:13,fontFamily:"Nunito,sans-serif"}}/></LabelInput>
            <Btn t={t} onClick={addTerm}>Add Term ➕</Btn>
          </Card>
        </div>
        <div>
          {subjects.length===0&&<Card t={t}><div style={{textAlign:"center",color:t.textSub,padding:36}}><div style={{fontSize:46}}>📊</div><p style={{fontWeight:700,marginTop:10,fontSize:14}}>Add a subject to get started!</p></div></Card>}
          {subjects.map(sub=>{const sa=sAvg(sub);return(
            <Card t={t} key={sub.id} style={{marginBottom:14}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:sub.terms.length>0?12:0,paddingBottom:sub.terms.length>0?10:0,borderBottom:sub.terms.length>0?`1px solid ${t.cardBorder}`:"none",flexWrap:"wrap"}}>
                <div style={{width:38,height:38,borderRadius:11,background:`${sub.color}22`,border:`2px solid ${sub.color}44`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><div style={{width:13,height:13,borderRadius:"50%",background:sub.color}}/></div>
                <div style={{flex:1,minWidth:0}}><div style={{color:t.text,fontWeight:900,fontSize:15,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{sub.name}</div><div style={{color:t.textSub,fontSize:11,marginTop:1}}>{sub.terms.length} term{sub.terms.length!==1?"s":""}</div></div>
                {sa!==null&&<div style={{textAlign:"center",padding:"6px 12px",borderRadius:11,background:`${pc(sa)}22`,border:`1.5px solid ${pc(sa)}44`,flexShrink:0}}><div style={{fontSize:18,fontWeight:900,color:pc(sa)}}>{sa}%</div><div style={{color:t.textSub,fontSize:10}}>avg</div></div>}
                <button onClick={()=>setSummId(sub.id)} style={{padding:"6px 12px",borderRadius:9,background:t.btnGrad,color:"white",fontWeight:800,fontSize:11,fontFamily:"Nunito,sans-serif"}}>📈 Summary</button>
                <button onClick={()=>persist(subjects.filter(s=>s.id!==sub.id))} style={{background:"none",color:"#ef444466",fontSize:16,padding:2}}>🗑️</button>
              </div>
              {sub.terms.map(term=>{
                const pct=Math.round((term.marks/term.max)*100), above=term.classAvg>0&&term.marks>=term.classAvg;
                const isEN=etn?.subjectId===sub.id&&etn?.termId===term.id;
                return(
                  <div key={term.id} style={{marginBottom:8,borderRadius:12,border:`1.5px solid ${term.expanded?sub.color+"44":t.cardBorder}`,overflow:"hidden"}}>
                    <div onClick={()=>togTerm(sub.id,term.id)} style={{display:"flex",alignItems:"center",gap:9,padding:"11px 13px",cursor:"pointer",background:term.expanded?`${sub.color}08`:"transparent",flexWrap:"wrap"}}>
                      <div style={{padding:"3px 9px",borderRadius:99,background:`${sub.color}22`,border:`1.5px solid ${sub.color}44`,flexShrink:0}}>
                        {isEN?<input value={etnV} onChange={e=>setEtnV(e.target.value)} onBlur={()=>saveTN(sub.id,term.id)} onKeyDown={e=>e.key==="Enter"&&saveTN(sub.id,term.id)} onClick={e=>e.stopPropagation()} autoFocus style={{background:"none",border:"none",outline:"none",color:sub.color,fontWeight:800,fontSize:11,width:90,fontFamily:"Nunito,sans-serif"}}/>:<span style={{color:sub.color,fontWeight:800,fontSize:11}}>{term.name}</span>}
                      </div>
                      <button onClick={e=>{e.stopPropagation();setEtn({subjectId:sub.id,termId:term.id});setEtnV(term.name);}} style={{background:"none",fontSize:12,color:t.textSub,opacity:.6,padding:2,flexShrink:0}}>✏️</button>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:"flex",alignItems:"center",gap:7,flexWrap:"wrap"}}><span style={{color:t.text,fontWeight:900,fontSize:14}}>{term.marks}<span style={{color:t.textSub,fontWeight:600,fontSize:12}}>/{term.max}</span></span><Badge color={pc(pct)}>{pct}%</Badge>{term.classAvg>0&&<Badge color={above?"#10b981":"#ef4444"}>{above?"▲":"▼"} avg {term.classAvg}</Badge>}</div>
                        <div style={{height:4,background:t.tag,borderRadius:99,marginTop:4,overflow:"hidden"}}><div style={{height:"100%",width:`${pct}%`,background:pc(pct),borderRadius:99}}/></div>
                      </div>
                      <button onClick={e=>{e.stopPropagation();persist(subjects.map(s=>s.id===sub.id?{...s,terms:s.terms.filter(t2=>t2.id!==term.id)}:s));}} style={{background:"none",color:"#ef444466",fontSize:14,padding:2,flexShrink:0}}>🗑️</button>
                      <span style={{color:t.textSub,fontSize:12,flexShrink:0}}>{term.expanded?"▲":"▼"}</span>
                    </div>
                    {term.expanded&&(
                      <div style={{padding:"0 13px 13px",animation:"fadeIn 0.22s ease"}}>
                        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:10}}>
                          {[{l:"Your Score",v:`${pct}%`,c:pc(pct),e:"🎯"},{l:"Class Avg",v:term.classAvg>0?`${Math.round((term.classAvg/term.max)*100)}%`:"N/A",c:"#6366f1",e:"👥"},{l:"vs Class",v:term.classAvg>0?(term.marks-term.classAvg>0?`+${term.marks-term.classAvg}`:`${term.marks-term.classAvg}`):"—",c:term.classAvg>0?(above?"#10b981":"#ef4444"):t.textSub,e:above?"📈":"📉"}].map((s,i)=>(
                            <div key={i} style={{background:t.tag,borderRadius:10,padding:"8px 10px",textAlign:"center"}}><div style={{fontSize:15}}>{s.e}</div><div style={{fontWeight:900,fontSize:14,color:s.c,marginTop:2}}>{s.v}</div><div style={{fontSize:10,fontWeight:700,color:t.textSub}}>{s.l}</div></div>
                          ))}
                        </div>
                        <label style={{fontSize:12,fontWeight:800,color:t.text,display:"block",marginBottom:5}}>✍️ Mistakes & Improvements</label>
                        <TextArea t={t} value={term.mistakes} onChange={v=>updMist(sub.id,term.id,v)} placeholder="Write your mistakes and what to revise…" rows={3}/>
                      </div>
                    )}
                  </div>
                );
              })}
              {sub.terms.length===0&&<div style={{textAlign:"center",color:t.textSub,padding:"10px 0",fontSize:12}}>No terms yet. Add from the form on the left! 📝</div>}
            </Card>
          );})}
        </div>
      </div>
    </div>
  );
}
