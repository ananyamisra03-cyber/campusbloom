import { useState } from "react";
import { Card, FInput, Btn, PH, DatePicker, DateButton, LabelInput, SelectInput, TextArea } from "../components/ui";

export function Studies({ t, userData, saveKey, notify }) {
  const [subjects,  setSubjects]  = useState(userData?.studiesSubjects || []);
  const [revisions, setRevisions] = useState(userData?.revisions       || []);
  const [view,      setView]      = useState(null);
  const [nsf,       setNsf]       = useState({ name:"", emoji:"📘", color:"#8b5cf6" });
  const [nmf,       setNmf]       = useState({ num:"", name:"" });
  const [npt,       setNpt]       = useState("");
  const [stTab,     setStTab]     = useState("subjects");
  const sC = ["#8b5cf6","#3b82f6","#10b981","#f59e0b","#ec4899","#06b6d4","#f97316"];
  const sE = ["📐","⚡","🧪","📖","🌍","💻","🎨","🏛️"];

  const persist    = async v => { setSubjects(v);  await saveKey("studiesSubjects", v); };
  const persistRev = async v => { setRevisions(v); await saveKey("revisions", v); };

  const cur  = view?.subjectId ? subjects.find(s => s.id === view.subjectId) : null;
  const curM = view?.moduleId  ? cur?.modules.find(m => m.id === view.moduleId)  : null;

  const addSub = () => { if (!nsf.name) return; persist([...subjects, { id: Date.now(), name: nsf.name, color: nsf.color, emoji: nsf.emoji, modules: [] }]); setNsf({ name:"", emoji:"📘", color:"#8b5cf6" }); notify("Subject added! 🎓"); };
  const addMod = () => { if (!nmf.name || !view?.subjectId) return; persist(subjects.map(s => s.id === view.subjectId ? { ...s, modules: [...s.modules, { id: Date.now(), num: Number(nmf.num) || s.modules.length + 1, name: nmf.name, points: [] }] } : s)); setNmf({ num:"", name:"" }); notify("Module added!"); };
  const addPt  = () => { if (!npt || !view?.subjectId || !view?.moduleId) return; persist(subjects.map(s => s.id === view.subjectId ? { ...s, modules: s.modules.map(m => m.id === view.moduleId ? { ...m, points: [...m.points, { id: Date.now(), text: npt, done: false }] } : m) } : s)); setNpt(""); };
  const togPt  = pid => persist(subjects.map(s => s.id === view.subjectId ? { ...s, modules: s.modules.map(m => m.id === view.moduleId ? { ...m, points: m.points.map(p => p.id === pid ? { ...p, done: !p.done } : p) } : m) } : s));
  const delPt  = pid => persist(subjects.map(s => s.id === view.subjectId ? { ...s, modules: s.modules.map(m => m.id === view.moduleId ? { ...m, points: m.points.filter(p => p.id !== pid) } : m) } : s));
  const gMP = mod => mod.points.length === 0 ? 0 : Math.round((mod.points.filter(p => p.done).length / mod.points.length) * 100);
  const gSP = sub => { const ap = sub.modules.flatMap(m => m.points); return ap.length === 0 ? 0 : Math.round((ap.filter(p => p.done).length / ap.length) * 100); };

  const Breadcrumb = () => (
    <div style={{ display:"flex",alignItems:"center",gap:7,marginBottom:16,flexWrap:"wrap" }}>
      <button onClick={() => setView(null)} style={{ background:"none",color:view===null?t.accent:t.textSub,fontWeight:800,fontSize:13,padding:"3px 7px",borderRadius:7,fontFamily:"Nunito,sans-serif" }}>📚 Subjects</button>
      {view?.subjectId && <><span style={{color:t.textSub}}>›</span><button onClick={() => setView({ subjectId: view.subjectId })} style={{ background:"none",color:!view?.moduleId?t.accent:t.textSub,fontWeight:800,fontSize:13,padding:"3px 7px",borderRadius:7,fontFamily:"Nunito,sans-serif" }}>{cur?.emoji} {cur?.name}</button></>}
      {view?.moduleId  && <><span style={{color:t.textSub}}>›</span><span style={{ color:t.accent,fontWeight:800,fontSize:13,padding:"3px 7px" }}>Module {curM?.num}: {curM?.name}</span></>}
    </div>
  );

  return (
    <div style={{ animation:"fadeIn 0.45s ease" }}>
      <PH t={t} emoji="📚" title="Studies Planner" sub="Subjects → Modules → Topics 🎯" />
      <div style={{ display:"flex",gap:8,marginBottom:18,flexWrap:"wrap" }}>
        {[["subjects","📚","My Subjects"],["revision","🔁","Revision"]].map(([id,emoji,lbl]) => (
          <button key={id} onClick={() => setStTab(id)} style={{ padding:"8px 18px",borderRadius:11,fontWeight:800,fontSize:13,background:stTab===id?t.btnGrad:t.tag,color:stTab===id?"white":t.textSub,border:"none",fontFamily:"Nunito,sans-serif" }}>{emoji} {lbl}</button>
        ))}
      </div>

      {stTab === "revision" ? (
        <RevisionSection t={t} subjects={subjects} revisions={revisions} persistRev={persistRev} notify={notify} />
      ) : (
        <>
          <Breadcrumb />
          {/* Level 1: Subject list */}
          {!view && (
            <div style={{ display:"grid",gridTemplateColumns:"clamp(240px,28%,265px) 1fr",gap:"clamp(10px,2vw,18px)" }}>
              <Card t={t}>
                <h3 style={{color:t.text,fontWeight:800,marginBottom:12,fontSize:14}}>➕ Add Subject</h3>
                <FInput t={t} placeholder="Subject name" value={nsf.name} onChange={v=>setNsf({...nsf,name:v})}/>
                <LabelInput t={t} label="Emoji"><div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{sE.map(e=><button key={e} onClick={()=>setNsf({...nsf,emoji:e})} style={{fontSize:19,padding:4,borderRadius:8,background:nsf.emoji===e?t.tag:"transparent",border:`2px solid ${nsf.emoji===e?t.accent:"transparent"}`}}>{e}</button>)}</div></LabelInput>
                <LabelInput t={t} label="Color"><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{sC.map(c=><button key={c} onClick={()=>setNsf({...nsf,color:c})} style={{width:22,height:22,borderRadius:"50%",background:c,border:`3px solid ${nsf.color===c?t.text:"transparent"}`}}/>)}</div></LabelInput>
                <Btn t={t} onClick={addSub}>Add Subject ➕</Btn>
              </Card>
              <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(min(185px,100%),1fr))",gap:11,alignContent:"start" }}>
                {subjects.length === 0 && <div style={{color:t.textSub,fontWeight:700,padding:16,fontSize:13}}>No subjects yet. Add your first! 🎓</div>}
                {subjects.map((sub, i) => { const prog = gSP(sub); return (
                  <button key={sub.id} onClick={() => setView({ subjectId: sub.id })} style={{ background:t.card,border:`1.5px solid ${sub.color}33`,borderRadius:16,padding:"clamp(14px,3vw,18px)",textAlign:"left",cursor:"pointer",backdropFilter:"blur(14px)",boxShadow:t.shadow,transition:"transform 0.2s",animation:`popIn 0.38s ease ${i*0.07}s both`,fontFamily:"Nunito,sans-serif" }} onMouseEnter={e=>e.currentTarget.style.transform="translateY(-3px)"} onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
                    <div style={{fontSize:"clamp(28px,6vw,36px)",marginBottom:8}}>{sub.emoji}</div>
                    <div style={{color:t.text,fontWeight:800,fontSize:"clamp(13px,2.5vw,15px)",marginBottom:3}}>{sub.name}</div>
                    <div style={{color:t.textSub,fontSize:11,marginBottom:9}}>{sub.modules.length} modules</div>
                    <div style={{height:6,background:t.tag,borderRadius:99,overflow:"hidden",marginBottom:4}}><div style={{height:"100%",width:`${prog}%`,background:sub.color,borderRadius:99}}/></div>
                    <div style={{color:sub.color,fontSize:11,fontWeight:800}}>{prog}% complete</div>
                  </button>
                );})}
              </div>
            </div>
          )}

          {/* Level 2: Module list */}
          {view?.subjectId && !view?.moduleId && cur && (
            <div style={{ display:"grid",gridTemplateColumns:"clamp(240px,28%,265px) 1fr",gap:"clamp(10px,2vw,18px)" }}>
              <Card t={t}>
                <h3 style={{color:t.text,fontWeight:800,marginBottom:12,fontSize:14}}>➕ Add Module</h3>
                <FInput t={t} placeholder="Module number" type="number" value={nmf.num} onChange={v=>setNmf({...nmf,num:v})}/>
                <FInput t={t} placeholder="Module name" value={nmf.name} onChange={v=>setNmf({...nmf,name:v})}/>
                <Btn t={t} onClick={addMod}>Add Module ➕</Btn>
                <div style={{marginTop:12,padding:11,background:t.tag,borderRadius:11}}><div style={{color:t.textSub,fontWeight:700,fontSize:11}}>Subject Progress</div><div style={{color:cur.color,fontWeight:900,fontSize:20,marginTop:2}}>{gSP(cur)}%</div><div style={{height:5,background:t.cardBorder,borderRadius:99,marginTop:6,overflow:"hidden"}}><div style={{height:"100%",width:`${gSP(cur)}%`,background:cur.color,borderRadius:99}}/></div></div>
              </Card>
              <div>
                {cur.modules.length === 0 && <Card t={t}><div style={{textAlign:"center",color:t.textSub,padding:24,fontSize:13}}>No modules yet! Add your first.</div></Card>}
                {cur.modules.map((mod, i) => { const prog = gMP(mod); const done = mod.points.filter(p => p.done).length; return (
                  <button key={mod.id} onClick={() => setView({ subjectId: view.subjectId, moduleId: mod.id })} style={{ width:"100%",background:t.card,border:`1.5px solid ${t.cardBorder}`,borderRadius:14,padding:"clamp(12px,3vw,16px)",textAlign:"left",cursor:"pointer",marginBottom:9,backdropFilter:"blur(14px)",transition:"all 0.2s",display:"flex",alignItems:"center",gap:12,animation:`popIn 0.38s ease ${i*0.07}s both`,fontFamily:"Nunito,sans-serif" }} onMouseEnter={e=>e.currentTarget.style.transform="translateX(4px)"} onMouseLeave={e=>e.currentTarget.style.transform="translateX(0)"}>
                    <div style={{width:46,height:46,borderRadius:13,background:`${cur.color}22`,border:`2px solid ${cur.color}44`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{color:cur.color,fontWeight:900,fontSize:9}}>MOD</span><span style={{color:cur.color,fontWeight:900,fontSize:18,lineHeight:1}}>{mod.num}</span></div>
                    <div style={{flex:1,minWidth:0}}><div style={{color:t.text,fontWeight:800,fontSize:13,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{mod.name}</div><div style={{color:t.textSub,fontSize:11,marginTop:2}}>{done}/{mod.points.length} topics done</div><div style={{height:5,background:t.tag,borderRadius:99,marginTop:6,overflow:"hidden"}}><div style={{height:"100%",width:`${prog}%`,background:cur.color,borderRadius:99}}/></div></div>
                    <div style={{color:prog===100?"#10b981":t.accent,fontWeight:900,fontSize:16,flexShrink:0}}>{prog===100?"✅":`${prog}%`}</div>
                    <span style={{color:t.textSub,fontSize:16,flexShrink:0}}>›</span>
                  </button>
                );})}
              </div>
            </div>
          )}

          {/* Level 3: Points checklist */}
          {view?.subjectId && view?.moduleId && curM && (
            <div style={{ display:"grid",gridTemplateColumns:"1fr clamp(215px,26%,255px)",gap:"clamp(10px,2vw,18px)" }}>
              <Card t={t}>
                <div style={{display:"flex",alignItems:"center",gap:11,marginBottom:16,paddingBottom:13,borderBottom:`1px solid ${t.cardBorder}`,flexWrap:"wrap"}}>
                  <div style={{width:48,height:48,borderRadius:14,background:`${cur.color}22`,border:`2px solid ${cur.color}44`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{color:cur.color,fontWeight:900,fontSize:9}}>MOD</span><span style={{color:cur.color,fontWeight:900,fontSize:19,lineHeight:1}}>{curM.num}</span></div>
                  <div><div style={{color:t.text,fontWeight:900,fontSize:16}}>{curM.name}</div><div style={{color:t.textSub,fontSize:12}}>{cur.name} · {curM.points.filter(p=>p.done).length}/{curM.points.length} done</div></div>
                </div>
                <div style={{display:"flex",gap:8,marginBottom:16}}>
                  <input value={npt} onChange={e=>setNpt(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addPt()} placeholder="Add a topic or concept… ✏️" style={{flex:1,padding:"10px 13px",borderRadius:10,background:t.input,border:`1.5px solid ${t.inputBorder}`,color:t.text,fontWeight:600,fontSize:13,fontFamily:"Nunito,sans-serif"}}/>
                  <button onClick={addPt} style={{padding:"10px 16px",borderRadius:10,background:t.btnGrad,color:"white",fontWeight:800,fontSize:16}}>+</button>
                </div>
                {curM.points.length === 0 && <div style={{textAlign:"center",color:t.textSub,padding:24,fontSize:13}}>No topics yet. Add above! ☝️</div>}
                {curM.points.map((p, i) => (
                  <div key={p.id} style={{ display:"flex",alignItems:"center",gap:11,padding:"11px 12px",marginBottom:6,borderRadius:12,background:p.done?`${cur.color}11`:t.tag,border:`1.5px solid ${p.done?cur.color+"44":t.cardBorder}`,transition:"all 0.18s",animation:`fadeIn 0.3s ease ${i*0.04}s both` }}>
                    <button onClick={() => togPt(p.id)} style={{ width:25,height:25,borderRadius:8,border:`2px solid ${p.done?cur.color:t.inputBorder}`,background:p.done?cur.color:"transparent",color:"white",fontSize:12,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center" }}>{p.done?"✓":""}</button>
                    <span style={{ flex:1,color:p.done?t.textSub:t.text,fontWeight:600,fontSize:13,textDecoration:p.done?"line-through":"none" }}>{p.text}</span>
                    {p.done && <span style={{fontSize:14}}>🌟</span>}
                    <button onClick={() => delPt(p.id)} style={{background:"none",color:"#ef4444",fontSize:14,opacity:.5,padding:2}}>✕</button>
                  </div>
                ))}
              </Card>
              <div>
                <Card t={t} style={{marginBottom:12}}>
                  <h4 style={{color:t.text,fontWeight:800,marginBottom:11,fontSize:13}}>📊 Progress</h4>
                  <div style={{textAlign:"center",marginBottom:11}}>
                    <div style={{fontSize:"clamp(32px,6vw,38px)",fontWeight:900,color:cur.color}}>{gMP(curM)}%</div>
                    <div style={{color:t.textSub,fontSize:11,fontWeight:700}}>{curM.points.filter(p=>p.done).length} of {curM.points.length}</div>
                  </div>
                  <div style={{height:8,background:t.tag,borderRadius:99,overflow:"hidden"}}><div style={{height:"100%",width:`${gMP(curM)}%`,background:cur.color,borderRadius:99,transition:"width 0.5s ease"}}/></div>
                  {gMP(curM)===100&&<div style={{marginTop:11,textAlign:"center",fontSize:12,fontWeight:800,color:"#10b981"}}>🎉 Complete!</div>}
                </Card>
                <Card t={t}>
                  <h4 style={{color:t.text,fontWeight:800,marginBottom:10,fontSize:13}}>📋 All Modules</h4>
                  {cur.modules.map(m => (
                    <div key={m.id} onClick={() => setView({ subjectId: view.subjectId, moduleId: m.id })} style={{ display:"flex",alignItems:"center",gap:8,padding:"7px 0",borderBottom:`1px solid ${t.cardBorder}`,cursor:"pointer" }}>
                      <span style={{color:cur.color,fontWeight:900,fontSize:11,minWidth:22}}>M{m.num}</span>
                      <span style={{flex:1,color:m.id===curM.id?t.accent:t.text,fontWeight:700,fontSize:12,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.name}</span>
                      <span style={{color:gMP(m)===100?"#10b981":t.textSub,fontSize:10,fontWeight:800,flexShrink:0}}>{gMP(m)===100?"✅":`${gMP(m)}%`}</span>
                    </div>
                  ))}
                </Card>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function RevisionSection({ t, subjects, revisions, persistRev, notify }) {
  const [form,   setForm]   = useState({ subjectId:"",moduleId:"",topic:"",due:"",notes:"" });
  const [showDP, setShowDP] = useState(false);
  const sts = { pending:{l:"Pending",c:"#f59e0b",e:"⏳"},inprogress:{l:"In Progress",c:"#3b82f6",e:"📖"},done:{l:"Done",c:"#10b981",e:"✅"},needswork:{l:"Needs Work",c:"#ef4444",e:"⚠️"} };
  const selM = form.subjectId ? subjects.find(s => s.id === Number(form.subjectId))?.modules || [] : [];
  const add  = () => { if (!form.topic || !form.subjectId) return; persistRev([...revisions, { ...form, id: Date.now(), subjectId: Number(form.subjectId), moduleId: Number(form.moduleId), status: "pending" }]); setForm({ subjectId:"",moduleId:"",topic:"",due:"",notes:"" }); notify("Revision added!"); };
  const cycle = id => { const o = ["pending","inprogress","done","needswork"]; persistRev(revisions.map(r => r.id === id ? { ...r, status: o[(o.indexOf(r.status)+1) % o.length] } : r)); };
  const counts = Object.keys(sts).reduce((a, k) => ({ ...a, [k]: revisions.filter(r => r.status === k).length }), {});
  return (
    <div>
      {showDP && <DatePicker t={t} value={form.due} onChange={v=>setForm({...form,due:v})} onClose={()=>setShowDP(false)}/>}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(105px,100%),1fr))",gap:10,marginBottom:18}}>
        {Object.entries(sts).map(([k,s]) => <div key={k} style={{background:t.card,border:`1.5px solid ${s.c}44`,borderRadius:13,padding:"10px 12px",textAlign:"center",backdropFilter:"blur(12px)"}}><div style={{fontSize:20}}>{s.e}</div><div style={{fontSize:"clamp(16px,4vw,20px)",fontWeight:900,color:s.c,marginTop:2}}>{counts[k]||0}</div><div style={{color:t.textSub,fontSize:9,fontWeight:700}}>{s.l}</div></div>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"clamp(240px,28%,265px) 1fr",gap:"clamp(10px,2vw,18px)"}}>
        <Card t={t}>
          <h3 style={{color:t.text,fontWeight:800,marginBottom:12,fontSize:14}}>🔁 Add Revision</h3>
          <LabelInput t={t} label="Subject"><SelectInput t={t} value={form.subjectId} onChange={v=>setForm({...form,subjectId:v,moduleId:""})}><option value="">Select…</option>{subjects.map(s=><option key={s.id} value={s.id}>{s.emoji} {s.name}</option>)}</SelectInput></LabelInput>
          {selM.length>0&&<LabelInput t={t} label="Module"><SelectInput t={t} value={form.moduleId} onChange={v=>setForm({...form,moduleId:v})}><option value="">Select…</option>{selM.map(m=><option key={m.id} value={m.id}>M{m.num}: {m.name}</option>)}</SelectInput></LabelInput>}
          <FInput t={t} placeholder="Topic to revise" value={form.topic} onChange={v=>setForm({...form,topic:v})}/>
          <LabelInput t={t} label="Due Date"><DateButton t={t} value={form.due} onClick={()=>setShowDP(true)}/></LabelInput>
          <LabelInput t={t} label="Notes"><TextArea t={t} value={form.notes} onChange={v=>setForm({...form,notes:v})} rows={2}/></LabelInput>
          <Btn t={t} onClick={add}>Add ➕</Btn>
        </Card>
        <Card t={t}>
          <h3 style={{color:t.text,fontWeight:800,marginBottom:12,fontSize:14}}>Revision List</h3>
          {revisions.length===0&&<div style={{textAlign:"center",color:t.textSub,padding:20,fontSize:13}}>No revisions yet 📖</div>}
          {revisions.map(r=>{const s=sts[r.status];const sub=subjects.find(sb=>sb.id===r.subjectId);return(
            <div key={r.id} style={{display:"flex",gap:11,alignItems:"flex-start",padding:"11px 0",borderBottom:`1px solid ${t.cardBorder}`}}>
              <div style={{width:36,height:36,borderRadius:10,background:`${s.c}22`,border:`2px solid ${s.c}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{s.e}</div>
              <div style={{flex:1,minWidth:0}}><div style={{color:t.text,fontWeight:800,fontSize:13,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.topic}</div><div style={{color:t.textSub,fontSize:11,marginTop:2}}>{sub?.emoji} {sub?.name||"—"}</div>{r.due&&<div style={{color:t.textSub,fontSize:10,marginTop:2}}>📅 {r.due}</div>}</div>
              <div style={{display:"flex",flexDirection:"column",gap:4,alignItems:"flex-end"}}>
                <button onClick={()=>cycle(r.id)} style={{padding:"4px 10px",borderRadius:99,background:`${s.c}22`,border:`1.5px solid ${s.c}55`,color:s.c,fontWeight:800,fontSize:10,whiteSpace:"nowrap",fontFamily:"Nunito,sans-serif"}}>{s.l} ↻</button>
                <button onClick={()=>persistRev(revisions.filter(x=>x.id!==r.id))} style={{background:"none",color:"#ef444466",fontSize:14}}>🗑️</button>
              </div>
            </div>
          );})}
        </Card>
      </div>
    </div>
  );
}
