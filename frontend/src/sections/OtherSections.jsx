import { useState } from "react";
import { Card, FInput, Btn, PH, Badge, LabelInput, SelectInput, TextArea, DatePicker, DateButton } from "../components/ui";
import { STATUS_STYLES, STORE_ITEMS, RARITY_COLORS, getThemeBg } from "../utils/themes";

// ─── INTERNSHIPS ──────────────────────────────────────────────────────────────
export function Internships({ t, userData, saveKey, notify }) {
  const [apps,  setApps]  = useState(userData?.internships || []);
  const [form,  setForm]  = useState({ company:"", role:"", type:"Internship", deadline:"", link:"", notes:"", status:"applied" });
  const [showDP,setShowDP]= useState(false);
  const [filter,setFilter]= useState("all");
  const today = new Date().toISOString().slice(0, 10);
  const persist = async v => { setApps(v); await saveKey("internships", v); };
  const add = () => { if (!form.company||!form.role) return; persist([...apps,{...form,id:Date.now(),appliedDate:today}]); setForm({company:"",role:"",type:"Internship",deadline:"",link:"",notes:"",status:"applied"}); notify("Application added! 💼"); };
  const setStatus = (id,status) => persist(apps.map(a=>a.id===id?{...a,status}:a));
  const filtered = filter==="all"?apps:apps.filter(a=>a.status===filter);
  const counts = Object.keys(STATUS_STYLES).reduce((acc,k)=>({...acc,[k]:apps.filter(a=>a.status===k).length}),{});
  return (
    <div style={{ animation:"fadeIn 0.45s ease" }}>
      {showDP&&<DatePicker t={t} value={form.deadline} onChange={v=>setForm({...form,deadline:v})} onClose={()=>setShowDP(false)}/>}
      <PH t={t} emoji="💼" title="Internship & Placement Tracker" sub="Track every application, deadline & status 🎯"/>
      {/* Status stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(88px,100%),1fr))",gap:9,marginBottom:18}}>
        {Object.entries(STATUS_STYLES).map(([k,s])=>(
          <button key={k} onClick={()=>setFilter(filter===k?"all":k)} style={{background:filter===k?`${s.color}22`:t.card,border:`1.5px solid ${filter===k?s.color+"55":t.cardBorder}`,borderRadius:13,padding:"10px 11px",textAlign:"center",backdropFilter:"blur(12px)",cursor:"pointer",transition:"all 0.18s",fontFamily:"Nunito,sans-serif"}}>
            <div style={{fontSize:18}}>{s.emoji}</div>
            <div style={{fontSize:"clamp(16px,4vw,20px)",fontWeight:900,color:s.color,marginTop:2}}>{counts[k]||0}</div>
            <div style={{color:t.textSub,fontSize:9,fontWeight:700,marginTop:1}}>{s.label}</div>
          </button>
        ))}
      </div>
      {filter!=="all"&&<div style={{marginBottom:14,padding:"8px 14px",background:t.tag,borderRadius:11,display:"flex",alignItems:"center",gap:9}}><span style={{color:t.textSub,fontSize:12,fontWeight:700}}>Showing: {STATUS_STYLES[filter].label}</span><button onClick={()=>setFilter("all")} style={{background:"none",color:t.accent,fontWeight:800,fontSize:12,fontFamily:"Nunito,sans-serif"}}>✕ Clear</button></div>}
      <div style={{display:"grid",gridTemplateColumns:"clamp(250px,30%,285px) 1fr",gap:"clamp(10px,2vw,18px)"}}>
        <Card t={t}>
          <h3 style={{color:t.text,fontWeight:800,marginBottom:12,fontSize:14}}>➕ Add Application</h3>
          <FInput t={t} placeholder="Company name" value={form.company} onChange={v=>setForm({...form,company:v})}/>
          <FInput t={t} placeholder="Role / Position" value={form.role} onChange={v=>setForm({...form,role:v})}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
            <LabelInput t={t} label="Type"><SelectInput t={t} value={form.type} onChange={v=>setForm({...form,type:v})}>{["Internship","Full-time","Contract","Part-time","Freelance"].map(o=><option key={o} value={o}>{o}</option>)}</SelectInput></LabelInput>
            <LabelInput t={t} label="Status"><SelectInput t={t} value={form.status} onChange={v=>setForm({...form,status:v})}>{Object.entries(STATUS_STYLES).map(([k,s])=><option key={k} value={k}>{s.emoji} {s.label}</option>)}</SelectInput></LabelInput>
          </div>
          <LabelInput t={t} label="📅 Deadline"><DateButton t={t} value={form.deadline} onClick={()=>setShowDP(true)} placeholder="Pick deadline…"/></LabelInput>
          <FInput t={t} placeholder="Job link (optional)" value={form.link} onChange={v=>setForm({...form,link:v})}/>
          <LabelInput t={t} label="Notes"><TextArea t={t} value={form.notes} onChange={v=>setForm({...form,notes:v})} rows={2}/></LabelInput>
          <Btn t={t} onClick={add}>Add Application ➕</Btn>
        </Card>
        <div>
          {filtered.length===0&&<Card t={t}><div style={{textAlign:"center",color:t.textSub,padding:30}}><div style={{fontSize:46}}>💼</div><p style={{fontWeight:700,marginTop:9,fontSize:13}}>{filter==="all"?"No applications yet. Start applying!":"No applications with this status."}</p></div></Card>}
          {filtered.map(app=>{
            const s=STATUS_STYLES[app.status];
            const daysLeft=app.deadline?Math.ceil((new Date(app.deadline)-new Date(today))/86400000):null;
            return(
              <Card t={t} key={app.id} style={{marginBottom:12}}>
                <div style={{display:"flex",alignItems:"flex-start",gap:11,flexWrap:"wrap"}}>
                  <div style={{width:42,height:42,borderRadius:12,background:`${s.color}22`,border:`2px solid ${s.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{s.emoji}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:4}}>
                      <span style={{color:t.text,fontWeight:900,fontSize:"clamp(13px,3vw,15px)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{app.company}</span>
                      <Badge color="#6b7280">{app.type}</Badge>
                    </div>
                    <div style={{color:t.textSub,fontWeight:700,fontSize:12,marginBottom:5}}>{app.role}</div>
                    <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
                      {app.deadline&&<span style={{fontSize:11,fontWeight:700,color:daysLeft!==null&&daysLeft<=3&&daysLeft>=0?"#f59e0b":t.textSub}}>📅 {app.deadline}{daysLeft!==null&&daysLeft<=3&&daysLeft>=0&&<span style={{color:"#f59e0b"}}> · {daysLeft===0?"Today!":daysLeft===1?"Tomorrow":`${daysLeft}d`}</span>}</span>}
                      {app.link&&<a href={app.link} target="_blank" rel="noreferrer" style={{fontSize:11,color:t.accent,fontWeight:700}} onClick={e=>e.stopPropagation()}>🔗 Link</a>}
                    </div>
                    {app.notes&&<div style={{color:t.textSub,fontSize:11,marginTop:5,fontStyle:"italic"}}>📌 {app.notes}</div>}
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:5,alignItems:"flex-end",flexShrink:0}}>
                    <select value={app.status} onChange={e=>setStatus(app.id,e.target.value)} style={{padding:"5px 10px",borderRadius:99,background:`${s.color}22`,border:`1.5px solid ${s.color}55`,color:s.color,fontWeight:800,fontSize:11,fontFamily:"Nunito,sans-serif"}}>
                      {Object.entries(STATUS_STYLES).map(([k,ss])=><option key={k} value={k}>{ss.emoji} {ss.label}</option>)}
                    </select>
                    <button onClick={()=>persist(apps.filter(x=>x.id!==app.id))} style={{background:"none",color:"#ef444466",fontSize:14}}>🗑️</button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── EXTRACURRICULARS ─────────────────────────────────────────────────────────
export function Extracurriculars({ t, userData, saveKey, notify }) {
  const [activities, setActivities] = useState(userData?.extracurriculars || []);
  const [form,       setForm]       = useState({ name:"", emoji:"🎭", color:"#a855f7" });
  const [selected,   setSelected]   = useState(null);
  const [newEntry,   setNewEntry]   = useState({ title:"", description:"", date: new Date().toISOString().slice(0,10) });
  const [showDP,     setShowDP]     = useState(false);
  const EMOJIS = ["🎭","🎨","🎵","⚽","🏊","🤝","📸","✍️","🎤","🏆","🌍","💻","🎯","🎬"];
  const COLORS  = ["#a855f7","#3b82f6","#10b981","#f59e0b","#ec4899","#06b6d4","#f97316"];
  const persist = async v => { setActivities(v); await saveKey("extracurriculars", v); };
  const addActivity = () => { if (!form.name) return; persist([...activities,{id:Date.now(),name:form.name,emoji:form.emoji,color:form.color,entries:[]}]); setForm({name:"",emoji:"🎭",color:"#a855f7"}); notify("Activity added! 🎭"); };
  const addEntry = id => { if (!newEntry.title.trim()) return; persist(activities.map(a=>a.id===id?{...a,entries:[{...newEntry,id:Date.now()},...a.entries]}:a)); setNewEntry({title:"",description:"",date:new Date().toISOString().slice(0,10)}); notify("Entry added!"); };
  const selAct = activities.find(a => a.id === selected);
  return (
    <div style={{ animation:"fadeIn 0.45s ease" }}>
      {showDP&&<DatePicker t={t} value={newEntry.date} onChange={v=>setNewEntry({...newEntry,date:v})} onClose={()=>setShowDP(false)}/>}
      <PH t={t} emoji="🎭" title="Extracurriculars" sub="Log your activities & achievements 🏆"/>
      <div style={{display:"grid",gridTemplateColumns:"clamp(240px,28%,265px) 1fr",gap:"clamp(10px,2vw,18px)"}}>
        <div>
          <Card t={t} style={{marginBottom:12}}>
            <h3 style={{color:t.text,fontWeight:800,marginBottom:12,fontSize:14}}>➕ Add Activity</h3>
            <FInput t={t} placeholder="Activity name (e.g. Drama Club)" value={form.name} onChange={v=>setForm({...form,name:v})}/>
            <LabelInput t={t} label="Emoji"><div style={{display:"flex",flexWrap:"wrap",gap:4}}>{EMOJIS.map(e=><button key={e} onClick={()=>setForm({...form,emoji:e})} style={{fontSize:18,padding:4,borderRadius:7,background:form.emoji===e?t.tag:"transparent",border:`2px solid ${form.emoji===e?t.accent:"transparent"}`}}>{e}</button>)}</div></LabelInput>
            <LabelInput t={t} label="Color"><div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{COLORS.map(c=><button key={c} onClick={()=>setForm({...form,color:c})} style={{width:21,height:21,borderRadius:"50%",background:c,border:`3px solid ${form.color===c?t.text:"transparent"}`}}/>)}</div></LabelInput>
            <Btn t={t} onClick={addActivity}>Add Activity ➕</Btn>
          </Card>
          <Card t={t}>
            <h3 style={{color:t.text,fontWeight:800,marginBottom:10,fontSize:13}}>My Activities</h3>
            {activities.length===0&&<div style={{color:t.textSub,fontSize:12}}>No activities yet. Add one!</div>}
            {activities.map(a=>(
              <button key={a.id} onClick={()=>setSelected(selected===a.id?null:a.id)} style={{width:"100%",padding:"10px 12px",borderRadius:11,background:selected===a.id?`${a.color}22`:t.tag,border:`1.5px solid ${selected===a.id?a.color+"55":t.cardBorder}`,marginBottom:7,textAlign:"left",display:"flex",alignItems:"center",gap:9,transition:"all 0.18s",fontFamily:"Nunito,sans-serif"}}>
                <span style={{fontSize:20,flexShrink:0}}>{a.emoji}</span>
                <div style={{flex:1,minWidth:0}}><div style={{color:t.text,fontWeight:800,fontSize:13,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.name}</div><div style={{color:t.textSub,fontSize:10,marginTop:2}}>{a.entries.length} log{a.entries.length!==1?"s":""}</div></div>
                <button onClick={e=>{e.stopPropagation();persist(activities.filter(x=>x.id!==a.id));if(selected===a.id)setSelected(null);}} style={{background:"none",color:"#ef444466",fontSize:14,flexShrink:0}}>🗑️</button>
              </button>
            ))}
          </Card>
        </div>
        <div>
          {!selected ? (
            <Card t={t}><div style={{textAlign:"center",color:t.textSub,padding:40}}><div style={{fontSize:52}}>🎭</div><p style={{fontWeight:700,marginTop:10,fontSize:13}}>Select an activity to view & log progress</p></div></Card>
          ) : selAct ? (
            <Card t={t}>
              <div style={{display:"flex",alignItems:"center",gap:11,marginBottom:18,paddingBottom:14,borderBottom:`1px solid ${t.cardBorder}`,flexWrap:"wrap"}}>
                <div style={{width:42,height:42,borderRadius:12,background:`${selAct.color}22`,border:`2px solid ${selAct.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{selAct.emoji}</div>
                <div style={{flex:1}}><div style={{color:t.text,fontWeight:900,fontSize:16}}>{selAct.name}</div><div style={{color:t.textSub,fontSize:11,marginTop:2}}>{selAct.entries.length} log{selAct.entries.length!==1?"s":""}</div></div>
              </div>
              {/* Add entry form */}
              <div style={{background:t.tag,borderRadius:13,padding:"clamp(12px,3vw,16px)",marginBottom:18}}>
                <h4 style={{color:t.text,fontWeight:800,marginBottom:11,fontSize:13}}>📝 Log New Achievement</h4>
                <FInput t={t} placeholder="Achievement title (e.g. Won inter-college debate)" value={newEntry.title} onChange={v=>setNewEntry({...newEntry,title:v})}/>
                <TextArea t={t} value={newEntry.description} onChange={v=>setNewEntry({...newEntry,description:v})} placeholder="Describe what you did, what you learned, any awards received…" rows={3}/>
                <div style={{display:"flex",gap:9,alignItems:"center",flexWrap:"wrap",marginTop:8}}>
                  <button onClick={()=>setShowDP(true)} style={{padding:"8px 13px",borderRadius:9,background:t.input,border:`1.5px solid ${t.inputBorder}`,color:t.text,fontWeight:700,fontSize:12,fontFamily:"Nunito,sans-serif"}}>📅 {newEntry.date}</button>
                  <Btn t={t} onClick={()=>addEntry(selAct.id)} small>Add Log ➕</Btn>
                </div>
              </div>
              {/* Timeline */}
              {selAct.entries.length===0&&<div style={{textAlign:"center",color:t.textSub,padding:20,fontSize:12}}>No logs yet. Add your first achievement above! 🌟</div>}
              {selAct.entries.map((entry,i)=>(
                <div key={entry.id} style={{display:"flex",gap:12,marginBottom:14,animation:`fadeIn 0.3s ease ${i*0.05}s both`}}>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"center",flexShrink:0}}>
                    <div style={{width:12,height:12,borderRadius:"50%",background:selAct.color,marginTop:4}}/>
                    {i<selAct.entries.length-1&&<div style={{width:2,flex:1,background:`${selAct.color}33`,marginTop:4}}/>}
                  </div>
                  <div style={{flex:1,background:t.tag,borderRadius:13,padding:"12px 14px",marginBottom:4}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8,flexWrap:"wrap"}}>
                      <div style={{color:t.text,fontWeight:800,fontSize:13}}>{entry.title}</div>
                      <div style={{display:"flex",gap:6,alignItems:"center",flexShrink:0}}>
                        <span style={{color:t.textSub,fontSize:10,fontWeight:700}}>📅 {entry.date}</span>
                        <button onClick={()=>persist(activities.map(a=>a.id===selAct.id?{...a,entries:a.entries.filter(e=>e.id!==entry.id)}:a))} style={{background:"none",color:"#ef444466",fontSize:13}}>🗑️</button>
                      </div>
                    </div>
                    {entry.description&&<p style={{color:t.textSub,fontSize:12,fontWeight:600,marginTop:6,lineHeight:1.6}}>{entry.description}</p>}
                  </div>
                </div>
              ))}
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}

