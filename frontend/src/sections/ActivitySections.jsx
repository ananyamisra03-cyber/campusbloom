import { useState, useEffect, useRef } from "react";
import { Card, FInput, Btn, PH, Badge, LabelInput, SelectInput, TextArea, DatePicker, DateButton } from "../components/ui";
import { WORK_CATS } from "../utils/themes";

// ─── TIMER ────────────────────────────────────────────────────────────────────
export function Timer({ t, userData, saveKey, addPoints, notify }) {
  const [sessions,    setSessions]   = useState(userData?.timerSessions || []);
  const [running,     setRunning]    = useState(false);
  const [paused,      setPaused]     = useState(false);
  const [elapsed,     setElapsed]    = useState(0);
  const [customH,     setCustomH]    = useState(1);
  const [customM,     setCustomM]    = useState(0);
  const [subject,     setSubject]    = useState("");
  const [category,    setCategory]   = useState("📖 Study");
  const [showCongrats,setShowCongrats] = useState(false);
  const intRef = useRef(null); const ptRef = useRef(0);

  const target = customH * 3600 + customM * 60;
  const pct    = target > 0 ? Math.min(elapsed / target, 1) : 0;
  const R = 78; const circ = 2 * Math.PI * R;
  const fmt = s => `${String(Math.floor(s/3600)).padStart(2,"0")}:${String(Math.floor((s%3600)/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
  const persist = async v => { setSessions(v); await saveKey("timerSessions", v); };

  useEffect(() => {
    if (running && !paused) {
      intRef.current = setInterval(() => {
        setElapsed(e => {
          const ne = e + 1;
          if (ne % 3600 === 0) { addPoints(10); ptRef.current += 10; }
          if (ne >= target) { clearInterval(intRef.current); setRunning(false); setShowCongrats(true); }
          return ne;
        });
      }, 1000);
    } else clearInterval(intRef.current);
    return () => clearInterval(intRef.current);
  }, [running, paused, target]);

  const start = () => { if (target === 0) return; setElapsed(0); ptRef.current = 0; setRunning(true); setPaused(false); setShowCongrats(false); };
  const stopEarly = () => {
    clearInterval(intRef.current); setRunning(false); setPaused(false);
    if (elapsed > 60) { persist([{ subject: subject || "General", category, duration: elapsed, target, pts: ptRef.current, time: new Date().toLocaleString() }, ...sessions]); ptRef.current = 0; }
    setElapsed(0);
  };
  const finishSave = () => {
    persist([{ subject: subject || "General", category, duration: elapsed, target, pts: ptRef.current, time: new Date().toLocaleString() }, ...sessions]);
    ptRef.current = 0; setElapsed(0); setShowCongrats(false);
  };

  const catMap = {}; sessions.forEach(s => { catMap[s.category] = (catMap[s.category] || 0) + s.duration; });

  return (
    <div style={{ animation: "fadeIn 0.45s ease" }}>
      {showCongrats && (
        <div style={{ position:"fixed",inset:0,zIndex:9200,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.6)",backdropFilter:"blur(8px)",padding:16 }} onClick={finishSave}>
          <div style={{ background:t.card,border:`1.5px solid ${t.cardBorder}`,borderRadius:24,padding:"clamp(24px,5vw,40px)",maxWidth:"min(420px,94vw)",width:"100%",textAlign:"center",animation:"popIn 0.4s ease",boxShadow:`0 20px 70px rgba(168,85,247,0.4)` }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize:"clamp(52px,12vw,72px)",animation:"pulse 1s infinite",marginBottom:6 }}>🎉</div>
            <h2 style={{ fontFamily:"Pacifico,cursive",fontSize:"clamp(20px,5vw,28px)",background:t.btnGrad,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:7 }}>Congratulations!</h2>
            <p style={{ color:t.text,fontWeight:700,fontSize:"clamp(13px,3vw,15px)",lineHeight:1.6,marginBottom:5 }}>You completed your {fmt(target)} session!</p>
            <p style={{ color:t.textSub,fontWeight:600,fontSize:"clamp(11px,2.5vw,13px)",marginBottom:18 }}>{subject || "General"} · {category}</p>
            <div style={{ display:"flex",justifyContent:"center",gap:14,marginBottom:20,flexWrap:"wrap" }}>
              {[{v:fmt(elapsed),l:"Time Studied",e:"⏱️",c:t.accent},{v:`+${ptRef.current}`,l:"Points Earned",e:"⭐",c:"#f59e0b"}].map((s,i)=>(
                <div key={i} style={{ padding:"10px 16px",background:t.tag,borderRadius:13,textAlign:"center" }}>
                  <div style={{fontSize:22}}>{s.e}</div><div style={{fontSize:"clamp(16px,4vw,20px)",fontWeight:900,color:s.c}}>{s.v}</div><div style={{fontSize:11,fontWeight:700,color:t.textSub}}>{s.l}</div>
                </div>
              ))}
            </div>
            <button onClick={finishSave} style={{ width:"100%",padding:"13px",borderRadius:13,background:t.btnGrad,color:"white",fontWeight:800,fontSize:"clamp(13px,3vw,15px)",boxShadow:"0 4px 18px rgba(168,85,247,0.4)",fontFamily:"Nunito,sans-serif" }}>Awesome! Save Session 🚀</button>
          </div>
        </div>
      )}
      <PH t={t} emoji="⏱️" title="Study Timer" sub="Set your session, focus, earn points! ⭐" />
      <div style={{ display:"grid",gridTemplateColumns:"1fr clamp(230px,30%,270px)",gap:"clamp(10px,2vw,18px)" }}>
        <Card t={t} style={{ textAlign:"center" }}>
          {!running ? (
            <div style={{ marginBottom: 18 }}>
              <h3 style={{ color:t.text,fontWeight:800,marginBottom:14,textAlign:"left",fontSize:14 }}>⚙️ Set Session Duration</h3>
              <div style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:"clamp(10px,3vw,18px)",marginBottom:10 }}>
                {[[customH, setCustomH, "Hours", 0, 3, 1],[customM, setCustomM, "Minutes", 0, 55, 5]].map(([val, setVal, lbl, min, max, step]) => (
                  <div key={lbl} style={{ textAlign:"center" }}>
                    <div style={{fontSize:11,fontWeight:700,color:t.textSub,marginBottom:4}}>{lbl}</div>
                    <div style={{ display:"flex",alignItems:"center",gap:7 }}>
                      <button onClick={() => setVal(v => Math.max(min, v - step))} style={{width:30,height:30,borderRadius:9,background:t.tag,color:t.text,fontWeight:900,fontSize:16}}>−</button>
                      <span style={{fontSize:"clamp(22px,5vw,28px)",fontWeight:900,color:t.accent,minWidth:34}}>{String(val).padStart(2,"0")}</span>
                      <button onClick={() => setVal(v => Math.min(max, v + step))} style={{width:30,height:30,borderRadius:9,background:t.tag,color:t.text,fontWeight:900,fontSize:16}}>+</button>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize:11,fontWeight:700,color:t.textSub,marginBottom:12 }}>Max: 3 hours · 1hr = +10 pts</div>
              <div style={{ display:"flex",gap:6,flexWrap:"wrap",justifyContent:"center",marginBottom:4 }}>
                {[[0,25,"25m"],[0,45,"45m"],[1,0,"1h"],[1,30,"1.5h"],[2,0,"2h"],[3,0,"3h"]].map(([h,m,lbl]) => (
                  <button key={lbl} onClick={() => { setCustomH(h); setCustomM(m); }} style={{ padding:"4px 11px",borderRadius:99,background:customH===h&&customM===m?t.btnGrad:t.tag,color:customH===h&&customM===m?"white":t.textSub,fontWeight:700,fontSize:11,fontFamily:"Nunito,sans-serif" }}>{lbl}</button>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ position:"relative",width:"clamp(150px,40vw,190px)",height:"clamp(150px,40vw,190px)",margin:"0 auto 18px" }}>
              <svg width="100%" height="100%" viewBox="0 0 190 190" style={{ transform:"rotate(-90deg)" }}>
                <circle cx="95" cy="95" r={R} fill="none" stroke={t.tag} strokeWidth="11"/>
                <circle cx="95" cy="95" r={R} fill="none" stroke={t.accent} strokeWidth="11" strokeDasharray={circ} strokeDashoffset={circ*(1-pct)} strokeLinecap="round" style={{ transition:"stroke-dashoffset 1s linear" }}/>
              </svg>
              <div style={{ position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center" }}>
                <div style={{ fontFamily:"Pacifico,cursive",fontSize:"clamp(20px,5vw,26px)",color:t.text }}>{fmt(Math.max(target-elapsed,0))}</div>
                <div style={{color:t.textSub,fontSize:10,fontWeight:700,marginTop:2}}>{Math.round(pct*100)}% done</div>
              </div>
            </div>
          )}
          <FInput t={t} placeholder="What are you studying? 📖" value={subject} onChange={setSubject}/>
          <LabelInput t={t} label="Category">
            <div style={{ display:"flex",flexWrap:"wrap",gap:5,marginBottom:8 }}>
              {WORK_CATS.map(c => <button key={c} onClick={() => setCategory(c)} style={{ padding:"4px 10px",borderRadius:99,background:category===c?t.btnGrad:t.tag,color:category===c?"white":t.textSub,fontWeight:700,fontSize:11,fontFamily:"Nunito,sans-serif" }}>{c}</button>)}
            </div>
          </LabelInput>
          <div style={{ display:"flex",gap:9,justifyContent:"center" }}>
            {!running ? (
              <button onClick={start} disabled={target===0} style={{ padding:"12px 28px",borderRadius:13,background:t.btnGrad,color:"white",fontWeight:800,fontSize:16,boxShadow:"0 4px 16px rgba(168,85,247,0.38)",opacity:target===0?0.5:1,fontFamily:"Nunito,sans-serif" }}>▶ Start</button>
            ) : (
              <>
                <button onClick={() => setPaused(p=>!p)} style={{ padding:"12px 18px",borderRadius:13,background:t.tag,color:t.text,fontWeight:800,fontSize:14,border:`1.5px solid ${t.cardBorder}`,fontFamily:"Nunito,sans-serif" }}>{paused?"▶ Resume":"⏸ Pause"}</button>
                <button onClick={stopEarly} style={{ padding:"12px 18px",borderRadius:13,background:"#ef444422",color:"#ef4444",fontWeight:800,fontSize:14,border:"1.5px solid #ef444444",fontFamily:"Nunito,sans-serif" }}>⏹ Stop</button>
              </>
            )}
          </div>
        </Card>
        <div>
          <Card t={t} style={{ marginBottom:14 }}>
            <h3 style={{color:t.text,fontWeight:800,marginBottom:12,fontSize:13}}>📊 Hours by Category</h3>
            {Object.keys(catMap).length===0 && <div style={{color:t.textSub,fontSize:12}}>No sessions yet 🌱</div>}
            {Object.entries(catMap).sort((a,b)=>b[1]-a[1]).map(([cat,secs]) => (
              <div key={cat} style={{marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:12,fontWeight:700,marginBottom:4}}><span style={{color:t.text}}>{cat}</span><span style={{color:t.accent}}>{(secs/3600).toFixed(1)}h</span></div>
                <div style={{height:6,background:t.tag,borderRadius:99,overflow:"hidden"}}><div style={{height:"100%",width:`${Math.min((secs/10800)*100,100)}%`,background:t.btnGrad,borderRadius:99}}/></div>
              </div>
            ))}
          </Card>
          <Card t={t}>
            <h3 style={{color:t.text,fontWeight:800,marginBottom:12,fontSize:13}}>📋 Recent Sessions</h3>
            {sessions.length===0 && <div style={{color:t.textSub,fontSize:12}}>No sessions yet 🌱</div>}
            {sessions.slice(0,5).map((s,i) => (
              <div key={i} style={{padding:"9px 0",borderBottom:`1px solid ${t.cardBorder}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{color:t.text,fontWeight:700,fontSize:12,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1}}>{s.subject}</span>
                  <span style={{color:t.accent,fontWeight:800,fontSize:12,flexShrink:0,marginLeft:8}}>{fmt(s.duration)}</span>
                </div>
                <div style={{color:t.textSub,fontSize:10,fontWeight:600,marginTop:2}}>{s.category}{s.pts>0&&<span style={{color:"#f59e0b",marginLeft:6}}>+{s.pts} pts</span>}</div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── HABITS ───────────────────────────────────────────────────────────────────