// ─── MATERIALS ────────────────────────────────────────────────────────────────
export function Materials({ t, userData, saveKey, notify }) {
  const [subjects,setSubjects]=useState(userData?.materials||[]);
  const [ns,setNs]=useState(""); const [sel,setSel]=useState(null); const [nf,setNf]=useState("");
  const persist=async v=>{setSubjects(v);await saveKey("materials",v);};
  const fi=tp=>({pdf:"📕",doc:"📘",docx:"📘",ppt:"📙",pptx:"📙",jpg:"🖼️",png:"🖼️",mp4:"🎬",xlsx:"📗",csv:"📊"}[tp]||"📄");
  return(
    <div style={{animation:"fadeIn 0.45s ease"}}>
      <PH t={t} emoji="📁" title="Study Materials" sub="Your digital library 🗂️"/>
      <div style={{display:"grid",gridTemplateColumns:"clamp(220px,26%,245px) 1fr",gap:"clamp(10px,2vw,18px)"}}>
        <div>
          <Card t={t} style={{marginBottom:12}}>
            <h3 style={{color:t.text,fontWeight:800,marginBottom:10,fontSize:14}}>Add Subject</h3>
            <FInput t={t} placeholder="Subject name" value={ns} onChange={setNs}/>
            <Btn t={t} onClick={()=>{if(!ns)return;persist([...subjects,{id:Date.now(),name:ns,files:[]}]);setNs("");notify("Subject added!");}}>Add ➕</Btn>
          </Card>
          <Card t={t}>
            <h3 style={{color:t.text,fontWeight:800,marginBottom:10,fontSize:13}}>Subjects</h3>
            {subjects.length===0&&<div style={{color:t.textSub,fontSize:12}}>No subjects yet.</div>}
            {subjects.map(s=>(
              <button key={s.id} onClick={()=>setSel(s.id)} style={{width:"100%",padding:"10px 12px",borderRadius:10,background:sel===s.id?t.btnGrad:t.tag,color:sel===s.id?"white":t.text,fontWeight:700,textAlign:"left",marginBottom:6,border:"none",display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:13,fontFamily:"Nunito,sans-serif"}}>
                <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>📚 {s.name}</span>
                <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0}}>
                  <span style={{opacity:.7,fontSize:10}}>{s.files.length}</span>
                  <button onClick={e=>{e.stopPropagation();persist(subjects.filter(x=>x.id!==s.id));if(sel===s.id)setSel(null);}} style={{background:"none",color:sel===s.id?"rgba(255,255,255,0.6)":"#ef444466",fontSize:13}}>🗑️</button>
                </div>
              </button>
            ))}
          </Card>
        </div>
        <Card t={t}>
          {sel?(
            <>
              <h3 style={{color:t.text,fontWeight:800,marginBottom:13,fontSize:14}}>📂 {subjects.find(s=>s.id===sel)?.name}</h3>
              <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
                <input value={nf} onChange={e=>setNf(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&nf){persist(subjects.map(s=>s.id===sel?{...s,files:[...s.files,{name:nf,type:nf.split(".").pop()}]}:s));setNf("");}}} placeholder="Filename (e.g. notes.pdf)" style={{flex:1,minWidth:160,padding:"9px 12px",borderRadius:10,background:t.input,border:`1.5px solid ${t.inputBorder}`,color:t.text,fontWeight:600,fontSize:13,fontFamily:"Nunito,sans-serif"}}/>
                <button onClick={()=>{if(!nf)return;persist(subjects.map(s=>s.id===sel?{...s,files:[...s.files,{name:nf,type:nf.split(".").pop()}]}:s));setNf("");}} style={{padding:"9px 16px",borderRadius:10,background:t.btnGrad,color:"white",fontWeight:700,fontSize:14}}>Add</button>
              </div>
              {subjects.find(s=>s.id===sel)?.files.length===0&&<div style={{textAlign:"center",color:t.textSub,padding:24,fontSize:12}}>No files yet. Add a filename above!</div>}
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(min(125px,100%),1fr))",gap:10}}>
                {subjects.find(s=>s.id===sel)?.files.map((f,i)=>(
                  <div key={i} style={{background:t.tag,border:`1.5px solid ${t.cardBorder}`,borderRadius:13,padding:13,textAlign:"center",position:"relative"}}>
                    <button onClick={()=>persist(subjects.map(s=>s.id===sel?{...s,files:s.files.filter((_,fi)=>fi!==i)}:s))} style={{position:"absolute",top:6,right:6,background:"none",color:"#ef444466",fontSize:12}}>✕</button>
                    <div style={{fontSize:"clamp(24px,5vw,30px)",marginBottom:6}}>{fi(f.type)}</div>
                    <div style={{color:t.text,fontWeight:700,fontSize:11,wordBreak:"break-word"}}>{f.name}</div>
                  </div>
                ))}
              </div>
            </>
          ):<div style={{textAlign:"center",padding:"clamp(24px,5vw,40px)",color:t.textSub}}><div style={{fontSize:52}}>📁</div><p style={{fontWeight:700,marginTop:10,fontSize:13}}>Select a subject to view files</p></div>}
        </Card>
      </div>
    </div>
  );
}