export function Habits({ t, userData, saveKey, notify }) {
  const [habits, setHabits] = useState(userData?.habits || []);
  const [form,   setForm]   = useState({ name:"", emoji:"🌱", target:1, unit:"times/day", color:"#10b981" });
  const today = new Date().toISOString().slice(0, 10);
  const EMOJIS = ["🌱","💧","📚","🏃","🧘","🍎","😴","💊","✍️","🎵","🏋️","🧹"];
  const COLORS  = ["#10b981","#3b82f6","#a855f7","#ec4899","#f59e0b","#06b6d4","#f97316"];
  const persist = async v => { setHabits(v); await saveKey("habits", v); };
  const addHabit = () => { if (!form.name) return; persist([...habits, { id: Date.now(), name: form.name, emoji: form.emoji, target: form.target, unit: form.unit, color: form.color, log: {} }]); setForm({ name:"", emoji:"🌱", target:1, unit:"times/day", color:"#10b981" }); notify("Habit added! 🌱"); };
  const logToday = (id, delta = 1) => persist(habits.map(h => { if (h.id !== id) return h; const cur = (h.log[today] || 0) + delta; return { ...h, log: { ...h.log, [today]: Math.max(0, cur) } }; }));
  const getStreak = h => { let s = 0; const d = new Date(); while (true) { const ds = d.toISOString().slice(0,10); if ((h.log[ds]||0) >= h.target) { s++; d.setDate(d.getDate()-1); } else break; } return s; };
  const last7 = Array.from({ length:7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate()-(6-i)); return d.toISOString().slice(0,10); });
  return (
    <div style={{ animation:"fadeIn 0.45s ease" }}>
      <PH t={t} emoji="🌱" title="Habit Tracker" sub="Build daily habits, one day at a time 🔥" />
      <div style={{ display:"grid",gridTemplateColumns:"clamp(240px,28%,265px) 1fr",gap:"clamp(10px,2vw,18px)" }}>
        <Card t={t}>
          <h3 style={{color:t.text,fontWeight:800,marginBottom:12,fontSize:14}}>➕ Add Habit</h3>
          <FInput t={t} placeholder="Habit name" value={form.name} onChange={v=>setForm({...form,name:v})}/>
          <LabelInput t={t} label="Emoji"><div style={{display:"flex",flexWrap:"wrap",gap:5}}>{EMOJIS.map(e=><button key={e} onClick={()=>setForm({...form,emoji:e})} style={{fontSize:19,padding:4,borderRadius:8,background:form.emoji===e?t.tag:"transparent",border:`2px solid ${form.emoji===e?t.accent:"transparent"}`}}>{e}</button>)}</div></LabelInput>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
            <LabelInput t={t} label="Target"><input type="number" min={1} max={10} value={form.target} onChange={e=>setForm({...form,target:Number(e.target.value)})} style={{width:"100%",padding:"8px 10px",borderRadius:9,background:t.input,border:`1.5px solid ${t.inputBorder}`,color:t.text,fontWeight:700,fontSize:13,fontFamily:"Nunito,sans-serif"}}/></LabelInput>
            <LabelInput t={t} label="Unit"><input value={form.unit} onChange={e=>setForm({...form,unit:e.target.value})} style={{width:"100%",padding:"8px 10px",borderRadius:9,background:t.input,border:`1.5px solid ${t.inputBorder}`,color:t.text,fontWeight:700,fontSize:12,fontFamily:"Nunito,sans-serif"}}/></LabelInput>
          </div>
          <LabelInput t={t} label="Color"><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{COLORS.map(c=><button key={c} onClick={()=>setForm({...form,color:c})} style={{width:22,height:22,borderRadius:"50%",background:c,border:`3px solid ${form.color===c?t.text:"transparent"}`}}/>)}</div></LabelInput>
          <Btn t={t} onClick={addHabit}>Add Habit ➕</Btn>
        </Card>
        <div>
          {habits.length===0&&<Card t={t}><div style={{textAlign:"center",color:t.textSub,padding:30}}><div style={{fontSize:46}}>🌱</div><p style={{fontWeight:700,marginTop:9,fontSize:13}}>Add your first habit!</p></div></Card>}
          {habits.map(h => { const tc = h.log[today]||0, done = tc>=h.target, streak = getStreak(h); return (
            <Card t={t} key={h.id} style={{marginBottom:14}}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12,flexWrap:"wrap"}}>
                <div style={{width:42,height:42,borderRadius:12,background:`${h.color}22`,border:`2px solid ${h.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{h.emoji}</div>
                <div style={{flex:1,minWidth:0}}><div style={{color:t.text,fontWeight:800,fontSize:14,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{h.name}</div><div style={{color:t.textSub,fontSize:11,marginTop:2}}>Target: {h.target} {h.unit} · 🔥 {streak} day streak</div></div>
                <div style={{textAlign:"center",padding:"7px 12px",borderRadius:11,background:done?`${h.color}22`:"transparent",border:`1.5px solid ${done?h.color+"44":t.cardBorder}`,flexShrink:0}}><div style={{fontSize:18,fontWeight:900,color:done?h.color:t.textSub}}>{tc}/{h.target}</div><div style={{fontSize:10,fontWeight:700,color:t.textSub}}>today</div></div>
                <button onClick={()=>persist(habits.filter(x=>x.id!==h.id))} style={{background:"none",color:"#ef444466",fontSize:16,padding:2,flexShrink:0}}>🗑️</button>
              </div>
              <div style={{height:7,background:t.tag,borderRadius:99,overflow:"hidden",marginBottom:11}}><div style={{height:"100%",width:`${Math.min((tc/h.target)*100,100)}%`,background:h.color,borderRadius:99,transition:"width 0.5s ease"}}/></div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                <button onClick={()=>logToday(h.id,1)} style={{flex:1,padding:"9px",borderRadius:10,background:done?h.color:t.btnGrad,color:"white",fontWeight:800,fontSize:13,fontFamily:"Nunito,sans-serif"}}>{done?"✅ Done!":"+ Log"}</button>
                <button onClick={()=>logToday(h.id,-1)} style={{padding:"9px 13px",borderRadius:10,background:t.tag,color:t.textSub,fontWeight:800,fontSize:13,fontFamily:"Nunito,sans-serif"}}>−</button>
              </div>
              <div style={{fontSize:11,fontWeight:700,color:t.textSub,marginBottom:5}}>Last 7 days</div>
              <div style={{display:"flex",gap:4}}>
                {last7.map(d => { const cnt=h.log[d]||0, ok=cnt>=h.target, day=new Date(d+"T12:00:00").toLocaleDateString("en",{weekday:"short"}); return (
                  <div key={d} style={{flex:1,textAlign:"center"}}>
                    <div style={{height:24,borderRadius:6,background:ok?h.color:t.tag,border:`1px solid ${ok?h.color+"55":t.cardBorder}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11}}>{ok?"✓":cnt>0?cnt:""}</div>
                    <div style={{fontSize:9,fontWeight:700,color:t.textSub,marginTop:2}}>{day}</div>
                  </div>
                );})}
              </div>
            </Card>
          );})}
        </div>
      </div>
    </div>
  );
}

// ─── EXAM PLANNER ─────────────────────────────────────────────────────────────
export function ExamPlanner({ t, userData, saveKey, notify }) {
  const [exams,    setExams]    = useState(userData?.exams || []);
  const [form,     setForm]     = useState({ subject:"", date:"", syllabus:"", notes:"" });
  const [showDP,   setShowDP]   = useState(false);
  const [selected, setSelected] = useState(null);
  const [newTopic, setNewTopic] = useState("");
  const today = new Date().toISOString().slice(0, 10);
  const persist = async v => { setExams(v); await saveKey("exams", v); };
  const addExam = () => { if (!form.subject||!form.date) return; const topics = form.syllabus.split(",").map(s=>s.trim()).filter(Boolean).map(s=>({text:s,done:false})); persist([...exams,{id:Date.now(),subject:form.subject,date:form.date,notes:form.notes,topics}]); setForm({subject:"",date:"",syllabus:"",notes:""}); notify("Exam added! 📝"); };
  const togTopic = (eid,ti) => persist(exams.map(e=>e.id===eid?{...e,topics:e.topics.map((tp,i)=>i===ti?{...tp,done:!tp.done}:tp)}:e));
  const addTopic = eid => { if (!newTopic.trim()) return; persist(exams.map(e=>e.id===eid?{...e,topics:[...e.topics,{text:newTopic.trim(),done:false}]}:e)); setNewTopic(""); };
  const getDays = date => Math.ceil((new Date(date)-new Date(today))/86400000);
  const getProg = e => e.topics.length ? Math.round((e.topics.filter(tp=>tp.done).length/e.topics.length)*100) : 0;
  const sorted = [...exams].sort((a,b)=>a.date.localeCompare(b.date));
  return (
    <div style={{ animation:"fadeIn 0.45s ease" }}>
      {showDP && <DatePicker t={t} value={form.date} onChange={v=>setForm({...form,date:v})} onClose={()=>setShowDP(false)}/>}
      <PH t={t} emoji="📝" title="Exam Strategy Planner" sub="Plan your exams, track your syllabus 🎯" />
      <div style={{ display:"grid",gridTemplateColumns:"clamp(250px,30%,285px) 1fr",gap:"clamp(10px,2vw,18px)" }}>
        <Card t={t}>
          <h3 style={{color:t.text,fontWeight:800,marginBottom:12,fontSize:14}}>➕ Add Exam</h3>
          <FInput t={t} placeholder="Subject name" value={form.subject} onChange={v=>setForm({...form,subject:v})}/>
          <LabelInput t={t} label="📅 Exam Date"><DateButton t={t} value={form.date} onClick={()=>setShowDP(true)} placeholder="Pick exam date…"/></LabelInput>
          <LabelInput t={t} label="📖 Syllabus Topics (comma-separated)"><TextArea t={t} value={form.syllabus} onChange={v=>setForm({...form,syllabus:v})} placeholder="Limits, Derivatives, Integration…" rows={3}/></LabelInput>
          <LabelInput t={t} label="📌 Strategy / Notes"><TextArea t={t} value={form.notes} onChange={v=>setForm({...form,notes:v})} rows={2}/></LabelInput>
          <Btn t={t} onClick={addExam}>Add Exam ➕</Btn>
        </Card>
        <div>
          {exams.length===0&&<Card t={t}><div style={{textAlign:"center",color:t.textSub,padding:30}}><div style={{fontSize:46}}>📝</div><p style={{fontWeight:700,marginTop:9,fontSize:13}}>No exams planned yet!</p></div></Card>}
          {sorted.map(exam => { const days=getDays(exam.date),prog=getProg(exam),urgent=days<=3&&days>=0,past=days<0; return (
            <Card t={t} key={exam.id} style={{marginBottom:13,border:`1.5px solid ${urgent?"#f59e0b44":past?"#6b728044":t.cardBorder}`}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10,flexWrap:"wrap"}}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                    <h3 style={{color:t.text,fontWeight:900,fontSize:"clamp(13px,3vw,16px)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{exam.subject}</h3>
                    {urgent&&<Badge color="#f59e0b">{days===0?"Today!":days===1?"Tomorrow":`${days} days`}</Badge>}
                    {past&&<Badge color="#6b7280">Completed</Badge>}
                  </div>
                  <div style={{color:t.textSub,fontSize:11,fontWeight:600,marginTop:2}}>📅 {exam.date}{!past&&!urgent&&<span> · {days} days left</span>}</div>
                </div>
                <div style={{textAlign:"center",padding:"7px 12px",borderRadius:11,background:`${prog===100?"#10b981":"#6366f1"}22`,border:`1.5px solid ${prog===100?"#10b98144":"#6366f144"}`,flexShrink:0}}><div style={{fontSize:18,fontWeight:900,color:prog===100?"#10b981":"#6366f1"}}>{prog}%</div><div style={{fontSize:10,fontWeight:700,color:t.textSub}}>ready</div></div>
                <button onClick={()=>setSelected(selected===exam.id?null:exam.id)} style={{padding:"7px 12px",borderRadius:10,background:selected===exam.id?t.btnGrad:t.tag,color:selected===exam.id?"white":t.textSub,fontWeight:800,fontSize:12,fontFamily:"Nunito,sans-serif"}}>📋 Topics</button>
                <button onClick={()=>persist(exams.filter(x=>x.id!==exam.id))} style={{background:"none",color:"#ef444466",fontSize:15,padding:2,flexShrink:0}}>🗑️</button>
              </div>
              <div style={{height:7,background:t.tag,borderRadius:99,overflow:"hidden",marginBottom:6}}><div style={{height:"100%",width:`${prog}%`,background:prog===100?"#10b981":"linear-gradient(90deg,#6366f1,#8b5cf6)",borderRadius:99,transition:"width 0.6s ease"}}/></div>
              {exam.notes&&<div style={{fontSize:12,fontWeight:600,color:t.textSub,marginBottom:6}}>📌 {exam.notes}</div>}
              {selected===exam.id&&(
                <div style={{marginTop:11,animation:"fadeIn 0.22s ease"}}>
                  <div style={{display:"flex",gap:7,marginBottom:11}}>
                    <input value={newTopic} onChange={e=>setNewTopic(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")addTopic(exam.id);}} placeholder="Add topic & press Enter…" style={{flex:1,padding:"8px 12px",borderRadius:9,background:t.input,border:`1.5px solid ${t.inputBorder}`,color:t.text,fontWeight:600,fontSize:12,fontFamily:"Nunito,sans-serif"}}/>
                    <button onClick={()=>addTopic(exam.id)} style={{padding:"8px 14px",borderRadius:9,background:t.btnGrad,color:"white",fontWeight:800,fontSize:14}}>+</button>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(min(175px,100%),1fr))",gap:7}}>
                    {exam.topics.map((tp,ti) => (
                      <div key={ti} onClick={()=>togTopic(exam.id,ti)} style={{display:"flex",alignItems:"center",gap:8,padding:"9px 12px",borderRadius:10,background:tp.done?`${t.accent}18`:t.tag,border:`1.5px solid ${tp.done?t.accent+"44":t.cardBorder}`,cursor:"pointer",transition:"all 0.18s"}}>
                        <div style={{width:20,height:20,borderRadius:6,border:`2px solid ${tp.done?t.accent:t.inputBorder}`,background:tp.done?t.accent:"transparent",color:"white",fontSize:11,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>{tp.done?"✓":""}</div>
                        <span style={{color:tp.done?t.textSub:t.text,fontWeight:600,fontSize:12,textDecoration:tp.done?"line-through":"none",flex:1}}>{tp.text}</span>
                        {tp.done&&<span style={{fontSize:13}}>🌟</span>}
                      </div>
                    ))}
                    {exam.topics.length===0&&<div style={{color:t.textSub,padding:10,fontSize:12}}>No topics. Add above!</div>}
                  </div>
                </div>
              )}
            </Card>
          );})}
        </div>
      </div>
    </div>
  );
}