// ─── NOTES ────────────────────────────────────────────────────────────────────
export function Notes({ t, userData, saveKey, notify }) {
  const [notes,setNotes]=useState(userData?.notes||[]);
  const [active,setActive]=useState(notes.length>0?notes[0]:null);
  const cols=["#a855f7","#ec4899","#3b82f6","#10b981","#f59e0b","#06b6d4"];
  const persist=async v=>{setNotes(v);await saveKey("notes",v);};
  const newNote=()=>{const n={id:Date.now(),title:"New Note",content:"",color:cols[notes.length%cols.length],date:new Date().toLocaleDateString()};persist([n,...notes]);setActive(n);};
  const sv=(field,val)=>{const u={...active,[field]:val};setActive(u);persist(notes.map(n=>n.id===active.id?u:n));};
  return(
    <div style={{animation:"fadeIn 0.45s ease"}}>
      <PH t={t} emoji="✍️" title="Notes" sub="Capture your thoughts 💭"/>
      <div style={{display:"grid",gridTemplateColumns:"clamp(200px,26%,235px) 1fr",gap:"clamp(10px,2vw,18px)",height:"clamp(400px,calc(100vh - 200px),600px)"}}>
        <Card t={t} style={{overflow:"auto",display:"flex",flexDirection:"column"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,flexShrink:0}}>
            <h3 style={{color:t.text,fontWeight:800,fontSize:14}}>My Notes</h3>
            <button onClick={newNote} style={{background:t.btnGrad,color:"white",borderRadius:9,padding:"5px 13px",fontWeight:800,fontSize:16}}>+</button>
          </div>
          {notes.length===0&&<div style={{color:t.textSub,fontSize:12}}>No notes yet. Create one! ✏️</div>}
          <div style={{flex:1,overflow:"auto"}}>
            {notes.map(n=>(
              <div key={n.id} onClick={()=>setActive(n)} style={{padding:"10px 11px",borderRadius:11,background:active?.id===n.id?t.tag:"transparent",border:`2px solid ${active?.id===n.id?n.color:"transparent"}`,cursor:"pointer",marginBottom:6,transition:"all 0.15s"}}>
                <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:3}}><div style={{width:9,height:9,borderRadius:"50%",background:n.color,flexShrink:0}}/><span style={{color:t.text,fontWeight:700,fontSize:12,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{n.title}</span></div>
                <p style={{color:t.textSub,fontSize:10,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{n.content||"Empty note…"}</p>
              </div>
            ))}
          </div>
        </Card>
        {active?(
          <Card t={t} style={{display:"flex",flexDirection:"column"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:13,flexShrink:0,flexWrap:"wrap"}}>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{cols.map(c=><button key={c} onClick={()=>sv("color",c)} style={{width:18,height:18,borderRadius:"50%",background:c,border:`2.5px solid ${active.color===c?t.text:"transparent"}`,outline:"none"}}/>)}</div>
              <button onClick={()=>{persist(notes.filter(n=>n.id!==active.id));setActive(notes.find(n=>n.id!==active.id)||null);}} style={{marginLeft:"auto",background:"none",color:"#ef4444",fontSize:18,padding:2}}>🗑️</button>
            </div>
            <input value={active.title} onChange={e=>sv("title",e.target.value)} style={{fontSize:"clamp(16px,3.5vw,20px)",fontWeight:800,background:"none",border:"none",color:t.text,padding:"7px 0",borderBottom:`2px solid ${active.color}`,marginBottom:13,outline:"none",flexShrink:0,fontFamily:"Nunito,sans-serif"}}/>
            <textarea value={active.content} onChange={e=>sv("content",e.target.value)} placeholder="Start writing… ✍️" style={{flex:1,background:"none",border:"none",color:t.text,resize:"none",fontSize:"clamp(12px,2.5vw,14px)",lineHeight:1.8,fontWeight:500,outline:"none",fontFamily:"Nunito,sans-serif"}}/>
          </Card>
        ):<Card t={t} style={{display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:10}}><span style={{fontSize:48}}>✍️</span><span style={{color:t.textSub,fontWeight:700,fontSize:13}}>Select or create a note</span></Card>}
      </div>
    </div>
  );
}

// ─── TODO ─────────────────────────────────────────────────────────────────────
export function TodoTab({ t, userData, saveKey, notify }) {
  const [todos,setTodos]=useState(userData?.todos||[]);
  const [inp,setInp]=useState(""); const [cat,setCat]=useState("Study"); const [pri,setPri]=useState("medium");
  const pC={high:"#ef4444",medium:"#f59e0b",low:"#10b981"};
  const persist=async v=>{setTodos(v);await saveKey("todos",v);};
  const add=()=>{if(!inp)return;persist([{id:Date.now(),text:inp,done:false,cat,priority:pri},...todos]);setInp("");notify("Task added! ✅");};
  const toggle=id=>persist(todos.map(t=>t.id===id?{...t,done:!t.done}:t));
  const pending=todos.filter(t=>!t.done), done=todos.filter(t=>t.done);
  return(
    <div style={{animation:"fadeIn 0.45s ease"}}>
      <PH t={t} emoji="✅" title="To-Do List" sub="Crush your daily tasks! 💪"/>
      <div style={{display:"grid",gridTemplateColumns:"clamp(240px,28%,265px) 1fr",gap:"clamp(10px,2vw,18px)"}}>
        <Card t={t}>
          <h3 style={{color:t.text,fontWeight:800,marginBottom:12,fontSize:14}}>Add Task</h3>
          <FInput t={t} placeholder="What needs to be done?" value={inp} onChange={setInp}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
            <SelectInput t={t} value={cat} onChange={setCat}>{["Study","Project","Personal","Health","Other"].map(c=><option key={c} value={c}>{c}</option>)}</SelectInput>
            <SelectInput t={t} value={pri} onChange={setPri}><option value="high">🔴 High</option><option value="medium">🟡 Medium</option><option value="low">🟢 Low</option></SelectInput>
          </div>
          <Btn t={t} onClick={add}>Add Task ➕</Btn>
          <div style={{marginTop:13,display:"flex",gap:9}}>
            <div style={{flex:1,background:t.tag,borderRadius:11,padding:11,textAlign:"center"}}><div style={{fontSize:"clamp(18px,4vw,22px)",fontWeight:900,color:t.accent}}>{pending.length}</div><div style={{color:t.textSub,fontSize:10,fontWeight:700}}>Pending</div></div>
            <div style={{flex:1,background:t.tag,borderRadius:11,padding:11,textAlign:"center"}}><div style={{fontSize:"clamp(18px,4vw,22px)",fontWeight:900,color:"#10b981"}}>{done.length}</div><div style={{color:t.textSub,fontSize:10,fontWeight:700}}>Done</div></div>
          </div>
        </Card>
        <div>
          <Card t={t} style={{marginBottom:13}}>
            <h3 style={{color:t.text,fontWeight:800,marginBottom:11,fontSize:14}}>⚡ Pending</h3>
            {pending.length===0&&<div style={{color:t.textSub,textAlign:"center",padding:13,fontSize:12}}>🎉 All tasks done!</div>}
            {pending.map(td=>(
              <div key={td.id} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 0",borderBottom:`1px solid ${t.cardBorder}`}}>
                <button onClick={()=>toggle(td.id)} style={{width:22,height:22,borderRadius:7,border:`2px solid ${t.accent}`,background:"transparent",flexShrink:0}}/>
                <span style={{flex:1,color:t.text,fontWeight:700,fontSize:"clamp(12px,2.5vw,13px)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{td.text}</span>
                <Badge color="#6b7280">{td.cat}</Badge>
                <div style={{width:8,height:8,borderRadius:"50%",background:pC[td.priority],flexShrink:0}}/>
                <button onClick={()=>persist(todos.filter(x=>x.id!==td.id))} style={{background:"none",fontSize:14,flexShrink:0}}>🗑️</button>
              </div>
            ))}
          </Card>
          {done.length>0&&<Card t={t}><h3 style={{color:t.textSub,fontWeight:800,marginBottom:11,fontSize:14}}>✅ Completed</h3>{done.map(td=><div key={td.id} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 0",borderBottom:`1px solid ${t.cardBorder}`,opacity:.6}}><button onClick={()=>toggle(td.id)} style={{width:22,height:22,borderRadius:7,background:"#10b981",color:"white",fontSize:11,flexShrink:0}}>✓</button><span style={{flex:1,color:t.text,fontWeight:700,fontSize:"clamp(12px,2.5vw,13px)",textDecoration:"line-through",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{td.text}</span><button onClick={()=>persist(todos.filter(x=>x.id!==td.id))} style={{background:"none",fontSize:14,flexShrink:0}}>🗑️</button></div>)}</Card>}
        </div>
      </div>
    </div>
  );
}

// ─── STORE ────────────────────────────────────────────────────────────────────
export function Store({ t, user, saveKey, savePref, addPoints, applyTheme, activeThemeId, notify, dark }) {
  const owned = user?.ownedThemes || [];
  const buy = async item => {
    if ((user?.points||0) < item.cost) { notify("Not enough points! 😅","❌"); return; }
    if (owned.includes(item.id)) { applyTheme(item.id); notify(`${item.name} applied! ✨`); return; }
    const no = [...owned, item.id];
    await savePref({ ownedThemes: no, points: (user?.points||0) - item.cost });
    applyTheme(item.id);
    notify(`${item.emoji} ${item.name} unlocked! 🎉`);
  };
  const byRarity = ["Common","Uncommon","Rare","Legendary"];
  return(
    <div style={{animation:"fadeIn 0.45s ease"}}>
      <PH t={t} emoji="🛍️" title="Rewards Store" sub="Spend your hard-earned study points! ⭐"/>
      <Card t={t} style={{marginBottom:22,display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
        <span style={{fontSize:36,animation:"pulse 2s infinite"}}>⭐</span>
        <div><div style={{fontSize:"clamp(24px,5vw,30px)",fontWeight:900,color:t.accent}}>{user?.points||0}</div><div style={{color:t.textSub,fontWeight:700,fontSize:13}}>Points Available</div></div>
        <div style={{marginLeft:"auto",color:t.textSub,fontSize:12,fontWeight:600,textAlign:"right"}}>Study 1 hour = +10 points 📚</div>
      </Card>
      {byRarity.map(rarity=>{
        const items=STORE_ITEMS.filter(i=>i.rarity===rarity);
        return(
          <div key={rarity} style={{marginBottom:22}}>
            <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:12}}>
              <div style={{width:4,height:18,borderRadius:99,background:RARITY_COLORS[rarity]}}/>
              <h3 style={{color:t.text,fontWeight:900,fontSize:"clamp(13px,3vw,15px)"}}>{rarity}</h3>
              <Badge color={RARITY_COLORS[rarity]}>{items.length} themes</Badge>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(min(165px,100%),1fr))",gap:12}}>
              {items.map(item=>{
                const isOwned=owned.includes(item.id), isActive=activeThemeId===item.id, canBuy=(user?.points||0)>=item.cost;
                const previewBg = dark ? item.dark : item.light;
                return(
                  <div key={item.id} style={{background:t.card,border:`1.5px solid ${isActive?t.accent:isOwned?t.accent+"55":t.cardBorder}`,borderRadius:16,overflow:"hidden",boxShadow:isActive?`0 4px 20px ${t.accent}44`:t.shadow,backdropFilter:"blur(14px)",transition:"all 0.2s"}}>
                    <div style={{height:76,background:previewBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:34,position:"relative"}}>
                      {item.emoji}
                      {isActive&&<div style={{position:"absolute",top:5,right:5,background:t.accent,borderRadius:99,padding:"2px 7px",fontSize:9,fontWeight:800,color:"white"}}>ACTIVE</div>}
                    </div>
                    <div style={{padding:"clamp(10px,2vw,13px)"}}>
                      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:5}}>
                        <div style={{color:t.text,fontWeight:800,fontSize:"clamp(11px,2.5vw,13px)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.name}</div>
                        <Badge color={RARITY_COLORS[rarity]}>{rarity}</Badge>
                      </div>
                      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:9}}>
                        <span style={{color:t.accent,fontWeight:900,fontSize:12}}>⭐ {item.cost}</span>
                        <button onClick={()=>buy(item)} style={{padding:"6px 13px",borderRadius:9,background:isOwned?"#10b981":canBuy?t.btnGrad:t.tag,color:isOwned||canBuy?"white":t.textSub,fontWeight:800,fontSize:11,transition:"all 0.18s",fontFamily:"Nunito,sans-serif"}}>
                          {isOwned?(isActive?"✓ Active":"Apply"):canBuy?"Buy":"🔒"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
